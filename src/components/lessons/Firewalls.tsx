"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function Firewalls() {
  return (
    <Module3LessonLayout
      lessonSlug="firewalls"
      lessonNumber={6}
      title="Firewalls"
      description="Learn how firewalls control network traffic and compare the major firewall types."
    >
      <section>
        <h2 className="text-2xl font-bold">
          What is a firewall?
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          A firewall filters network traffic according to rules. Depending on
          its design, it can make decisions using IP addresses, ports,
          protocols, connection state, or application information.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Firewall types
        </h2>

        <div className="mt-4 grid gap-3">
          {[
            ["Packet-filtering", "Inspects packet headers such as IP addresses and ports."],
            ["Stateful", "Tracks connection state and allows valid return traffic."],
            ["NGFW", "Adds application awareness, deeper inspection, and intrusion prevention features."],
            ["Host-based", "Runs directly on an individual device."],
            ["Network-based", "Protects systems at the network boundary."],
          ].map(([name, description]) => (
            <div
              key={name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
            >
              <h3 className="font-bold">
                {name}
              </h3>

              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
        <h2 className="font-bold">
          Default-deny principle
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          A strong security approach is to block traffic by default and then
          explicitly allow only what is required.
        </p>
      </section>
    </Module3LessonLayout>
  );
}