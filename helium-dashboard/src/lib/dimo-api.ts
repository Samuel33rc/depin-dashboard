import axios from 'axios';

const DIMO_API = 'https://identity-api.dimo.zone';

export interface Vehicle {
  tokenId: number;
  make: string;
  model: string;
  year: number;
}

export interface DIMOStats {
  totalVehicles: number;
  vehicles: Vehicle[];
}

interface DimoApiVehicleNode {
  tokenId: number;
  definition?: {
    make?: string;
    model?: string;
    year?: number;
  };
}

interface DimoApiResponse {
  data?: {
    vehicles?: {
      nodes?: DimoApiVehicleNode[];
    };
  };
}

export async function getVehicleData(walletAddress: string): Promise<DIMOStats | null> {
  if (!walletAddress) return null;

  try {
    const query = `
      query GetVehicles($address: Address!) {
        vehicles(filterBy: { owner: $address }, first: 10) {
          nodes {
            tokenId
            definition {
              make
              model
              year
            }
          }
        }
      }
    `;

    const response = await axios.post<DimoApiResponse>(
      DIMO_API,
      {
        query,
        variables: { address: walletAddress }
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const vehicles = response.data.data?.vehicles?.nodes || [];
    
    return {
      totalVehicles: vehicles.length,
      vehicles: vehicles.map((v: DimoApiVehicleNode) => ({
        tokenId: v.tokenId,
        make: v.definition?.make || 'Unknown',
        model: v.definition?.model || 'Unknown',
        year: v.definition?.year || 0
      }))
    };
  } catch (error) {
    console.error('Error fetching DIMO data:', error);
    return null;
  }
}
