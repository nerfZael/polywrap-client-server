#!/usr/bin/env node

import {  PolywrapClient } from "@polywrap/client-js";
import { startServer } from "./startServer";
import { getDefaultClientConfig } from "./getDefaultClientConfig";
import { ExpirableWrapperCache } from "./ExpirableWrapperCache";
import { CustomPolywrapClient } from "./CustomPolywrapClient";
import dotenv from "dotenv";
import fs from "fs";

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
      rinkeby: string
    };
  },
  ipfs: {
    defaultProviders: string[]
  }
} = JSON.parse(fs.readFileSync(process.env.CONFIG_FILE_PATH!, "utf8"));

const client = new CustomPolywrapClient(getDefaultClientConfig(), {
  noDefaults: true,
  cache: new ExpirableWrapperCache(
    config.polywrap.client.cache.expiration
  )
});

(async () => {
  await startServer(client, config.server.port, config.server.requestTimeout);
})();