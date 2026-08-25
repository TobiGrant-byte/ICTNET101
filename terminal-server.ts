import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import http from "http";
import Docker from "dockerode";
import {
  WebSocketServer,
  WebSocket,
} from "ws";

const PORT = 3001;

const docker = new Docker();

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const IMAGE_NAME =
  "ictnet101-networking-lab";

const commandHistories = new Map<
  string,
  string[]
>();

/*
 * Commands accepted by the practical
 * assessment checker.
 *
 * Module 1, Module 2, and Module 3
 * assessment tasks are included.
 */
const taskCommands: Record<
  string,
  string[]
> = {
  /*
   * MODULE 1
   */

  "ip-config": [
    "ip a",
    "ip addr",
    "ifconfig",
    "ipconfig",
    "ipconfig /all",
  ],

  "ping-gateway": [
    "ping 127.0.0.1",
    "ping -c 1 127.0.0.1",
    "ping -c 3 127.0.0.1",
  ],

  "trace-route": [
    "traceroute example.com",
    "traceroute google.com",
    "tracert example.com",
    "traceroute 8.8.8.8",
  ],

  "dns-lookup": [
    "nslookup example.com",
    "dig example.com",
    "getent hosts example.com",
  ],

  "arp-table": [
    "arp -a",
    "ip neigh",
    "ip neighbor",
  ],

  connections: [
    "netstat",
    "netstat -tuln",
    "netstat -an",
    "ss",
    "ss -tuln",
    "ss -tulpn",
  ],

  /*
   * MODULE 2
   */

  "routing-table": [
    "ip route",
    "ip route show",
    "route -n",
  ],

  "default-route": [
    "ip route",
    "ip route show",
    "ip route show default",
  ],

  "dns-record": [
    "dig example.com A",
    "dig example.com A +short",
    "nslookup -type=A example.com",
    "nslookup -query=A example.com",
  ],

  "network-config": [
    "ip a",
    "ip addr",
    "ip route",
    "ip addr show",
    "ip route show",
    "ifconfig",
  ],

  "wifi-info": [
    "iw dev",
    "iw dev wlan0 info",
    "iwconfig",
    "iwconfig wlan0",
  ],

  /*
   * MODULE 3
   */

  "arp-table-module3": [
    "arp -a",
    "ip neigh",
    "ip neighbor",
  ],

  "http-test-module3": [
    "curl -I http://example.com",
    "curl -I https://example.com",
    "curl -I example.com",
  ],

  "dns-lookup-module3": [
    "nslookup example.com",
    "dig example.com",
    "dig example.com A",
    "getent hosts example.com",
  ],

  "ssh-port-module3": [
    "ss -tuln",
    "ss -tulpn",
    "netstat -tuln",
    "netstat -an",
  ],

  "connections-module3": [
    "ss",
    "ss -tuln",
    "ss -tulpn",
    "netstat",
    "netstat -tuln",
    "netstat -an",
  ],

  "ip-config-module3": [
    "ip a",
    "ip addr",
    "ip route",
    "ip addr show",
    "ip route show",
    "ifconfig",
  ],
};

function getContainerName(
  userId: string
) {
  const safeId = userId
    .replace(/[^a-zA-Z0-9]/g, "")
    .toLowerCase()
    .slice(0, 20);

  return `ictnet101-lab-${safeId}`;
}

function getHistory(
  userId: string
) {
  if (!commandHistories.has(userId)) {
    commandHistories.set(
      userId,
      []
    );
  }

  return commandHistories.get(userId)!;
}

function normalizeCommand(
  command: string
) {
  return command
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isAcceptedCommand(
  userId: string,
  taskId: string
) {
  const accepted =
    taskCommands[taskId];

  if (!accepted) {
    return false;
  }

  const history =
    getHistory(userId);

  const normalizedHistory =
    history.map(normalizeCommand);

  return accepted.some(
    (expected) =>
      normalizedHistory.includes(
        normalizeCommand(expected)
      )
  );
}

async function verifyAccessToken(
  accessToken: string
) {
  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/auth/v1/user`,
    {
      method: "GET",
      headers: {
        apikey:
          SUPABASE_PUBLISHABLE_KEY,
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Supabase authentication failed: ${response.status}`
    );
  }

  const user =
    (await response.json()) as {
      id?: string;
    };

  if (!user.id) {
    throw new Error(
      "Authenticated user ID was not returned."
    );
  }

  return user.id;
}

