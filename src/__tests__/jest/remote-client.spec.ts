import { PolywrapClient } from "@polywrap/client-js";
import { startServer } from "../../startServer";
import { PolywrapRemoteClient } from "../../PolywrapRemoteClient";
import { PolywrapRemoteExecutionClient, PolywrapRemoteResolutionClient } from "@nerfzael/polywrap-remote-client";

jest.setTimeout(30000);

const PORT = 8085;

describe("Remote client", () => {
  it("remote execution", async () => {
    const client = new PolywrapClient();
    const server = await startServer(client, PORT);

    const remoteClient = new PolywrapRemoteClient(`http://localhost:${PORT}/client`);

    const result2 = await remoteClient.invoke({
      uri: `file//home/nerfzael/dev/nerfZael/polywrap-remote/polywrap-remote-client-server/src/__tests__/wrappers/simple`,
      method: "simpleMethod",
      args: {
        arg: "remote execution"
      }
    });

    await new Promise<void>((resolve, reject) => {
      server.close(() => {
        resolve()
      });
    });
  });

  it("remote resolution", async () => {
    const client = new PolywrapClient();
    const server = await startServer(client, PORT);

    const remoteClient = new PolywrapRemoteResolutionClient(`http://localhost:${PORT}/client`);

    const result = await remoteClient.invoke({
      uri: `file//home/nerfzael/dev/nerfZael/polywrap-remote/polywrap-remote-client-server/src/__tests__/wrappers/simple`,
      method: "simpleMethod",
      args: {
        arg: "remote resolution"
      }
    });

    await new Promise<void>((resolve, reject) => {
      server.close(() => {
        resolve()
      });
    });
  });
});
