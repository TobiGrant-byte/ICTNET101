import http from "http";
import next from "next";
import Docker from "dockerode";
import { WebSocketServer, WebSocket } from "ws";
import { createClient } from "@supabase/supabase-js";

const dev =
  process.env.NODE_ENV !== "production";

const hostname = "localhost";
const port =
  Number(process.env.PORT) || 3000;

const app = next({
  dev,
  hostname,
  port,
});

const handle =
  app.getRequestHandler();

const docker = new Docker();

const CONTAINER_NAME =
  "ictnet101-dev-lab";

const IMAGE_NAME =
  "ictnet101-networking-lab";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase environment variables."
  );
}

const supabase = createClient(
  supabaseUrl ?? "",
  supabaseAnonKey ?? ""
);

type TaskId =
  | "ip-config"
  | "ping-gateway"
  | "trace-route"
  | "dns-lookup"
  | "arp-table"
  | "connections"
  | "routing-table"
  | "default-route"
  | "dns-record"
  | "network-config"
  | "wifi-info";

async function getOrCreateContainer(): Promise<Docker.Container> {
  let container: Docker.Container | null =
    null;

  try {
    container =
      docker.getContainer(
        CONTAINER_NAME
      );

    const info =
      await container.inspect();

    if (!info.State.Running) {
      await container.start();
    }

    return container;
  } catch {
    // Container does not exist yet.
  }

  console.log(
    "Creating ICTNET101 lab container..."
  );

  container =
    await docker.createContainer({
      name: CONTAINER_NAME,
      Image: IMAGE_NAME,
      Cmd: ["/bin/bash"],
      Tty: true,
      OpenStdin: true,
      StdinOnce: false,
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      WorkingDir: "/home/student",
    });

  await container.start();

  return container;
}

async function execCommand(
  container: Docker.Container,
  command: string[]
): Promise<{
  code: number;
  output: string;
}> {
  const exec =
    await container.exec({
      Cmd: command,
      AttachStdout: true,
      AttachStderr: true,
      Tty: false,
    });

  const stream =
    await exec.start({
      hijack: true,
      stdin: false,
      Tty: false,
    });

  return new Promise(
    (resolve, reject) => {
      const chunks: Buffer[] = [];

      stream.on(
        "data",
        (chunk: Buffer) => {
          chunks.push(chunk);
        }
      );

      stream.on(
        "end",
        async () => {
          try {
            const inspect =
              await exec.inspect();

            resolve({
              code:
                inspect.ExitCode ?? 0,
              output:
                Buffer.concat(
                  chunks
                ).toString("utf8"),
            });
          } catch (error) {
            reject(error);
          }
        }
      );

      stream.on(
        "error",
        reject
      );
    }
  );
}