async function verifyAdminToken(
  accessToken: string
) {
  const userId =
    await verifyAccessToken(
      accessToken
    );

  if (
    !SUPABASE_URL ||
    !SUPABASE_PUBLISHABLE_KEY
  ) {
    throw new Error(
      "Supabase environment variables are missing."
    );
  }

  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/profiles?id=eq.${encodeURIComponent(
      userId
    )}&select=role`,
    {
      method: "GET",
      headers: {
        apikey:
          SUPABASE_PUBLISHABLE_KEY,
        Authorization:
          `Bearer ${accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Unable to verify administrator role: ${response.status}`
    );
  }

  const profiles =
    (await response.json()) as {
      role?: string;
    }[];

  if (
    profiles[0]?.role !==
    "admin"
  ) {
    throw new Error(
      "Administrator access required."
    );
  }

  return userId;
}

async function getOrCreateContainer(
  userId: string
): Promise<Docker.Container> {
  const containerName =
    getContainerName(userId);

  const container =
    docker.getContainer(
      containerName
    );

  try {
    const info =
      await container.inspect();

    if (!info.State.Running) {
      await container.start();
    }

    return container;
  } catch {
    console.log(
      `Creating lab container for ${userId}: ${containerName}`
    );

    const created =
      await docker.createContainer({
        name: containerName,
        Image: IMAGE_NAME,
        Cmd: [
          "/bin/bash",
          "-i",
        ],
        Tty: true,
        OpenStdin: true,
        StdinOnce: false,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        WorkingDir:
          "/home/student",
        HostConfig: {
          Memory:
            512 *
            1024 *
            1024,
          NanoCpus:
            500_000_000,
          PidsLimit: 128,
          AutoRemove: false,
        },
      });

    await created.start();

    return created;
  }
}

async function getContainerIp(
  container: Docker.Container
) {
  const info =
    await container.inspect();

  const networks =
    info.NetworkSettings?.Networks;

  if (!networks) {
    return null;
  }

  const firstNetwork =
    Object.values(networks)[0];

  return (
    firstNetwork?.IPAddress ??
    null
  );
}

function sendJson(
  response: http.ServerResponse,
  status: number,
  data: unknown
) {
  response.writeHead(status, {
    "Content-Type":
      "application/json",
    "Access-Control-Allow-Origin":
      "http://localhost:3000",
    "Access-Control-Allow-Methods":
      "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization",
    "Cache-Control":
      "no-store",
  });

  response.end(
    JSON.stringify(data)
  );
}

const httpServer =
  http.createServer(
    async (
      request,
      response
    ) => {
      try {
        const url =
          new URL(
            request.url ?? "/",
            `http://${request.headers.host ?? "localhost"}`
          );

        if (
          request.method ===
          "OPTIONS"
        ) {
          sendJson(
            response,
            200,
            { ok: true }
          );
          return;
        }

        if (
          request.method === "GET" &&
          url.pathname === "/health"
        ) {
          sendJson(
            response,
            200,
            {
              ok: true,
              service:
                "ICTNET101 lab server",
            }
          );
          return;
        }

        if (
          request.method === "GET" &&
          url.pathname ===
            "/lab-info"
        ) {
          const accessToken =
            url.searchParams.get(
              "access_token"
            );

          if (!accessToken) {
            sendJson(
              response,
              401,
              {
                ok: false,
                message:
                  "Authentication required.",
              }
            );
            return;
          }

          const userId =
            await verifyAccessToken(
              accessToken
            );

          const container =
            await getOrCreateContainer(
              userId
            );

          const ip =
            await getContainerIp(
              container
            );

          sendJson(
            response,
            200,
            {
              ok: true,
              userId,
              container:
                getContainerName(
                  userId
                ),
              ip,
            }
          );

          return;
        }

        if (
          request.method === "GET" &&
          url.pathname ===
            "/reset-assessment"
        ) {
          const accessToken =
            url.searchParams.get(
              "access_token"
            );

          if (!accessToken) {
            sendJson(
              response,
              401,
              {
                ok: false,
                message:
                  "Authentication required.",
              }
            );
            return;
          }

          const userId =
            await verifyAccessToken(
              accessToken
            );

          commandHistories.set(
            userId,
            []
          );

          sendJson(
            response,
            200,
            {
              ok: true,
              message:
                "Assessment history reset.",
            }
          );

          return;
        }

        /*
         * Assessment checker
         */
        if (
          request.method === "GET" &&
          url.pathname ===
            "/check-task"
        ) {
          const task =
            url.searchParams.get(
              "task"
            );

          const accessToken =
            url.searchParams.get(
              "access_token"
            );

          if (
            !task ||
            !taskCommands[task]
          ) {
            sendJson(
              response,
              400,
              {
                correct: false,
                message:
                  "Unknown assessment task.",
              }
            );

            return;
          }

          if (!accessToken) {
            sendJson(
              response,
              401,
              {
                correct: false,
                message:
                  "Authentication required.",
              }
            );

            return;
          }

          const userId =
            await verifyAccessToken(
              accessToken
            );

          const correct =
            isAcceptedCommand(
              userId,
              task
            );

          sendJson(
            response,
            200,
            {
              correct,
              task,
              userId,
              message:
                correct
                  ? "Task completed successfully."
                  : "The required command has not been detected yet.",
            }
          );

          return;
        }

        if (
          request.method === "GET" &&
          url.pathname ===
            "/debug/history"
        ) {
          const accessToken =
            url.searchParams.get(
              "access_token"
            );

          if (!accessToken) {
            sendJson(
              response,
              401,
              {
                ok: false,
                message:
                  "Authentication required.",
              }
            );
            return;
          }

          const userId =
            await verifyAccessToken(
              accessToken
            );

          sendJson(
            response,
            200,
            {
              userId,
              history:
                getHistory(
                  userId
                ),
            }
          );

          return;
        }

        /*
         * Admin-only Docker monitoring.
         */
        if (
          request.method === "GET" &&
          url.pathname ===
            "/admin/labs"
        ) {
          const accessToken =
            url.searchParams.get(
              "access_token"
            );

          if (!accessToken) {
            sendJson(
              response,
              401,
              {
                ok: false,
                message:
                  "Authentication required.",
              }
            );
            return;
          }

          try {
            await verifyAdminToken(
              accessToken
            );

            const containers =
              await docker.listContainers(
                {
                  all: true,
                }
              );

            const labContainers =
              containers.filter(
                (container) =>
                  container.Names.some(
                    (name) =>
                      name.includes(
                        "ictnet101-lab-"
                      )
                  )
              );

            const labs =
              await Promise.all(
                labContainers.map(
                  async (
                    container
                  ) => {
                    const name =
                      container.Names.find(
                        (item) =>
                          item.includes(
                            "ictnet101-lab-"
                          )
                      )?.replace(
                        "/",
                        ""
                      ) ??
                      `ictnet101-lab-${container.Id.slice(
                        0,
                        12
                      )}`;

                    const dockerContainer =
                      docker.getContainer(
                        container.Id
                      );

                    let ip:
                      | string
                      | null = null;

                    let created =
                      container.Created;

                    try {
                      const info =
                        await dockerContainer.inspect();

                      const networks =
                        info.NetworkSettings
                          ?.Networks;

                      if (networks) {
                        const firstNetwork =
                          Object.values(
                            networks
                          )[0];

                        ip =
                          firstNetwork
                            ?.IPAddress ??
                          null;
                      }

                      if (
                        info.Created
                      ) {
                        created =
                          new Date(
                            info.Created
                          ).getTime();
                      }
                    } catch {
                      ip = null;
                    }

                    return {
                      id: container.Id,
                      name,
                      status:
                        container.State,
                      running:
                        container.State ===
                        "running",
                      ip,
                      created,
                    };
                  }
                )
              );

            sendJson(
              response,
              200,
              {
                ok: true,
                labs,
              }
            );
          } catch (error) {
            console.error(
              "Admin labs error:",
              error
            );

            sendJson(
              response,
              403,
              {
                ok: false,
                message:
                  "Administrator access required.",
              }
            );
          }

          return;
        }

        sendJson(
          response,
          404,
          {
            message:
              "Not found.",
          }
        );
      } catch (error) {
        console.error(
          "Lab HTTP error:",
          error
        );

        sendJson(
          response,
          500,
          {
            ok: false,
            message:
              "Lab server error.",
          }
        );
      }
    }
  );

