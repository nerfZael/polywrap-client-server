import { PolywrapClient, PolywrapClientConfig } from "@polywrap/client-js";

export class CustomPolywrapClient extends PolywrapClient {
  constructor(config?: Partial<PolywrapClientConfig>, options?: {
    noDefaults?: boolean;
    cache?: Map<string, any>;
  }) {
    super(config);

    if(options?.cache) {
      this["_wrapperCache"] = options.cache;
    }
  }
}