async function userFromAccessToken(
  accessToken: string
) {
  const {
    data,
    error,
  } =
    await supabase.auth.getUser(
      accessToken
    );

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function checkTask(
  task: TaskId,
  container: Docker.Container
): Promise<{
  correct: boolean;
  message?: string;
}> {
  switch (task) {
    /*
     * MODULE 1
     */

    case "ip-config": {
      const result =
        await execCommand(
          container,
          ["bash", "-lc", "ip a"]
        );

      const correct =
        result.code === 0 &&
        (
          result.output.includes(
            "inet "
          ) ||
          result.output.includes(
            "eth0"
          ) ||
          result.output.includes(
            "ens"
          )
        );

      return {
        correct,
        message: correct
          ? "Network interfaces and IP configuration detected."
          : "No usable IP configuration was detected.",
      };
    }

    case "ping-gateway": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ping -c 1 127.0.0.1",
          ]
        );

      const correct =
        result.code === 0;

      return {
        correct,
        message: correct
          ? "Connectivity test completed successfully."
          : "The connectivity test failed.",
      };
    }

    case "trace-route": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "traceroute -m 4 -w 1 example.com || tracepath -m 4 example.com",
          ]
        );

      const correct =
        result.code === 0 &&
        result.output.trim()
          .length > 0;

      return {
        correct,
        message: correct
          ? "A network path was successfully inspected."
          : "A trace route could not be completed.",
      };
    }

    case "dns-lookup": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "getent hosts example.com || nslookup example.com || dig example.com",
          ]
        );

      const correct =
        result.code === 0 &&
        result.output.trim()
          .length > 0;

      return {
        correct,
        message: correct
          ? "Hostname resolution was detected."
          : "No DNS resolution result was detected.",
      };
    }

    case "arp-table": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ip neigh || arp -a",
          ]
        );

      const correct =
        result.code === 0;

      return {
        correct,
        message: correct
          ? "The local neighbor/ARP table was inspected."
          : "The ARP/neighbor table could not be inspected.",
      };
    }

    case "connections": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ss -tuln || netstat -tuln",
          ]
        );

      const correct =
        result.code === 0 &&
        result.output.trim()
          .length > 0;

      return {
        correct,
        message: correct
          ? "Network connections/listening sockets were inspected."
          : "The connection table could not be inspected.",
      };
    }

    /*
     * MODULE 2
     */

    case "routing-table": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ip route",
          ]
        );

      const correct =
        result.code === 0 &&
        (
          result.output.includes(
            "default"
          ) ||
          result.output.includes(
            "dev "
          )
        );

      return {
        correct,
        message: correct
          ? "The routing table was successfully inspected."
          : "A usable routing table was not detected.",
      };
    }

    case "default-route": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ip route show default",
          ]
        );

      const correct =
        result.code === 0 &&
        result.output
          .trim()
          .length > 0 &&
        result.output.includes(
          "default"
        );

      return {
        correct,
        message: correct
          ? "A default route was detected."
          : "No default route was detected.",
      };
    }

    case "dns-record": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "dig example.com A +short || nslookup -type=A example.com",
          ]
        );

      const correct =
        result.code === 0 &&
        result.output
          .trim()
          .length > 0;

      return {
        correct,
        message: correct
          ? "An A record lookup was successfully performed."
          : "The A record lookup did not return a result.",
      };
    }

    case "network-config": {
      const ipResult =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ip addr",
          ]
        );

      const routeResult =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "ip route",
          ]
        );

      const correct =
        ipResult.code === 0 &&
        routeResult.code === 0 &&
        ipResult.output
          .includes("inet ") &&
        routeResult.output
          .trim()
          .length > 0;

      return {
        correct,
        message: correct
          ? "IP configuration and routing information were detected."
          : "The required network configuration could not be detected.",
      };
    }

    case "wifi-info": {
      const result =
        await execCommand(
          container,
          [
            "bash",
            "-lc",
            "iw dev 2>/dev/null || iwconfig 2>/dev/null || true",
          ]
        );

      const output =
        result.output.trim();

      /*
       * The lab container may not have
       * physical Wi-Fi hardware.
       *
       * We therefore treat a clean command
       * execution as completion rather than
       * requiring a wireless adapter that
       * may not exist inside Docker.
       */
      const correct =
        result.code === 0;

      return {
        correct,
        message:
          correct
            ? output
              ? "Wireless interface information was inspected."
              : "The wireless inspection command completed. No physical Wi-Fi interface is exposed to the Docker container."
            : "The wireless inspection command failed.",
      };
    }

    default:
      return {
        correct: false,
        message:
          "Unknown assessment task.",
      };
  }
}

function sendJson(
  response: http.ServerResponse,
  statusCode: number,
  data: unknown
) {
  const body =
    JSON.stringify(data);

  response.writeHead(
    statusCode,
    {
      "Content-Type":
        "application/json; charset=utf-8",
      "Cache-Control":
        "no-store",
    }
  );

  response.end(body);
}

