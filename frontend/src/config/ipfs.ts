// IPFS Configuration for Pinata
export const IPFS_CONFIG = {
  apiKey: 'b8b7d3eaf1e4138e508e',
  secretKey: '29eaa62e3d111b58fa1e6c8e7bac33d977200ea9a590a15a879f7137820189ab',
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmNmE0YmQwYi05MWE4LTQ5MjYtOGM1Ny1mZDgzZjZkMDU1OTYiLCJlbWFpbCI6Im5pa2hoaWxzMDdAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiRlJBMSJ9LHsiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjEsImlkIjoiTllDMSJ9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImI4YjdkM2VhZjFlNDEzOGU1MDhlIiwic2NvcGVkS2V5U2VjcmV0IjoiMjllYWE2MmUzZDExMWI1OGZhMWU2YzhlN2JhYzMzZDk3NzIwMGVhOWE1OTBhMTVhODc5ZjcxMzc4MjAxODlhYiIsImV4cCI6MTc5MjQ1NjcyOH0.b4V8wlSLuFeg5uTrPB6OSlH2ubK1FTIMEXIGqa7b43s',
  gatewayUrl: 'https://gateway.pinata.cloud/ipfs/'
};

// IPFS Service for uploading files
export class IPFSService {
  private static async uploadToIPFS(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': IPFS_CONFIG.apiKey,
        'pinata_secret_api_key': IPFS_CONFIG.secretKey,
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload to IPFS');
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  private static async uploadJSONToIPFS(data: any): Promise<string> {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': IPFS_CONFIG.apiKey,
        'pinata_secret_api_key': IPFS_CONFIG.secretKey,
      },
      body: JSON.stringify({
        pinataContent: data,
        pinataMetadata: {
          name: `helix-${Date.now()}.json`
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to upload JSON to IPFS');
    }

    const result = await response.json();
    return result.IpfsHash;
  }

  // Upload document to IPFS
  static async uploadDocument(file: File): Promise<string> {
    return await this.uploadToIPFS(file);
  }

  // Upload claim evidence to IPFS
  static async uploadClaimEvidence(evidence: any): Promise<string> {
    return await this.uploadJSONToIPFS(evidence);
  }

  // Get IPFS URL
  static getIPFSUrl(hash: string): string {
    return `${IPFS_CONFIG.gatewayUrl}${hash}`;
  }
}
