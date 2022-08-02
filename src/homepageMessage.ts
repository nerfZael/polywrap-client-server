export const homepageMessage = `Say hello to magic links! 
Magic links are links you can use to execute a wrapper remotely.

Domain: wrap.link
Format for queries: wrap.link/i/{URI}/{METHOD}?{SOME_ARG_NAME}={SOME_ARG_VALUE}&{ANOTHER_ARG2_NAME}={ANOTHER_ARG_VALUE}
Format for schema:  wrap.link/schema/{URI}

Try it! 
  Queries:
    Simple wrapper: <a href="https://wrap.link/i/ens/rinkeby/simple.eth/simpleMethod?arg=Hello">wrap.link/i/ens/rinkeby/simple.eth/simpleMethod?arg=Hello</a>
    HTTP plugin: <a href="https://wrap.link/i/ens/http.polywrap.eth/get?url=https://www.google.com">wrap.link/i/ens/http.polywrap.eth/get?url=https://www.google.com</a>
  Schema:
    Simple wrapper: <a href="https://wrap.link/schema/ens/rinkeby/simple.eth">wrap.link/schema/ens/rinkeby/simple.eth</a>
    HTTP plugin: <a href="https://wrap.link/schema/ens/http.polywrap.eth">wrap.link/schema/ens/http.polywrap.eth</a>
`;