async function handleCheckTask(
  request: http.IncomingMessage,
  response: http.ServerResponse
) {
  try {
    const requestUrl =
      new URL(
        request.url ?? "/",
        `http://${request.headers.host ?? `${hostname}:${port}`}`
      );

    const task =
      requestUrl.searchParams.get(
        "task"
      ) as TaskId | null;

    const accessToken =
      requestUrl.searchParams.get(
        "access_token"
      );

    if (!task) {
      sendJson(
        response,
        400,
        {
          ok: false,
          error:
            "Missing assessment task.",
        }
      );

      return;
    }

    if (!accessToken) {
      sendJson(
        response,
        401,
        {
          ok: false,
          error:
            "Missing authentication token.",
        }
      );

      return;
    }

    const user =
      await userFromAccessToken(
        accessToken
      );

    if (!user) {
      sendJson(
        response,
        401,
        {
          ok: false,
          error:
            "Authentication session could not be verified.",
        }
      );

      return;
    }

    const container =
      await getOrCreateContainer();

    const result =
      await checkTask(
        task,
        container
      );

    sendJson(
      response,
      200,
      {
        ok: true,
        correct:
          result.correct,
        message:
          result.message,
        user_id: user.id,
        task,
      }
    );
  } catch (error) {
    console.error(
      "Assessment task error:",
      error
    );

    sendJson(
      response,
      500,
      {
        ok: false,
        correct: false,
        error:
          "Unable to check the assessment task.",
      }
    );
  }
}

async function start() {
  await app.prepare();

  const server =
    http.createServer(
      async (
        request,
        response
      ) => {
        try {
          const requestUrl =
            new URL(
              request.url ?? "/",
              `http://${request.headers.host ?? `${hostname}:${port}`}`
            );

          if (
            requestUrl.pathname ===
              "/check-task" &&
            request.method === "GET"
          ) {
            await handleCheckTask(
              request,
              response
            );

            return;
          }

          await handle(
            request,
            response
          );
        } catch (error) {
          console.error(
            "HTTP request error:",
            error
          );

          if (!response.headersSent) {
            response.statusCode =
              500;

            response.end(
              "Internal server error"
            );
          }
        }
      }
    );

  const websocketServer =
    new WebSocketServer({
      noServer: true,
    });

  server.on(
    "upgrade",
    (
      request,
      socket,
      head
    ) => {
      const url =
        new URL(
          request.url ?? "/",
          `http://${request.headers.host ?? `${hostname}:${port}`}`
        );

      if (
        url.pathname !==
        "/api/terminal"
      ) {
        socket.destroy();
        return;
      }

      websocketServer.handleUpgrade(
        request,
        socket,
        head,
        (websocket) => {
          websocketServer.emit(
            "connection",
            websocket,
            request
          );
        }
      );
    }
  );

  websocketServer.on(
    "connection",
    async (
      socket: WebSocket
    ) => {
      try {
        const container =
          await getOrCreateContainer();

        const exec =
          await container.exec({
            Cmd: ["/bin/bash"],
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Tty: true,
          });

        const stream =
          await exec.start({
            hijack: true,
            stdin: true,
            Tty: true,
          });

        stream.write(
          "export PS1='student@ictnet101:\\w$ '\n"
        );

        stream.write(
          "clear\n"
        );

        stream.on(
          "data",
          (chunk: Buffer) => {
            if (
              socket.readyState ===
              WebSocket.OPEN
            ) {
              socket.send(
                chunk.toString(
                  "utf8"
                )
              );
            }
          }
        );

        socket.on(
          "message",
          (message) => {
            if (
              !stream.destroyed
            ) {
              stream.write(
                message.toString()
              );
            }
          }
        );

        socket.on(
          "close",
          () => {
            try {
              stream.end();
            } catch {
              // Stream already closed.
            }
          }
        );
      } catch (error) {
        console.error(
          "ICTNET101 terminal error:",
          error
        );

        if (
          socket.readyState ===
          WebSocket.OPEN
        ) {
          socket.send(
            "\r\n\x1b[31mFailed to start networking lab.\x1b[0m\r\n"
          );

          socket.close();
        }
      }
    }
  );

  server.listen(
    port,
    hostname,
    () => {
      console.log(
        `ICTNET101 running at http://${hostname}:${port}`
      );

      console.log(
        `Terminal WebSocket available at ws://${hostname}:${port}/api/terminal`
      );

      console.log(
        `Assessment endpoint available at http://${hostname}:${port}/check-task`
      );
    }
  );
}

start().catch(
  (error) => {
    console.error(
      "Failed to start ICTNET101:",
      error
    );

    process.exit(1);
  }
);