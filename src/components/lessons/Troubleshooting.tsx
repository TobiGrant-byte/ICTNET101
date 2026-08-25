"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function Troubleshooting() {
  return (
    <Module3LessonLayout
      lessonSlug="troubleshooting"
      lessonNumber={9}
      title="Network Troubleshooting"
      description="Learn a structured approach to finding network problems and use common tools to isolate failures."
    >
      <section>
        <h2 className="text-2xl font-bold">
          A structured process
        </h2>

        <div className="mt-4 space-y-3">
          {[
            "Identify the problem and gather symptoms.",
            "Establish a theory of probable cause.",
            "Test the theory.",
            "Create and implement a plan of action.",
            "Verify full system functionality.",
            "Document the findings and resolution.",
          ].map((step, index) => (
            <div
              key={step}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4"
            >
              <span className="font-black text-[var(--primary)]">
                {index + 1}.
              </span>{" "}
              {step}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Useful commands
        </h2>

        <div className="mt-4 space-y-3">
          {[
            ["ping", "Check whether a host is reachable."],
            ["traceroute / tracert", "Find where a network path is breaking."],
            ["nslookup / dig", "Investigate DNS resolution."],
            ["netstat / ss", "Inspect active connections and listening ports."],
            ["arp -a", "Inspect the local ARP table."],
            ["ip a / ipconfig", "Verify local IP, gateway, and interface configuration."],
          ].map(([command, purpose]) => (
            <div
              key={command}
              className="rounded-2xl border border-[var(--border)] p-5"
            >
              <code className="font-bold text-[var(--primary)]">
                {command}
              </code>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {purpose}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Bottom-up troubleshooting
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          Start at the lower layers and move upward: physical connection →
          IP configuration → gateway reachability → DNS → application layer.
        </p>

        <div className="mt-4 rounded-2xl bg-black p-5 font-mono text-sm leading-8 text-green-400">
          Physical Link
          <br />
          ↓
          <br />
          IP Configuration
          <br />
          ↓
          <br />
          Gateway
          <br />
          ↓
          <br />
          DNS
          <br />
          ↓
          <br />
          Application
        </div>
      </section>
    </Module3LessonLayout>
  );
}