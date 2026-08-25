"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function Email() {
  return (
    <Module3LessonLayout
      lessonSlug="email"
      lessonNumber={3}
      title="Email Protocols"
      description="Learn how SMTP, IMAP, and POP3 are used to send and receive email."
    >
      <section>
        <h2 className="text-2xl font-bold">
          SMTP
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          SMTP, or Simple Mail Transfer Protocol, is used for sending outgoing
          email between clients and mail servers or between mail servers.
          Common ports include 25 and 587.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          IMAP
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          IMAP retrieves mail while keeping messages synchronized on the
          server. This makes it useful when the same mailbox is accessed from
          multiple devices.
        </p>

        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Common ports: 143 and 993 with TLS.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-bold">
          POP3
        </h2>

        <p className="mt-3 leading-8 text-[var(--muted-foreground)]">
          POP3 normally downloads messages to a local device. It is less
          suited to synchronized multi-device access.
        </p>

        <p className="mt-3 text-sm text-[var(--muted-foreground)]">
          Common ports: 110 and 995 with TLS.
        </p>
      </section>

      <section className="rounded-2xl bg-[var(--muted)] p-5">
        <p className="font-bold">
          Remember
        </p>

        <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
          SMTP = sending. IMAP and POP3 = receiving. IMAP keeps mail
          synchronized, while POP3 generally downloads it locally.
        </p>
      </section>
    </Module3LessonLayout>
  );
}