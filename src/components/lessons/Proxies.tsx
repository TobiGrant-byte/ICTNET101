"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function Proxies() {
  return (
    <Module3LessonLayout
      lessonSlug="proxies"
      lessonNumber={7}
      title="Proxy Servers"
      description="Understand how proxy servers sit between clients and servers and learn the differences between proxy types."
    >
      <section>
        <h2 className="text-2xl font-bold">
          What is a proxy?
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          A proxy sits between a client and another network service and
          forwards requests on the client&#39;s behalf.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Proxy types
        </h2>

        <div className="mt-4 space-y-3">
          {[
            [
              "Forward Proxy",
              "Sits in front of clients and can filter, cache, or control outbound traffic.",
            ],
            [
              "Reverse Proxy",
              "Sits in front of servers and can provide load balancing or TLS termination.",
            ],
            [
              "Transparent Proxy",
              "Intercepts traffic without requiring explicit client configuration.",
            ],
          ].map(([name, description]) => (
            <div
              key={name}
              className="rounded-2xl border border-[var(--border)] p-5"
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

      <section>
        <h2 className="text-2xl font-bold">
          Common benefits
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          Proxies can provide caching, content filtering, logging, anonymity,
          and load distribution depending on how they are deployed.
        </p>
      </section>
    </Module3LessonLayout>
  );
}