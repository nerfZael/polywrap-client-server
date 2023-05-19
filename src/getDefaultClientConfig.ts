import { wrapClientPlugin } from "@nerfzael/wrap-client-plugin-wrapper";
import { ClientConfigBuilder, CoreClientConfig } from "@polywrap/client-js";
import { ExpirableResolutionResultCache } from "./ExpirableResolutionResultCache";

export const getDefaultClientConfig = (config: {
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
}): CoreClientConfig => {
  
  const builder = new ClientConfigBuilder();
  builder.addDefaults();
  builder.removePackage("plugin/file-system@1.0.0");
  builder.removePackage("ens/wraps.eth:file-system@1.0.0");
  builder.addPackage("wrap://ens/wrap-client.eth", wrapClientPlugin({}));
  
  return builder.build({
    resolutionResultCache: new ExpirableResolutionResultCache(config.polywrap.client.cache.expiration),
  });
};
