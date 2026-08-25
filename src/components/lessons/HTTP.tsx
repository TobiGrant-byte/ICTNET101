"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function HTTP() {
  return (
    <Module3LessonLayout
      lessonSlug="http"
      lessonNumber={2}
      title="HTTP & Web Services"
      description="Understand how browsers and web services communicate using HTTP and HTTPS."
    >
      <section>
        <h2 className="text-2xl font-bold">
          HTTP
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          HTTP is an application-layer request/response protocol used by web
          clients and servers. Standard HTTP traffic commonly uses TCP port
          80, while HTTPS normally uses TCP port 443 with TLS encryption.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          Common HTTP methods
        </h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            ["GET", "Retrieve data"],
            ["POST", "Submit data"],
            ["PUT", "Update or replace a resource"],
            ["DELETE", "Remove a resource"],
          ].map(([method, meaning]) => (
            <div
              key={method}
              className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5"
            >
              <p className="font-black text-[var(--primary)]">
                {method}
              </p>

              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {meaning}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          HTTP status codes
        </h2>

        <div className="mt-4 space-y-3">
          {[
            ["2xx", "Success"],
            ["3xx", "Redirection"],
            ["4xx", "Client error"],
            ["5xx", "Server error"],
          ].map(([code, meaning]) => (
            <div
              key={code}
              className="flex items-center gap-4 rounded-2xl border border-[var(--border)] p-4"
            >
              <span className="font-black text-[var(--primary)]">
                {code}
              </span>

              <span className="text-sm">
                {meaning}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          HTTP vs HTTPS
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          HTTPS adds TLS encryption to protect data while it travels between
          the client and server.
        </p>
      </section>
    </Module3LessonLayout>
  );
}