export const config = {
  server: {
    port: 8085,
    requestTimeout: 5000,
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
      "http://localhost:8080",
      "https://ipfs.wrappers.io",
      "https://ipfs.io",
    ]
  }
};