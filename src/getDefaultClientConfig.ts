import { ClientConfig, Uri, coreInterfaceUris, RedirectsResolver, CacheResolver, PluginResolver, PluginPackage, Env, ExtendableUriResolver, WasmWrapper } from "@polywrap/client-js";
import { WrapManifest } from "@polywrap/wrap-manifest-types-js";
import { ipfsPlugin } from "@polywrap/ipfs-plugin-js";
import { ethereumPlugin } from "@polywrap/ethereum-plugin-js";
import { PluginWrapper } from "@nerfzael/polywrap-remote-client";
import { ensResolverPlugin } from "@polywrap/ens-resolver-plugin-js";
import { ipfsResolverPlugin } from "@polywrap/ipfs-resolver-plugin-js";
import { sha3Plugin } from "@polywrap/sha3-plugin-js";
import { uts46Plugin } from "@polywrap/uts46-plugin-js";
import { config } from "./main";
import { httpPlugin } from "@nerfzael/http-plugin-wrapper";

export const getDefaultClientConfig = (): ClientConfig<string> => {
  const ethereumPluginConfig: {
    networks: Record<string, {
      provider: string
    }>
  } = {
    networks: {
      mainnet: {
        provider: config.ethereum.providers.mainnet
      },
      ropsten: {
        provider: config.ethereum.providers.ropsten
      },
      rinkeby: {
        provider: config.ethereum.providers.rinkeby
      }
    }
  };
  
  return {
    envs: [
      {
        uri: "wrap://ens/http.polywrap.eth",
        env: {
          urlPrefixWhitelist: [
          ],
          urlPrefixBlocklist: [
            "file",
            "localhost",
            "http://localhost",
            "https://localhost",
            "127.0.0.1",
            "http://127.0.0.1",
            "https://127.0.0.1",
          ]
        }
      }
    ],
    redirects: [],
    plugins: [
      // IPFS is required for downloading Polywrap packages
      {
        uri: "wrap://ens/ipfs.polywrap.eth",
        plugin: ipfsPlugin({
          provider: config.ipfs.defaultProviders[0],
          fallbackProviders: config.ipfs.defaultProviders.slice(1),
        }),
      },
      // ENS is required for resolving domain to IPFS hashes
      {
        uri: "wrap://ens/ens-resolver.polywrap.eth",
        plugin: ensResolverPlugin({}),
      },
      {
        uri: "wrap://ens/ethereum.polywrap.eth",
        plugin: ethereumPlugin(ethereumPluginConfig),
      },
      {
        uri: "wrap://ens/http.polywrap.eth",
        plugin: httpPlugin({}),
      },
      {
        uri: "wrap://ens/uts46.polywrap.eth",
        plugin: uts46Plugin({}),
      },
      {
        uri: "wrap://ens/sha3.polywrap.eth",
        plugin: sha3Plugin({}),
      },
      // {
      //   uri: new Uri("wrap://ens/graph-node.polywrap.eth"),
      //   plugin: graphNodePlugin({
      //     provider: "https://api.thegraph.com",
      //   }),
      // },
      // {
      //   uri: new Uri("wrap://ens/fs.polywrap.eth"),
      //   plugin: fileSystemPlugin({}),
      // },
      // {
      //   uri: new Uri("wrap://ens/fs-resolver.polywrap.eth"),
      //   plugin: fileSystemResolverPlugin({}),
      // },
      {
        uri: "wrap://ens/ipfs-resolver.polywrap.eth",
        plugin: ipfsResolverPlugin({
          provider: config.ipfs.defaultProviders[0],
          fallbackProviders: config.ipfs.defaultProviders.slice(1),
        }),
      },
    ],
    interfaces: [
      {
        interface: coreInterfaceUris.uriResolver.uri,
        implementations: [
          "wrap://ens/ipfs-resolver.polywrap.eth",
          "wrap://ens/ens-resolver.polywrap.eth",
          // new Uri("wrap://ens/fs-resolver.polywrap.eth"),
        ],
      },
      // {
      //   interface: coreInterfaceUris.logger,
      //   implementations: [new Uri("wrap://ens/js-logger.polywrap.eth")],
      // },
    ],
    uriResolvers: [
      new RedirectsResolver(),
      new CacheResolver(),
      new PluginResolver(
        (
          uri: Uri,
          plugin: PluginPackage<unknown>,
          environment: Env<Uri> | undefined
        ) => new PluginWrapper(uri, plugin, environment)
      ),
      new ExtendableUriResolver(
        (
          uri: Uri,
          manifest: WrapManifest,
          uriResolver: string,
          environment: Env<Uri> | undefined
        ) => {
          return new WasmWrapper(uri, manifest, uriResolver, environment);
        }
      ),
    ],
  };
};
