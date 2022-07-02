import { PolywrapClient } from "@polywrap/client-js";
import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import http from "http";
import { handleError } from "./handleError";
import timeout from "connect-timeout";

export const startServer = (client: PolywrapClient, port: number, requestTimeout: number): Promise<http.Server> => {
  const app = express();
  app.use(timeout(requestTimeout));

  app.set('view engine', 'html');
  app.set('views', path.join(__dirname, '../../ui'));
  app.use(express.json());

  app.all('*', handleError(async (req: Request, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    //Trim and redirect multiple slashes in URL
    if (req.url.match(/[/]{2,}/g)) {
      req.url = req.url.replace(/[/]+/g, '/');
      res.redirect(req.url);
      return;
    }

    if (req.method === 'OPTIONS') {
      res.send(200);
    } else {
      console.log(`Request:  ${req.method} --- ${req.url}`);
      next();
    }
  }));

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.on('finish', () => {
      console.log(`Response: ${req.method} ${res.statusCode} ${req.url}`);
    });
    next();
  });

  app.use(cors({
    origin: "*",
  }));

  app.post('/client/resolveUri', handleError(async (req, res) => {
    const { uri } = req.body;

    console.log("Body", {
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
      throw new Error("URI is not a wasm wrapper");
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

    console.log("Body", {
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

  app.get('/ens/:network/:domain/:method', handleError(async (req, res) => {
    const { network, domain, method } = req.params as any;

    console.log("Body", {
      uri: `ens/${network}/${domain}`,
      method,
      args: req.query
    });

    const result = await client.invoke({
      uri: `ens/${network}/${domain}`,
      method,
      args: req.query
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    if(sanitizedResult.error) {
      res.send(`<pre>${
        sanitizedResult.error
      }</pre>`);
    } else if(sanitizedResult.data) {
      if(typeof sanitizedResult.data === 'string' || sanitizedResult.data instanceof String) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else if(typeof sanitizedResult.data === 'number' || sanitizedResult.data instanceof Number) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else {
        res.send(`<pre>${
          JSON.stringify(sanitizedResult.data, null, 2)
        }</pre>`);
      }
    } else {
      res.send(`Executed method ${method}`);
    }
  }));

  app.get('/ens/:domain/:method', handleError(async (req, res) => {
    const { domain, method } = req.params as any;

    console.log("Body", {
      uri: `ens/${domain}`,
      method,
      args: req.query
    });

    const result = await client.invoke({
      uri: `ens/${domain}`,
      method,
      args: req.query
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    
    if(sanitizedResult.error) {
      res.send(`<pre>${
        sanitizedResult.error
      }</pre>`);
    } else if(sanitizedResult.data) {
      if(typeof sanitizedResult.data === 'string' || sanitizedResult.data instanceof String) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else if(typeof sanitizedResult.data === 'number' || sanitizedResult.data instanceof Number) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else {
        res.send(`<pre>${
          JSON.stringify(sanitizedResult.data, null, 2)
        }</pre>`);
      }
    } else {
      res.send(`Executed method ${method}`);
    }
  }));

  app.get('/ipfs/:cid/:method', handleError(async (req, res) => {
    const { cid, method } = req.params as any;

    console.log("Body", {
      uri: `ipfs/${cid}`,
      method,
      args: req.query
    });

    const result = await client.invoke({
      uri: `ipfs/${cid}`,
      method,
      args: req.query
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(sanitizedResult);

    
    if(sanitizedResult.error) {
      res.send(`<pre>${
        sanitizedResult.error
      }</pre>`);
    } else if(sanitizedResult.data) {
      if(typeof sanitizedResult.data === 'string' || sanitizedResult.data instanceof String) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else if(typeof sanitizedResult.data === 'number' || sanitizedResult.data instanceof Number) {
        res.send(`<pre>${
          sanitizedResult.data
        }</pre>`);
      } else {
        res.send(`<pre>${
          JSON.stringify(sanitizedResult.data, null, 2)
        }</pre>`);
      }
    } else {
      res.send(`Executed method ${method}`);
    }
  }));

  const server = http.createServer({}, app);
  
  return new Promise<http.Server>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Polywrap client-server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
};