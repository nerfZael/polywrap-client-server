#!/usr/bin/env node

import {  PolywrapClient } from "@polywrap/client-js";
import { startServer } from "./startServer";
import { getDefaultClientConfig } from "./getDefaultClientConfig";
import { config } from "./config";
import { ExpirableWrapperCache } from "./ExpirableWrapperCache";
import { CustomPolywrapClient } from "./CustomPolywrapClient";

export * from './startServer';

const client = new CustomPolywrapClient(getDefaultClientConfig(), {
  noDefaults: true,
  cache: new ExpirableWrapperCache(
    config.polywrap.client.cache
  )
});

(async () => {
  await startServer(client, config.server.port, config.server.requestTimeout);
})();