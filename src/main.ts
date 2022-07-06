#!/usr/bin/env node

import { startServer } from "./startServer";
import { getDefaultClientConfig } from "./getDefaultClientConfig";
import dotenv from "dotenv";
import fs from "fs";
import { ExpirableWrapperCache, PolywrapClientWithCustomCache } from "@nerfzael/polywrap-remote-client";

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

const client = new PolywrapClientWithCustomCache(getDefaultClientConfig(), {
  noDefaults: true,
  cache: new ExpirableWrapperCache(
    config.polywrap.client.cache.expiration
  )
});

(async () => {
  await startServer(client, config.server.port, config.server.requestTimeout);
})();