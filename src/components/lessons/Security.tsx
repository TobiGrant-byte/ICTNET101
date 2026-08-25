"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function Security() {
  return (
    <Module3LessonLayout
      lessonSlug="security"
      lessonNumber={8}
      title="Network Security Basics"
      description="Learn the core principles used to protect networks, systems, and data."
    >
      <section>
        <h2 className="text-2xl font-bold">
          CIA Triad
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            ["Confidentiality", "Only authorized parties should access information."],
            ["Integrity", "Information should remain accurate and trustworthy."],
            ["Availability", "Systems and information should remain accessible when needed."],
          ].map(([name, description]) => (
            <div
              key={name}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
            >
              <h3 className="font-bold text-[var(--primary)]">
                {name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Core security practices
        </h2>

        <div className="mt-4 space-y-3">
          {[
            "Network segmentation",
            "Least privilege",
            "Encryption in transit",
            "Strong authentication and MFA",
            "Patch management",
            "Monitoring and logging",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-[var(--border)] p-4 text-sm font-semibold"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Security is layered: limiting access, encrypting communication,
          keeping systems patched, segmenting networks, and monitoring for
          suspicious activity all reduce risk.
        </p>
      </section>
    </Module3LessonLayout>
  );
}