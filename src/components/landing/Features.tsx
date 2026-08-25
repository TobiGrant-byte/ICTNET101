import {
  BookOpen,
  FlaskConical,
  Brain,
  Terminal,
  Trophy,
  ChartNoAxesCombined,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Interactive Lessons",
    description:
      "Learn networking concepts in short, structured lessons designed for students.",
  },
  {
    icon: FlaskConical,
    title: "Practical Labs",
    description:
      "Put concepts into practice with networking simulations and hands-on challenges.",
  },
  {
    icon: Brain,
    title: "Smart Quizzes",
    description:
      "Test your understanding and identify the areas you need to improve.",
  },
  {
    icon: Terminal,
    title: "Networking Terminal",
    description:
      "Practice networking commands directly from your browser without needing a laptop.",
  },
  {
    icon: Trophy,
    title: "XP & Achievements",
    description:
      "Earn experience points, complete challenges and track your learning journey.",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Progress Tracking",
    description:
      "See exactly how far you've progressed through the networking curriculum.",
  },
];

export default function Features() {
  return (
    <section className="border-t border-[var(--border)] bg-[var(--muted)]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Everything in one place
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Learn beyond the textbook.
          </h2>

          <p className="mt-4 text-[var(--muted-foreground)]">
            ICTNET101 turns networking theory into an interactive learning
            experience.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)] transition-all duration-200 group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)]">
                  <Icon size={24} strokeWidth={2} />
                </div>

                <h3 className="mt-5 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}