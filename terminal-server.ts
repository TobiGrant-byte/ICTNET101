import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import http from "http";
import os from "os";
import {
  spawn,
  type ChildProcessByStdio,
} from "child_process";
import type { Readable } from "stream";
import {
  WebSocketServer,
  WebSocket,
} from "ws";

const PORT =
  Number(process.env.PORT) || 3001;

const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  "http://localhost:3000";

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL;

const SUPABASE_PUBLISHABLE_KEY =
  process.env
    .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const commandHistories = new Map<
  string,
  string[]
>();

const activeSessions = new Map<
  string,
  {
    connectedAt: number;
    lastActivity: number;
  }
>();

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

function getHistory(userId: string) {
  if (!commandHistories.has(userId)) {
    commandHistories.set(userId, []);
  }

  return commandHistories.get(userId)!;
}

function normalizeCommand(command: string) {
  return command
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function isAcceptedCommand(
  userId: string,
  taskId: string
) {
  const accepted = taskCommands[taskId];

  if (!accepted) {
    return false;
  }

  const history = getHistory(userId);

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

function getLocalIp() {
  const interfaces =
    os.networkInterfaces();

  for (const entries of Object.values(
    interfaces
  )) {
    if (!entries) {
      continue;
    }

    for (const entry of entries) {
      if (
        entry.family === "IPv4" &&
        !entry.internal
      ) {
        return entry.address;
      }
    }
  }

  return null;
}

type ResolvedCommand = {
  command: string;
  args: string[];
};

function resolveCommand(
  input: string
): ResolvedCommand | null {
  const command =
    normalizeCommand(input);

  if (
    command === "ip a" ||
    command === "ip addr"
  ) {
    return {
      command: "ip",
      args: ["a"],
    };
  }

  if (
    command === "ip addr show"
  ) {
    return {
      command: "ip",
      args: ["addr", "show"],
    };
  }

  if (
    command === "ip route" ||
    command === "ip route show"
  ) {
    return {
      command: "ip",
      args: ["route"],
    };
  }

  if (
    command ===
    "ip route show default"
  ) {
    return {
      command: "ip",
      args: [
        "route",
        "show",
        "default",
      ],
    };
  }

  if (
    command === "ip neigh" ||
    command === "ip neighbor"
  ) {
    return {
      command: "ip",
      args: ["neigh"],
    };
  }

  if (command === "ifconfig") {
    return {
      command: "ifconfig",
      args: [],
    };
  }

  if (command === "arp -a") {
    return {
      command: "arp",
      args: ["-a"],
    };
  }

  if (command === "ss") {
    return {
      command: "ss",
      args: [],
    };
  }

  if (command === "ss -tuln") {
    return {
      command: "ss",
      args: ["-tuln"],
    };
  }

  if (command === "ss -tulpn") {
    return {
      command: "ss",
      args: ["-tulpn"],
    };
  }

  if (command === "ss -an") {
    return {
      command: "ss",
      args: ["-an"],
    };
  }

  if (command === "netstat") {
    return {
      command: "netstat",
      args: [],
    };
  }

  if (
    command ===
    "netstat -tuln"
  ) {
    return {
      command: "netstat",
      args: ["-tuln"],
    };
  }

  if (
    command ===
    "netstat -an"
  ) {
    return {
      command: "netstat",
      args: ["-an"],
    };
  }

  if (
    command ===
    "netstat -tulpn"
  ) {
    return {
      command: "netstat",
      args: ["-tulpn"],
    };
  }

  if (
    command ===
    "traceroute example.com"
  ) {
    return {
      command: "traceroute",
      args: [
        "-m",
        "8",
        "example.com",
      ],
    };
  }

  if (
    command ===
    "traceroute google.com"
  ) {
    return {
      command: "traceroute",
      args: [
        "-m",
        "8",
        "google.com",
      ],
    };
  }

  if (
    command ===
    "traceroute 8.8.8.8"
  ) {
    return {
      command: "traceroute",
      args: [
        "-m",
        "8",
        "8.8.8.8",
      ],
    };
  }

  if (
    command ===
    "ping 127.0.0.1"
  ) {
    return {
      command: "ping",
      args: [
        "-c",
        "3",
        "127.0.0.1",
      ],
    };
  }

  if (
    command ===
    "ping -c 1 127.0.0.1"
  ) {
    return {
      command: "ping",
      args: [
        "-c",
        "1",
        "127.0.0.1",
      ],
    };
  }

  if (
    command ===
    "ping -c 3 127.0.0.1"
  ) {
    return {
      command: "ping",
      args: [
        "-c",
        "3",
        "127.0.0.1",
      ],
    };
  }

  if (
    command ===
    "nslookup example.com"
  ) {
    return {
      command: "nslookup",
      args: ["example.com"],
    };
  }

  if (
    command ===
    "dig example.com"
  ) {
    return {
      command: "dig",
      args: ["example.com"],
    };
  }

  if (
    command ===
    "dig example.com a"
  ) {
    return {
      command: "dig",
      args: [
        "example.com",
        "A",
      ],
    };
  }

  if (
    command ===
    "dig example.com a +short"
  ) {
    return {
      command: "dig",
      args: [
        "example.com",
        "A",
        "+short",
      ],
    };
  }

  if (
    command ===
    "nslookup -type=a example.com"
  ) {
    return {
      command: "nslookup",
      args: [
        "-type=A",
        "example.com",
      ],
    };
  }

  if (
    command ===
    "nslookup -query=a example.com"
  ) {
    return {
      command: "nslookup",
      args: [
        "-query=A",
        "example.com",
      ],
    };
  }

  if (
    command ===
    "curl -i http://example.com"
  ) {
    return {
      command: "curl",
      args: [
        "-I",
        "http://example.com",
      ],
    };
  }

  if (
    command ===
    "curl -i https://example.com"
  ) {
    return {
      command: "curl",
      args: [
        "-I",
        "https://example.com",
      ],
    };
  }

  if (
    command ===
    "curl -i example.com"
  ) {
    return {
      command: "curl",
      args: [
        "-I",
        "http://example.com",
      ],
    };
  }

  if (command === "iw dev") {
    return {
      command: "iw",
      args: ["dev"],
    };
  }

  if (
    command ===
    "iw dev wlan0 info"
  ) {
    return {
      command: "iw",
      args: [
        "dev",
        "wlan0",
        "info",
      ],
    };
  }

  if (command === "iwconfig") {
    return {
      command: "iwconfig",
      args: [],
    };
  }

  if (
    command ===
    "iwconfig wlan0"
  ) {
    return {
      command: "iwconfig",
      args: ["wlan0"],
    };
  }

  if (command === "hostname") {
    return {
      command: "hostname",
      args: [],
    };
  }

  if (command === "whoami") {
    return {
      command: "whoami",
      args: [],
    };
  }

  if (command === "pwd") {
    return {
      command: "pwd",
      args: [],
    };
  }

  return null;
}

function writePrompt(
  socket: WebSocket
) {
  if (
    socket.readyState ===
    WebSocket.OPEN
  ) {
    socket.send(
      "\x1b[1;36mstudent@ictnet101\x1b[0m:\x1b[1;34m~\x1b[0m$ "
    );
  }
}

async function executeCommand(
  socket: WebSocket,
  userId: string,
  rawCommand: string
) {
  const command =
    normalizeCommand(rawCommand);

  if (!command) {
    socket.send("\r\n");
    writePrompt(socket);
    return;
  }

  getHistory(userId).push(
    rawCommand.trim()
  );

  activeSessions.set(
    userId,
    {
      ...(activeSessions.get(
        userId
      ) ?? {
        connectedAt:
          Date.now(),
      }),
      lastActivity:
        Date.now(),
    }
  );

  if (command === "clear") {
    socket.send(
      "\x1b[2J\x1b[H"
    );
    writePrompt(socket);
    return;
  }

  if (command === "help") {
    socket.send(
      [
        "\r\nAvailable ICTNET101 commands:",
        "",
        "  ip a",
        "  ip addr",
        "  ip route",
        "  ip route show",
        "  ip route show default",
        "  ip neigh",
        "  arp -a",
        "  ping 127.0.0.1",
        "  ping -c 1 127.0.0.1",
        "  ping -c 3 127.0.0.1",
        "  traceroute example.com",
        "  traceroute google.com",
        "  traceroute 8.8.8.8",
        "  nslookup example.com",
        "  dig example.com",
        "  dig example.com A",
        "  curl -I http://example.com",
        "  ss -tuln",
        "  netstat -tuln",
        "  iw dev",
        "  ifconfig",
        "  hostname",
        "  whoami",
        "  pwd",
        "  clear",
        "  help",
        "",
      ].join("\r\n")
    );

    writePrompt(socket);
    return;
  }

  if (
    command === "exit" ||
    command === "quit"
  ) {
    socket.send(
      "\r\n\x1b[1;33mSession closed.\x1b[0m\r\n"
    );

    socket.close();
    return;
  }

  const resolved =
    resolveCommand(command);

  if (!resolved) {
    socket.send(
      "\r\n\x1b[1;31mCommand not available in the ICTNET101 lab.\x1b[0m\r\n"
    );

    socket.send(
      "\x1b[90mType 'help' to see available commands.\x1b[0m\r\n"
    );

    writePrompt(socket);
    return;
  }

  socket.send("\r\n");

  let child:
    | ChildProcessByStdio<
        null,
        Readable,
        Readable
      >
    | null = null;

  try {
    const spawnEnvironment:
      NodeJS.ProcessEnv = {
      ...process.env,
      PATH:
        process.env.PATH ??
        "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      HOME:
        process.env.HOME ??
        "/home/student",
      TERM:
        "xterm-256color",
      LANG:
        "C.UTF-8",
      LC_ALL:
        "C.UTF-8",
      NODE_ENV:
        process.env.NODE_ENV ??
        "production",
    };

    child =
      spawn(
        resolved.command,
        resolved.args,
        {
          cwd: "/home/student",
          env: spawnEnvironment,
          stdio: [
            "ignore",
            "pipe",
            "pipe",
          ],
        }
      );
  } catch (error) {
    console.error(
      "Command spawn error:",
      error
    );

    socket.send(
      `\r\n\x1b[1;31mUnable to start command: ${
        error instanceof Error
          ? error.message
          : "Unknown error"
      }\x1b[0m\r\n`
    );

    writePrompt(socket);
    return;
  }

  child.stdout.on(
    "data",
    (data: Buffer) => {
      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        socket.send(
          data
            .toString()
            .replace(
              /\n/g,
              "\r\n"
            )
        );
      }
    }
  );

  child.stderr.on(
    "data",
    (data: Buffer) => {
      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        socket.send(
          data
            .toString()
            .replace(
              /\n/g,
              "\r\n"
            )
        );
      }
    }
  );

  child.on(
    "error",
    (error: Error) => {
      console.error(
        "Command execution error:",
        error
      );

      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        socket.send(
          `\r\n\x1b[1;31mUnable to execute command: ${error.message}\x1b[0m\r\n`
        );

        writePrompt(socket);
      }
    }
  );

  child.on(
    "close",
    (code: number | null) => {
      if (
        socket.readyState ===
        WebSocket.OPEN
      ) {
        if (
          code !== 0 &&
          code !== null
        ) {
          socket.send(
            `\r\n\x1b[90mCommand exited with code ${code}.\x1b[0m\r\n`
          );
        }

        writePrompt(socket);
      }
    }
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
      FRONTEND_ORIGIN,
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
          request.method ===
            "GET" &&
          url.pathname ===
            "/health"
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
          request.method ===
            "GET" &&
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

          sendJson(
            response,
            200,
            {
              ok: true,
              userId,
              ip: getLocalIp(),
              mode:
                "render-shell",
            }
          );

          return;
        }

        if (
          request.method ===
            "GET" &&
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

        if (
          request.method ===
            "GET" &&
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
          request.method ===
            "GET" &&
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

        if (
          request.method ===
            "GET" &&
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

            const labs =
              Array.from(
                activeSessions.entries()
              ).map(
                ([
                  userId,
                  session,
                ]) => ({
                  id: userId,
                  name:
                    `ictnet101-session-${userId.slice(
                      0,
                      8
                    )}`,
                  status: "active",
                  running: true,
                  ip: getLocalIp(),
                  connectedAt:
                    session.connectedAt,
                  lastActivity:
                    session.lastActivity,
                })
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
    let userId:
      | string
      | null = null;

    let currentCommand = "";

    let escapeSequence = false;

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

      userId =
        await verifyAccessToken(
          accessToken
        );

      activeSessions.set(
        userId,
        {
          connectedAt:
            Date.now(),
          lastActivity:
            Date.now(),
        }
      );

      socket.send(
        "\x1b[1;36mICTNET101 Networking Lab\x1b[0m\r\n"
      );

      socket.send(
        "\x1b[90mRender Linux networking environment\x1b[0m\r\n\r\n"
      );

      socket.send(
        `ICTNET101 Lab IP: ${
          getLocalIp() ??
          "unavailable"
        }\r\n\r\n`
      );

      socket.send(
        "\x1b[1;32mConnected to Linux lab.\x1b[0m\r\n\r\n"
      );

      socket.send(
        "\x1b[90mType 'help' to see available commands.\x1b[0m\r\n\r\n"
      );

      writePrompt(socket);

      const keepAlive =
        setInterval(() => {
          if (
            socket.readyState ===
            WebSocket.OPEN
          ) {
            socket.ping();
          }
        }, 25_000);

      socket.on(
        "message",
        async (message) => {
          if (!userId) {
            return;
          }

          activeSessions.set(
            userId,
            {
              ...(activeSessions.get(
                userId
              ) ?? {
                connectedAt:
                  Date.now(),
              }),
              lastActivity:
                Date.now(),
            }
          );

          const data =
            message.toString();

          for (
            let index = 0;
            index < data.length;
            index++
          ) {
            const char =
              data[index];

            if (
              escapeSequence
            ) {
              if (
                /[A-Za-z~]/.test(
                  char
                )
              ) {
                escapeSequence =
                  false;
              }

              continue;
            }

            if (
              char === "\x1b"
            ) {
              escapeSequence =
                true;

              continue;
            }

            if (
              char === "\x03"
            ) {
              currentCommand = "";

              socket.send(
                "^C\r\n"
              );

              writePrompt(socket);

              continue;
            }

            if (
              char === "\r" ||
              char === "\n"
            ) {
              const command =
                currentCommand.trim();

              currentCommand = "";

              if (command) {
                await executeCommand(
                  socket,
                  userId,
                  command
                );
              } else {
                socket.send(
                  "\r\n"
                );

                writePrompt(
                  socket
                );
              }

              continue;
            }

            if (
              char === "\u007f" ||
              char === "\b"
            ) {
              if (
                currentCommand.length >
                0
              ) {
                currentCommand =
                  currentCommand.slice(
                    0,
                    -1
                  );

                socket.send(
                  "\b \b"
                );
              }

              continue;
            }

            if (
              char >= " " &&
              char <= "~"
            ) {
              currentCommand +=
                char;

              socket.send(char);
            }
          }
        }
      );

      socket.on(
        "close",
        () => {
          clearInterval(
            keepAlive
          );

          if (userId) {
            activeSessions.delete(
              userId
            );
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

      if (userId) {
        activeSessions.delete(
          userId
        );
      }
    }
  }
);

httpServer.listen(
  PORT,
  "0.0.0.0",
  () => {
    console.log(
      `ICTNET101 lab server running on port ${PORT}`
    );

    console.log(
      "WebSocket terminal available at /terminal"
    );

    console.log(
      "Assessment checker available at /check-task"
    );
  }
);