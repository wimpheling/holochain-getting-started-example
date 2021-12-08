import { AppWebsocket, CallZomeRequest } from '@holochain/conductor-api';

const WS_URL = 'ws://localhost:8888';
// The name of the happ. For some reason it seems to always be "test-app" whatever name you choose in your hApp config ?
const H_APP_ID = 'test-app';
// The name of the zome
const ZOME_NAME = 'numbers';
// The name of the function
const FN_NAME = 'add_ten';

interface ZomeInput {
    original_number: number;
}

interface ZomeOutput {
    other_number: number;
}

// This is the typing of our client API
export type HolochainConductor = {
    addTen: (originalNumber: number) => Promise<ZomeOutput>,
    close: () => void
}

export const initMyHappClient = async (): Promise<HolochainConductor> => {
    const appClient = await AppWebsocket.connect(WS_URL)
    // connect to the running holochain conductor
    const appInfo = await appClient.appInfo({ installed_app_id: H_APP_ID });
    if (!appInfo?.cell_data[0]) {
      throw new Error('No app info found');
    }
  
    return {
      addTen: async (originalNumber: number) => {
        const cell_id = appInfo.cell_data[0].cell_id;
        const payload: ZomeInput = { original_number: originalNumber };
        // define the context of the request
        const apiRequest: CallZomeRequest =
        {
          cap: null,
          cell_id,
          zome_name: ZOME_NAME,
          fn_name: FN_NAME,
          provenance: cell_id[1], // AgentPubKey,
          payload
        };
      
        try {
          // make the request
          const numbersOutput: ZomeOutput = await appClient.callZome(apiRequest);
          // the result is already deserialized
          return numbersOutput
        } catch (error) {
          console.log('Got an error:', error);
          throw error;
        }
      },
      close: () => {
        appClient.client.close();
      }
    }
  }
  