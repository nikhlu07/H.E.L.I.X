import { InviteMemberModal } from "@/components/ui/invite-member-modal";
import { cn } from '@/lib/utils';

export default function DemoOne() {
 	return (
		<div className="relative flex min-h-screen w-full items-center justify-center px-4 py-10">
			<InviteMemberModal />
			<div
				aria-hidden="true"
				className={cn(
					'pointer-events-none -z-10 absolute -top-10 left-1/2 size-full -translate-x-1/2 rounded-full',
					'bg-[radial-gradient(ellipse_at_center,--theme(--color-foreground/.1),transparent_50%)]',
					'blur-[30px]',
				)}
			/>
		</div>
	);
}
