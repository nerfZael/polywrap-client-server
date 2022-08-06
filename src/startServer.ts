import { PolywrapClient } from "@polywrap/client-js";
import cors from "cors";
import express, { Request, Response, NextFunction, Express } from "express";
import path from "path";
import http from "http";
import { handleError } from "./handleError";
import timeout from "connect-timeout";
import { homepageMessage } from "./homepageMessage";
import { useRemoteClientRoutes } from "./useRemoteClientRoutes";
import { useWrapLinkRoutes } from "./useWrapLinkRoutes";

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
      const parts = req.url.split("?");
      const url = parts[0].replace(/[/]+/g, "/");
      if(parts.length > 1 && url !== parts[0]) {
        res.redirect(url + "?" + parts.slice(1, parts.length).join("?"));
        return;
      }
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

  app.get('/', handleError(async (req, res) => {
    res.send(`<pre>${homepageMessage}</pre>`);
  }));

  useRemoteClientRoutes(app, client);
  useWrapLinkRoutes(app, client);

  const server = http.createServer({}, app);
  
  return new Promise<http.Server>((resolve, reject) => {
    server.listen(port, () => {
      console.log(`Polywrap client-server listening on http://localhost:${port}`);
      resolve(server);
    });
  });
};
