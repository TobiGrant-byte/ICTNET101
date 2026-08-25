"use client";

import Module3LessonLayout from "@/components/lessons/Module3LessonLayout";

export default function FileSharing() {
  return (
    <Module3LessonLayout
      lessonSlug="file-sharing"
      lessonNumber={5}
      title="File Sharing Protocols"
      description="Learn the major protocols used to transfer files and provide network file and printer sharing."
    >
      <section>
        <h2 className="text-2xl font-bold">
          FTP and related protocols
        </h2>

        <div className="mt-4 space-y-3">
          {[
            ["FTP", "File transfer protocol; unencrypted by default", "20/21"],
            ["FTPS", "FTP protected with TLS", "Varies"],
            ["SFTP", "Secure file transfer over SSH", "22"],
            ["SMB", "Windows file and printer sharing", "445"],
            ["NFS", "Common Linux/Unix network file sharing", "Varies"],
          ].map(([name, description, port]) => (
            <div
              key={name}
              className="rounded-2xl border border-[var(--border)] p-5"
            >
              <div className="flex flex-wrap justify-between gap-2">
                <h3 className="font-bold">
                  {name}
                </h3>

                <span className="text-xs font-semibold text-[var(--primary)]">
                  {port}
                </span>
              </div>

              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Module3LessonLayout>
  );
}