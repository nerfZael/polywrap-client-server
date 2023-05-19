import { wrapClientPlugin } from "@nerfzael/wrap-client-plugin-wrapper";
import { ClientConfigBuilder, CoreClientConfig } from "@polywrap/client-js";
import { ExpirableResolutionResultCache } from "./ExpirableResolutionResultCache";
import * as EthProviderV1 from "@polywrap/ethereum-provider-js-v1";
import * as EthProvider from "@polywrap/ethereum-provider-js";

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
  builder.addPackage("plugin/ethereum-provider@1.1.0", EthProviderV1.plugin({
    connections: new EthProviderV1.Connections({
      networks: {
        mainnet: new EthProviderV1.Connection({
          provider:
            config.ethereum.providers.mainnet,
        }),
        goerli: new EthProviderV1.Connection({
          provider:
            config.ethereum.providers.goerli,
        }),
      },
    }),
  }));
  builder.addPackage("plugin/ethereum-provider@2.0.0", EthProvider.plugin({
    connections: new EthProvider.Connections({
      networks: {
        mainnet: new EthProvider.Connection({
          provider:
            config.ethereum.providers.mainnet,
        }),
        goerli: new EthProvider.Connection({
          provider:
            config.ethereum.providers.goerli,
        }),
      },
    }),
  }));

  return builder.build({
    resolutionResultCache: new ExpirableResolutionResultCache(config.polywrap.client.cache.expiration),
  });
};
