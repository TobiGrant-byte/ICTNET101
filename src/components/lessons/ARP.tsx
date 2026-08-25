"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function ARP() {
  return (
    <Module3LessonLayout
      lessonSlug="arp"
      lessonNumber={1}
      title="ARP — Address Resolution Protocol"
      description="Learn how devices discover the MAC address associated with a known IPv4 address on a local network."
    >
      <section>
        <h2 className="text-2xl font-bold">
          What is ARP?
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          ARP, or Address Resolution Protocol, maps a known IPv4 address to
          the corresponding MAC address on a local network. Ethernet delivers
          frames using MAC addresses, so a device needs ARP when it knows the
          destination IP but not the destination MAC address.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          How ARP works
        </h2>

        <div className="mt-4 space-y-3">
          {[
            "A device checks its local ARP cache.",
            "If the mapping is missing, it broadcasts an ARP request.",
            'The device owning the IP responds with its MAC address.',
            "The result is stored in the local ARP table.",
          ].map((item, index) => (
            <div
              key={item}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-4"
            >
              <span className="font-bold text-[var(--primary)]">
                {index + 1}.
              </span>{" "}
              {item}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          ARP table
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          The ARP table stores recently discovered IP-to-MAC mappings so the
          machine does not need to perform a new broadcast every time.
        </p>

        <pre className="mt-4 overflow-x-auto rounded-2xl bg-black p-5 text-sm text-green-400">
          arp -a{"\n"}ip neigh
        </pre>
      </section>

      <section className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
        <h2 className="text-lg font-bold">
          Security Note
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          ARP has no built-in authentication. ARP spoofing can therefore be
          used to send false IP-to-MAC mappings and redirect local traffic.
        </p>
      </section>
    </Module3LessonLayout>
  );
}