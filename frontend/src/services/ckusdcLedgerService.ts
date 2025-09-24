/* eslint-disable @typescript-eslint/no-explicit-any */
// services/ckusdcLedgerService.ts
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { authService } from '../auth/authService';

// Minimal ICRC-1 ledger IDL
const idlFactory = ({ IDL }: any) => {
  const Subaccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({ owner: IDL.Principal, subaccount: IDL.Opt(Subaccount) });
  const Value = IDL.Variant({ Nat: IDL.Nat, Int: IDL.Int, Text: IDL.Text, Blob: IDL.Vec(IDL.Nat8) });
  const MetadataEntry = IDL.Tuple(IDL.Text, Value);
  const StandardRecord = IDL.Record({ name: IDL.Text, url: IDL.Text });
  const TransferArgs = IDL.Record({
    from_subaccount: IDL.Opt(Subaccount),
    to: Account,
    amount: IDL.Nat,
    fee: IDL.Opt(IDL.Nat),
    memo: IDL.Opt(IDL.Vec(IDL.Nat8)),
    created_at_time: IDL.Opt(IDL.Nat64),
  });
  const TransferError = IDL.Variant({
    BadFee: IDL.Record({ expected_fee: IDL.Nat }),
    BadBurn: IDL.Record({ min_burn_amount: IDL.Nat }),
    InsufficientFunds: IDL.Record({ balance: IDL.Nat }),
    TooOld: IDL.Null,
    CreatedInFuture: IDL.Record({ ledger_time: IDL.Nat64 }),
    Duplicate: IDL.Record({ duplicate_of: IDL.Nat }),
    TemporarilyUnavailable: IDL.Null,
    GenericError: IDL.Record({ error_code: IDL.Nat, message: IDL.Text }),
  });
  const TransferResult = IDL.Variant({ Ok: IDL.Nat, Err: TransferError });

  return IDL.Service({
    icrc1_name: IDL.Func([], [IDL.Text], ['query']),
    icrc1_symbol: IDL.Func([], [IDL.Text], ['query']),
    icrc1_decimals: IDL.Func([], [IDL.Nat8], ['query']),
    icrc1_fee: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_metadata: IDL.Func([], [IDL.Vec(MetadataEntry)], ['query']),
    icrc1_total_supply: IDL.Func([], [IDL.Nat], ['query']),
    icrc1_minting_account: IDL.Func([], [IDL.Opt(Account)], ['query']),
    icrc1_supported_standards: IDL.Func([], [IDL.Vec(StandardRecord)], ['query']),
    icrc1_balance_of: IDL.Func([Account], [IDL.Nat], ['query']),
    icrc1_transfer: IDL.Func([TransferArgs], [TransferResult], []),
  });
};

// Helper Option encoding for candid
const None: [] = [];
const Some = <T>(x: T) => [x] as [T];

export type Subaccount = Uint8Array | number[];
export type LedgerAccount = { owner: Principal; subaccount?: Subaccount };

class CkUSDCLedgerService {
  private actor: any = null;
  private agent: HttpAgent | null = null;
  private canisterId: string;

  constructor() {
    // Read from env, fall back to official mainnet ledger
    this.canisterId = (import.meta.env.VITE_CKUSDC_LEDGER_ID as string) || 'xevnm-gaaaa-aaaar-qafnq-cai';
  }

  async init(): Promise<void> {
    try {
      this.agent = authService.getAgent() || new HttpAgent({ host: 'https://ic0.app' });
      this.actor = Actor.createActor(idlFactory, {
        agent: this.agent,
        canisterId: this.canisterId,
      });
    } catch (error) {
      console.error('Failed to initialize ckUSDC ledger service:', error);
      throw error;
    }
  }

  private async ensureActor(): Promise<void> {
    if (!this.actor) await this.init();
  }

  private toSubaccountOpt(sub?: Subaccount): any {
    if (!sub) return None;
    const v = sub instanceof Uint8Array ? sub : Uint8Array.from(sub);
    return Some(v);
  }

  async name(): Promise<string> {
    await this.ensureActor();
    return await this.actor.icrc1_name();
  }

  async symbol(): Promise<string> {
    await this.ensureActor();
    return await this.actor.icrc1_symbol();
  }

  async decimals(): Promise<number> {
    await this.ensureActor();
    const d: number = await this.actor.icrc1_decimals();
    return Number(d);
  }

  async fee(): Promise<bigint> {
    await this.ensureActor();
    const f: bigint = await this.actor.icrc1_fee();
    return f;
  }

  async balanceOf(owner: Principal, subaccount?: Subaccount): Promise<bigint> {
    await this.ensureActor();
    const account = { owner, subaccount: this.toSubaccountOpt(subaccount) };
    const bal: bigint = await this.actor.icrc1_balance_of(account);
    return bal;
  }

  async transfer(
    toOwnerText: string,
    amount: bigint,
    options?: {
      to_subaccount?: Subaccount;
      from_subaccount?: Subaccount;
      fee?: bigint;
      memo?: Uint8Array;
      created_at_time_ns?: bigint;
    }
  ): Promise<{ ok?: bigint; err?: any }> {
    await this.ensureActor();

    const args = {
      from_subaccount: this.toSubaccountOpt(options?.from_subaccount),
      to: {
        owner: Principal.fromText(toOwnerText),
        subaccount: this.toSubaccountOpt(options?.to_subaccount),
      },
      amount,
      fee: options?.fee !== undefined ? Some(options.fee) : None,
      memo: options?.memo ? Some(options.memo) : None,
      created_at_time: Some(options?.created_at_time_ns ?? (BigInt(Date.now()) * 1_000_000n)),
    };

    const res = await this.actor.icrc1_transfer(args);
    return res as { ok?: bigint; err?: any };
  }

  // Helper to parse human-readable amount into nat amount respecting decimals
  async parseTokenAmount(amount: string | number): Promise<bigint> {
    const decimals = await this.decimals();
    const scale = BigInt(10) ** BigInt(decimals);
    const val = typeof amount === 'number' ? amount.toString() : amount;
    const [intPart, fracPart = ''] = val.split('.');
    const fracTrimmed = fracPart.slice(0, decimals).padEnd(decimals, '0');
    return BigInt(intPart) * scale + BigInt(fracTrimmed || '0');
  }

  formatTokenAmount(amount: bigint, decimals: number): string {
    const scale = BigInt(10) ** BigInt(decimals);
    const int = amount / scale;
    const frac = amount % scale;
    const fracStr = frac.toString().padStart(decimals, '0').replace(/0+$/, '');
    return fracStr ? `${int.toString()}.${fracStr}` : int.toString();
  }
}

export const ckusdcLedgerService = new CkUSDCLedgerService();
export default ckusdcLedgerService;