const wss =
  new WebSocketServer({
    server: httpServer,
    path: "/terminal",
  });

wss.on(
  "connection",
  async (
    socket: WebSocket,
    request
  ) => {
    try {
      const requestUrl =
        new URL(
          request.url ??
            "/terminal",
          `http://${request.headers.host ?? "localhost"}`
        );

      const accessToken =
        requestUrl.searchParams.get(
          "access_token"
        );

      if (!accessToken) {
        socket.send(
          "\r\n\x1b[31mAuthentication required.\x1b[0m\r\n"
        );

        socket.close();
        return;
      }

      const userId =
        await verifyAccessToken(
          accessToken
        );

      const container =
        await getOrCreateContainer(
          userId
        );

      const containerIp =
        await getContainerIp(
          container
        );

      const history =
        getHistory(userId);

      const exec =
        await container.exec({
          Cmd: [
            "/bin/bash",
            "-i",
          ],
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Tty: true,
          WorkingDir:
            "/home/student",
        });

      const stream =
        await exec.start({
          hijack: true,
          stdin: true,
          Tty: true,
        });

      let currentCommand = "";

      stream.write(
        "export PS1='student\\@ictnet101:\\w$ '\n"
      );

      stream.write(
        "export TERM=xterm-256color\n"
      );

      stream.write(
        "clear\n"
      );

      stream.write(
        `echo "ICTNET101 Lab IP: ${
          containerIp ??
          "unavailable"
        }"\n`
      );

      stream.on(
        "data",
        (chunk: Buffer) => {
          if (
            socket.readyState ===
            WebSocket.OPEN
          ) {
            socket.send(
              chunk.toString("utf8")
            );
          }
        }
      );

      socket.on(
        "message",
        (message) => {
          const data =
            message.toString();

          for (
            const char of data
          ) {
            if (
              char === "\r" ||
              char === "\n"
            ) {
              const command =
                currentCommand.trim();

              if (command) {
                history.push(
                  command
                );

                console.log(
                  `[${userId}] ${command}`
                );
              }

              currentCommand = "";
              continue;
            }

            if (
              char === "\u007f"
            ) {
              currentCommand =
                currentCommand.slice(
                  0,
                  -1
                );
              continue;
            }

            if (
              char === "\x1b"
            ) {
              continue;
            }

            if (
              char >= " " &&
              char <= "~"
            ) {
              currentCommand += char;
            }
          }

          if (
            !stream.destroyed
          ) {
            stream.write(data);
          }
        }
      );

      socket.on(
        "close",
        () => {
          try {
            stream.end();
          } catch {
            // Already closed.
          }
        }
      );
    } catch (error) {
      console.error(
        "Terminal error:",
        error
      );

      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        socket.send(
          "\r\n\x1b[31mFailed to start your networking lab.\x1b[0m\r\n"
        );

        socket.close();
      }
    }
  }
);

httpServer.listen(
  PORT,
  () => {
    console.log(
      `ICTNET101 lab server running on http://localhost:${PORT}`
    );

    console.log(
      `Terminal: ws://localhost:${PORT}/terminal`
    );

    console.log(
      "Assessment checker: http://localhost:3001/check-task"
    );

    console.log(
      "Admin labs: http://localhost:3001/admin/labs"
    );
  }
);