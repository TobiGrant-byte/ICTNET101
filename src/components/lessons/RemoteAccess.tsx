"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function RemoteAccess() {
  return (
    <Module3LessonLayout
      lessonSlug="remote-access"
      lessonNumber={4}
      title="Remote Access"
      description="Explore common technologies used to access computers and private networks remotely."
    >
      <section>
        <h2 className="text-2xl font-bold">
          SSH
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          SSH provides secure encrypted remote command-line access and
          normally uses TCP port 22.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Remote access technologies
        </h2>

        <div className="mt-4 grid gap-3">
          {[
            ["SSH", "Encrypted command-line access", "22"],
            ["RDP", "Windows graphical remote desktop", "3389"],
            ["VNC", "Cross-platform graphical remote access", "Varies"],
            ["VPN", "Encrypted tunnel into a private network", "Varies"],
            ["Telnet", "Legacy unencrypted remote access", "23"],
          ].map(([name, purpose, port]) => (
            <div
              key={name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold">
                  {name}
                </h3>

                <span className="rounded-lg bg-[var(--muted)] px-3 py-1 text-xs font-bold text-[var(--primary)]">
                  Port: {port}
                </span>
              </div>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {purpose}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5">
        <h2 className="font-bold">
          Security Warning
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          Telnet sends traffic without the protection expected from modern
          encrypted remote-access methods and should be avoided in production.
        </p>
      </section>
    </Module3LessonLayout>
  );
}