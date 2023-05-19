#!/usr/bin/env node

import { startServer } from "./startServer";
import dotenv from "dotenv";
import fs from "fs";
import { getDefaultClientConfig } from "./getDefaultClientConfig";
import { PolywrapClient } from "@polywrap/client-js";
dotenv.config({ path: ".env" });

export const config: {
  polywrap: {
    client: {
      cache: {
        expiration: Record<string, number>
      }
    }
  },
  server: {
    port: number,
    requestTimeout: number,
  },
  ethereum: {
    providers: {
      mainnet: string,
      ropsten: string,
      rinkeby: string,
      goerli: string,
      polygon: string
    };
  },
  ipfs: {
    defaultProviders: string[]
  }
} = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE_PATH!, "utf8"));

const client = new PolywrapClient(getDefaultClientConfig(config));

(async () => {
  await startServer(client, config.server.port, config.server.requestTimeout);
})();