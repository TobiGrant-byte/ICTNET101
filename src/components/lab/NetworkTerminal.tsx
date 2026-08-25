"use client";

import { useEffect, useRef } from "react";

import { createClient } from "@/lib/supabase/client";

export default function NetworkTerminal() {
  const terminalContainerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  useEffect(() => {
    let terminal:
      | import("xterm").Terminal
      | null = null;

    let socket:
      | WebSocket
      | null = null;

    let disposable:
      | { dispose: () => void }
      | null = null;

    let resizeHandler:
      | (() => void)
      | null = null;

    let destroyed = false;

    async function setup() {
      if (
        !terminalContainerRef.current
      ) {
        return;
      }

      const [
        { Terminal },
        { FitAddon },
      ] = await Promise.all([
        import("xterm"),
        import("xterm-addon-fit"),
      ]);

      if (destroyed) {
        return;
      }

      await import(
        "xterm/css/xterm.css"
      );

      if (destroyed) {
        return;
      }

      terminal =
        new Terminal({
          cursorBlink: true,
          convertEol: true,
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
          fontSize: 14,
          scrollback: 5000,
          theme: {
            background: "#050505",
            foreground: "#f5f5f5",
            cursor: "#ffffff",
            selectionBackground:
              "#333333",
          },
        });

      const fitAddon =
        new FitAddon();

      terminal.loadAddon(
        fitAddon
      );

      terminal.open(
        terminalContainerRef.current
      );

      fitAddon.fit();

      terminal.write(
        "\x1b[1;36mICTNET101 Networking Lab\x1b[0m\r\n"
      );

      terminal.write(
        "\x1b[90mChecking your authentication session...\x1b[0m\r\n\r\n"
      );

      const supabase =
        createClient();

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (destroyed) {
        return;
      }

      if (
        !session?.access_token
      ) {
        terminal.write(
          "\x1b[1;31mYour authentication session could not be loaded.\x1b[0m\r\n"
        );

        return;
      }

      const protocol =
        window.location.protocol ===
        "https:"
          ? "wss:"
          : "ws:";

      const hostname =
        window.location.hostname ||
        "localhost";

      socket =
        new WebSocket(
          `${protocol}//${hostname}:3001/terminal?access_token=${encodeURIComponent(
            session.access_token
          )}`
        );

      socket.onopen = () => {
        terminal?.write(
          "\x1b[1;32mConnected to Linux lab.\x1b[0m\r\n\r\n"
        );
      };

      socket.onmessage = (
        event
      ) => {
        terminal?.write(
          String(event.data)
        );
      };

      socket.onerror = () => {
        terminal?.write(
          "\r\n\x1b[1;31mTerminal connection error.\x1b[0m\r\n"
        );
      };

      socket.onclose = () => {
        terminal?.write(
          "\r\n\x1b[1;33mTerminal disconnected.\x1b[0m\r\n"
        );
      };

      disposable =
        terminal.onData(
          (data) => {
            if (
              socket?.readyState ===
              WebSocket.OPEN
            ) {
              socket.send(data);
            }
          }
        );

      resizeHandler = () => {
        fitAddon.fit();
      };

      window.addEventListener(
        "resize",
        resizeHandler
      );
    }

    void setup();

    return () => {
      destroyed = true;

      if (resizeHandler) {
        window.removeEventListener(
          "resize",
          resizeHandler
        );
      }

      disposable?.dispose();
      socket?.close();
      terminal?.dispose();
    };
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-black">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <span className="text-xs font-medium text-white/60">
          ICTNET101 Linux Networking Terminal
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-wider text-green-400">
          Live
        </span>
      </div>

      <div
        ref={terminalContainerRef}
        className="h-[500px] w-full p-2"
      />
    </div>
  );
}