import { PolywrapClient } from "@polywrap/client-js";
import { Express } from "express";
import { handleError } from "./handleError";

export const useRemoteClientRoutes = (app: Express, client: PolywrapClient) => {
  app.post('/client/resolveUri', handleError(async (req, res) => {
    const { uri } = req.body;

    console.log("/client/resolveUri", {
      uri,
    });

    const { uri: resultUri, wrapper, error } = await client.resolveUri(uri);

    if(!wrapper || error) {
      if(error) {
        console.log(`${error.type}: ${error.error?.message}`);
      } else {
        console.log(`Successfully resolved URI: ${uri} -> ${resultUri}`);
      }

      const sanitizedResult = {
        uri: resultUri,
        error: error
          ? {
            type: error.type,
            message: error.error?.message,
          }
          : undefined
      };

      res.json(sanitizedResult);
      return;
    }
    if (!(wrapper as any)["_getWasmModule"]) {
      res.status(500).send("URI is not a wasm wrapper");
      return;
    }

    const resolver = (wrapper as any)["_uriResolver"];
    const manifest: string = await wrapper?.getFile({
      path: "polywrap.json",
      encoding: "utf-8",
    }, client) as string;

    const module: ArrayBuffer = await (wrapper as any)["_getWasmModule"](client);

    const sanitizedResult = {
      uri: resultUri,
      module: Array.from(new Uint8Array(module)),
      manifest,
      resolver,
    };

    console.log(`Successfully resolved URI: ${uri} -> ${resultUri}`);

    res.json(sanitizedResult);
  }));
  
  app.post('/client/invoke', handleError(async (req, res) => {
    const { uri, method, args } = req.body;

    console.log("/client/invoke", {
      uri,
      method,
      args
    });

    const result = await client.invoke({
      uri,
      method,
      args
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    res.json(sanitizedResult);
  }));
};