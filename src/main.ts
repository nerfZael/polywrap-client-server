#!/usr/bin/env node

import {  PolywrapClient } from "@polywrap/client-js";
import { startServer } from "./startServer";
import { getDefaultClientConfig } from "./getDefaultClientConfig";
import { config } from "./config";

export * from './PolywrapRemoteClient';
export * from './startServer';

const client = new PolywrapClient(getDefaultClientConfig(), {
  noDefaults: true
});

(async () => {
  await startServer(client, config.server.port, config.server.requestTimeout);
})();