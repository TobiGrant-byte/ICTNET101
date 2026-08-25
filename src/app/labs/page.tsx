import NetworkTerminal from "@/components/lab/NetworkTerminal";

export default function LabsPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Practical Lab
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Networking Lab
          </h1>

          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">
            Practice real networking commands inside the ICTNET101 Linux
            laboratory environment.
          </p>
        </div>

        <div className="mt-8">
          <NetworkTerminal />
        </div>

        <section className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="text-xl font-bold">
            Try these commands
          </h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "ip a",
              "ip route",
              "ping 127.0.0.1",
              "ss -tuln",
              "arp -a",
              "traceroute 8.8.8.8",
            ].map((command) => (
              <code
                key={command}
                className="rounded-xl bg-[var(--muted)] px-4 py-3 text-sm font-semibold text-[var(--primary)]"
              >
                {command}
              </code>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}