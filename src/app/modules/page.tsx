import ModuleCard from "@/components/modules/ModuleCard";
import UserName from "@/components/auth/UserName";
import { modules } from "@/data/modules";

export default function ModulesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">

        {/* Welcome */}
        <div className="mb-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Welcome back
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
            Hello, <UserName />
          </h1>

          <p className="mt-3 text-[var(--muted-foreground)]">
            Continue your networking journey and keep building your skills.
          </p>
        </div>

        {/* Header */}
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Learning Path
          </p>

          <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Networking Fundamentals
          </h2>

          <p className="mt-5 text-lg leading-8 text-[var(--muted-foreground)]">
            Work through the networking curriculum one module at a time.
            Learn the concepts, test your understanding, and apply what
            you&apos;ve learned through practical activities.
          </p>
        </div>

        {/* Modules */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <ModuleCard
              key={module.id}
              id={module.id}
              slug={module.slug}
              title={module.title}
              description={module.description}
              icon={module.icon}
              difficulty={module.difficulty}
              estimatedTime={module.estimatedTime}
              topics={module.topics}
              lessons={module.lessons}
            />
          ))}
        </div>

      </section>
    </main>
  );
}