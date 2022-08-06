import { PolywrapClient } from "@polywrap/client-js";
import { Express } from "express";
import { handleError } from "./handleError";
import { escapeHTML } from "./utils/escapeHTML";
import { msgpackDecode, msgpackEncode } from "@polywrap/msgpack-js";

export const useWrapLinkRoutes = (app: Express, client: PolywrapClient) => {
  app.get('/resolve/:path(*)', handleError(async (req, res) => {
    const { path } = req.params as any;
  
    console.log("Resolve", {
      uri: `${path}`,
      query: req.query
    });

    const result = await client.resolveUri(path, {
      noCacheRead: req.query.nocacheread === "true",
      noCacheWrite: req.query.nocachewrite === "true",
    });

    res.send(`<pre>${escapeHTML(JSON.stringify(result.uriHistory, null, 2))}</pre>`);
  }));

  app.get('/:path(*)', handleError(async (req, res) => {
    const { path } = req.params as any;
  
    console.log("GET", {
      uri: `${path}`,
      query: req.query
    });
   
    const result = await client.invoke<WrapLinkResponse>({
      uri: "wrap://ens/wrap-link.eth",
      method: "get",
      args: {
        path,
        args:  req.query && Object.keys(req.query).length > 0 
          ? msgpackEncode(req.query)
          : undefined
      }
    });

    const sanitizedResult = {
      data: result.data,
      error: result.error
        ? result.error.message
        : undefined
    };

    console.log(`Result of ${path}`, sanitizedResult);
    
    if(sanitizedResult.error) {
      res.send(`<pre>${
        escapeHTML(sanitizedResult.error)
      }</pre>`);
      return;
    } else if(sanitizedResult.data) {
      const response = sanitizedResult.data;

      if(!response) {
        res.end();
        return;
      }

      let isMsgpackResponse = false;
  
      if (response.headers && response.headers.length > 0) {
        const headers: Record<string, string> = {};

        for (const header of response.headers) {

          if(header.name === "Content-Type" && header.value === "msgpack") {
            isMsgpackResponse = true;
          } else {
            headers[header.name] = header.value;
          }
        }

        if (isMsgpackResponse) {
          res.writeHead(200, {
            "Content-Type": "text/html",
            ...headers
          });
        } else {
          res.writeHead(200, headers);
        }
      }

      if (isMsgpackResponse) {
        if (response.data) {
          const data = msgpackDecode(response.data);
          res.end(`<pre>${escapeHTML(JSON.stringify(data, null, 2))}</pre>`);
        }
      } else {
        response.data && res.end(response.data);
      }
    } else {
      res.send(`Unknown response`);
      return;
    }
  }));
};

type WrapLinkResponse = {
  headers?: WrapLinkHeader[],
  data: Uint8Array
}

type WrapLinkHeader = {
  name: string
  value: string
}