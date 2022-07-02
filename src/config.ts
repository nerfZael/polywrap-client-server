export const config = {
  server: {
    port: 8085,
    requestTimeout: 10000,
  },
  ethereum: {
    providers: {
      mainnet: "mainnet",
      ropsten: "ropsten",
      rinkeby: "rinkeby",
    }
  },
  ipfs: {
    defaultProviders: [
      "https://ipfs.io",
      "https://ipfs.wrappers.io"
    ]
  }
};