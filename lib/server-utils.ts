interface PinataResponse {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

type IpfsHashResponse = {
  addresses: string[];
};

export const uploadAddresses = async (addresses: string[]): Promise<string> => {
  try {
    const jwtRes = await fetch("/api/generate-jwt", { method: "POST" });

    if (!jwtRes.ok) {
      throw new Error(`Failed to fetch JWT: ${jwtRes.statusText}`);
    }

    const JWT = await jwtRes.text();

    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${JWT}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ addresses })
    });

    if (!res.ok) {
      throw new Error(`Failed to upload addresses: ${res.statusText}`);
    }
    const json: PinataResponse = (await res.json()) as PinataResponse;

    return json.IpfsHash;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error uploading addresses:", message);
    throw new Error(message);
  }
};

export const getAddresses = async (ipfsHash: string): Promise<string[]> => {
  try {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch addresses: ${res.statusText}`);
    }
    const json: IpfsHashResponse = (await res.json()) as IpfsHashResponse;
    return json.addresses;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error getting addresses:", message);
    throw new Error(message);
  }
};
