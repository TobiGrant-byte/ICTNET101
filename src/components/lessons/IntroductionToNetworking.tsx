"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import LessonNavigation from "@/components/lessons/LessonNavigation";
import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  Circle,
  Globe,
  Laptop,
  Network,
  Router,
  Server,
  ShieldCheck,
  Smartphone,
  Wifi,
  XCircle,
} from "lucide-react";

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    question: "What is a computer network?",
    options: [
      "A program used to increase computer storage",
      "A group of devices connected together to share data and resources",
      "A type of computer operating system",
      "A device used only to access the internet",
    ],
    answer: 1,
    explanation:
      "A computer network is a group of devices connected together so they can share data and resources such as files, printers, and internet access.",
  },
  {
    question:
      "Which OSI layer is responsible for IP addressing and routing between networks?",
    options: [
      "Layer 1 — Physical",
      "Layer 2 — Data Link",
      "Layer 3 — Network",
      "Layer 7 — Application",
    ],
    answer: 2,
    explanation:
      "The Network layer is Layer 3 of the OSI model. It handles IP addressing and routing between networks.",
  },
  {
    question:
      "Which OSI layer uses MAC addresses and is associated with switches and frames?",
    options: [
      "Layer 1 — Physical",
      "Layer 2 — Data Link",
      "Layer 4 — Transport",
      "Layer 6 — Presentation",
    ],
    answer: 1,
    explanation:
      "The Data Link layer is Layer 2. It handles MAC addressing and frames, and switches primarily operate at this layer.",
  },
  {
    question:
      "Which device connects different networks and forwards packets using IP addresses?",
    options: [
      "Switch",
      "Router",
      "Access Point",
      "Modem",
    ],
    answer: 1,
    explanation:
      "A router connects different networks and forwards packets using destination IP addresses.",
  },
  {
    question:
      "Which device connects devices on the same local network and forwards frames using MAC addresses?",
    options: [
      "Router",
      "Modem",
      "Switch",
      "Access Point",
    ],
    answer: 2,
    explanation:
      "A switch connects devices on the same local network and forwards Ethernet frames using MAC addresses.",
  },
  {
    question: "Which OSI layer contains TCP and UDP?",
    options: [
      "Layer 2 — Data Link",
      "Layer 3 — Network",
      "Layer 4 — Transport",
      "Layer 7 — Application",
    ],
    answer: 2,
    explanation:
      "TCP and UDP operate at Layer 4, the Transport layer.",
  },
  {
    question:
      "Which OSI layer is associated with cables, radio waves, connectors, and electrical signaling?",
    options: [
      "Layer 1 — Physical",
      "Layer 2 — Data Link",
      "Layer 5 — Session",
      "Layer 7 — Application",
    ],
    answer: 0,
    explanation:
      "The Physical layer is Layer 1. It deals with cables, radio waves, connectors, and electrical signaling.",
  },
  {
    question:
      "Which device provides Wi-Fi connectivity to a wired network?",
    options: [
      "Router",
      "Access Point",
      "Switch",
      "Modem",
    ],
    answer: 1,
    explanation:
      "An access point provides Wi-Fi connectivity to a wired network.",
  },
];

const osiLayers = [
  {
    number: 7,
    title: "Application",
    description:
      "The layer users and software interact with. Examples include HTTP, DNS, SMTP, and FTP.",
    icon: Globe,
  },
  {
    number: 6,
    title: "Presentation",
    description:
      "Handles data formatting, encryption/decryption, and compression.",
    icon: ShieldCheck,
  },
  {
    number: 5,
    title: "Session",
    description:
      "Establishes, maintains, and ends sessions between hosts.",
    icon: Network,
  },
  {
    number: 4,
    title: "Transport",
    description:
      "Uses protocols such as TCP and UDP. Ports exist at this layer.",
    icon: Server,
  },
  {
    number: 3,
    title: "Network",
    description:
      "Handles IP addressing and routing between networks.",
    icon: Router,
  },
  {
    number: 2,
    title: "Data Link",
    description:
      "Uses MAC addressing and handles frames. Ethernet, Wi-Fi, and switches are associated with this layer.",
    icon: Network,
  },
  {
    number: 1,
    title: "Physical",
    description:
      "Deals with cables, radio waves, connectors, and electrical signaling.",
    icon: Wifi,
  },
];

const devices = [
  {
    title: "Switch",
    description:
      "Connects devices on the same local network (LAN) and forwards frames using MAC addresses.",
    icon: Network,
  },
  {
    title: "Router",
    description:
      "Connects different networks and forwards packets using IP addresses.",
    icon: Router,
  },
  {
    title: "Modem",
    description:
      "Converts signals between your ISP's line and your home network.",
    icon: Server,
  },
  {
    title: "Access Point",
    description:
      "Provides Wi-Fi connectivity to a wired network.",
    icon: Wifi,
  },
];

export default function IntroductionToNetworking() {
  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const question =
    questions[currentQuestion];

  function selectAnswer(index: number) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) => previous + 1
      );

      setSelectedAnswer(null);
    } else {
      setQuizFinished(true);
    }
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="mb-10">
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Network size={18} />
            Module 1
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Introduction to Networking
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn the fundamentals of computer networking, how devices
            communicate, the OSI model, the TCP/IP model, and the key devices
            used in networks.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">
              Lesson 1 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Introduction
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: "25%" }}
            />
          </div>
        </div>

        <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Network size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is a Computer Network?
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            A computer network is a group of devices connected together so
            they can share data and resources. Resources can include files,
            printers, and internet access.
          </p>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            The devices participating in a network can communicate with one
            another through wired or wireless connections. Networking provides
            a way for information and resources to move between connected
            devices.
          </p>

          <div className="my-10 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6">
            <p className="mb-6 text-center text-sm font-semibold text-[var(--muted-foreground)]">
              Example of connected network devices
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Device
                icon={<Laptop size={24} />}
                label="Computer"
              />

              <div className="h-px w-8 bg-[var(--primary)]" />

              <Device
                icon={<Network size={24} />}
                label="Switch"
              />

              <div className="h-px w-8 bg-[var(--primary)]" />

              <Device
                icon={<Router size={24} />}
                label="Router"
              />

              <div className="h-px w-8 bg-[var(--primary)]" />

              <Device
                icon={<Globe size={24} />}
                label="Internet"
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold">
            Why are networks used?
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <ConceptCard
              icon={<Server size={21} />}
              title="Share Files"
              description="Connected devices can share files and other information across the network."
            />

            <ConceptCard
              icon={<Network size={21} />}
              title="Share Resources"
              description="Networks allow resources such as printers and internet access to be shared."
            />

            <ConceptCard
              icon={<Globe size={21} />}
              title="Communicate"
              description="Devices can exchange information with other devices across the network."
            />

            <ConceptCard
              icon={<Smartphone size={21} />}
              title="Connect Devices"
              description="Computers and other devices can participate in the same network through wired or wireless connectivity."
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Network size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            The OSI 7-Layer Model
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Networks can be described using the OSI 7-layer model. The model
            divides networking communication into seven layers, with each
            layer having a particular responsibility.
          </p>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Understanding these layers makes it easier to understand where
            different networking technologies, protocols, and devices fit
            into network communication.
          </p>

          <div className="mt-8 space-y-3">
            {osiLayers.map((layer) => {
              const Icon =
                layer.icon;

              return (
                <div
                  key={layer.number}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <div className="flex gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--muted)] font-black text-[var(--primary)]">
                      {layer.number}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Icon
                          size={18}
                          className="text-[var(--primary)]"
                        />

                        <h3 className="font-bold">
                          Layer {layer.number} —{" "}
                          {layer.title}
                        </h3>
                      </div>

                      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                        {layer.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
            <p className="text-sm font-bold text-[var(--primary)]">
              Important
            </p>

            <p className="mt-2 text-sm leading-6">
              The PDF identifies switches with Layer 2 (Data Link) and routers
              with Layer 3 (Network). TCP and UDP are associated with Layer 4
              (Transport), where ports are used.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Globe size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            The TCP/IP Model
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            The TCP/IP model condenses the OSI model into four layers. The
            course material identifies these as Application, Transport,
            Internet, and Network Access.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ModelCard
              title="Application"
              description="Combines the functions represented by OSI Layers 5, 6, and 7."
            />

            <ModelCard
              title="Transport"
              description="Corresponds to OSI Layer 4 and includes TCP and UDP."
            />

            <ModelCard
              title="Internet"
              description="Corresponds to OSI Layer 3 and handles IP addressing and routing."
            />

            <ModelCard
              title="Network Access"
              description="Combines the functions represented by OSI Layers 1 and 2."
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <p className="text-sm font-bold text-[var(--primary)]">
              Remember
            </p>

            <p className="mt-2 text-sm leading-6">
              The PDF describes the TCP/IP model as the model actually used
              on the internet.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Router size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            Key Networking Devices
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Different devices perform different jobs within a network. The
            four key devices covered in this lesson are switches, routers,
            modems, and access points.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {devices.map((device) => {
              const Icon =
                device.icon;

              return (
                <div
                  key={device.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-4 font-bold">
                    {device.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {device.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--border)]">
            <div className="grid grid-cols-2 border-b border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-bold sm:grid-cols-3">
              <span>Device</span>

              <span className="hidden sm:block">
                Main Function
              </span>

              <span>
                Key Address/Connection
              </span>
            </div>

            <DeviceRow
              device="Switch"
              functionText="Connects devices on the same local network"
              detail="MAC addresses"
            />

            <DeviceRow
              device="Router"
              functionText="Connects different networks"
              detail="IP addresses"
            />

            <DeviceRow
              device="Modem"
              functionText="Converts signals between ISP line and home network"
              detail="ISP connection"
            />

            <DeviceRow
              device="Access Point"
              functionText="Provides Wi-Fi connectivity to a wired network"
              detail="Wireless connection"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Lesson Summary
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-7">
            <li>
              <strong>1.</strong> A computer network is a group of connected
              devices that can share data and resources.
            </li>

            <li>
              <strong>2.</strong> The OSI model divides network communication
              into seven layers.
            </li>

            <li>
              <strong>3.</strong> Layer 4 is the Transport layer and includes
              TCP and UDP.
            </li>

            <li>
              <strong>4.</strong> Layer 3 is the Network layer and handles IP
              addressing and routing.
            </li>

            <li>
              <strong>5.</strong> Layer 2 is the Data Link layer and uses MAC
              addresses and frames.
            </li>

            <li>
              <strong>6.</strong> The TCP/IP model condenses the OSI model into
              four layers.
            </li>

            <li>
              <strong>7.</strong> Switches primarily operate at Layer 2,
              while routers operate at Layer 3.
            </li>

            <li>
              <strong>8.</strong> Modems convert signals between an ISP&apos;s
              line and a home network, while access points provide Wi-Fi
              connectivity to a wired network.
            </li>
          </ul>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={22}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">
                Interactive practice
              </p>

              <h2 className="text-2xl font-bold">
                Check your understanding
              </h2>
            </div>
          </div>

          {!quizFinished ? (
            <div className="mt-8">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold">
                  Question {currentQuestion + 1} of{" "}
                  {questions.length}
                </span>

                <span className="text-[var(--muted-foreground)]">
                  Score: {score}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{
                    width: `${
                      ((currentQuestion + 1) /
                        questions.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <h3 className="mt-7 text-xl font-bold leading-8">
                {question.question}
              </h3>

              <div className="mt-6 space-y-3">
                {question.options.map(
                  (option, index) => {
                    const isSelected =
                      selectedAnswer === index;

                    const isCorrect =
                      index ===
                      question.answer;

                    let optionClass =
                      "border-[var(--border)] hover:border-[var(--primary)]";

                    if (
                      selectedAnswer !== null
                    ) {
                      if (isCorrect) {
                        optionClass =
                          "border-green-500 bg-green-500/10";
                      } else if (
                        isSelected
                      ) {
                        optionClass =
                          "border-red-500 bg-red-500/10";
                      }
                    }

                    return (
                      <button
                        key={`${question.question}-${option}`}
                        type="button"
                        onClick={() =>
                          selectAnswer(index)
                        }
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${optionClass}`}
                      >
                        <span className="shrink-0">
                          {selectedAnswer !== null &&
                          isCorrect ? (
                            <CheckCircle2
                              size={21}
                              className="text-green-500"
                            />
                          ) : selectedAnswer !== null &&
                            isSelected ? (
                            <XCircle
                              size={21}
                              className="text-red-500"
                            />
                          ) : (
                            <Circle
                              size={21}
                              className="text-[var(--muted-foreground)]"
                            />
                          )}
                        </span>

                        <span className="text-sm font-medium">
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {selectedAnswer !== null && (
                <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                  <p className="text-sm font-bold">
                    {selectedAnswer ===
                    question.answer
                      ? "Correct"
                      : "Not quite"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {question.explanation}
                  </p>
                </div>
              )}

              {selectedAnswer !== null && (
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
                  >
                    {currentQuestion ===
                    questions.length - 1
                      ? "View result"
                      : "Next question"}

                    <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <CheckCircle2 size={34} />
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Practice complete
              </h3>

              <p className="mt-3 text-[var(--muted-foreground)]">
                You scored{" "}
                <span className="font-bold text-[var(--foreground)]">
                  {score}/{questions.length}
                </span>
                .
              </p>

              <button
                type="button"
                onClick={restartQuiz}
                className="mt-6 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                Try again
              </button>
            </div>
          )}
        </section>

        <LessonCompletionButton
          moduleSlug="introduction-to-networking"
          lessonSlug="introduction"
        />

        <LessonNavigation />
      </div>
    </div>
  );
}

function Device({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex min-w-[80px] flex-col items-center gap-2">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--card)] text-[var(--primary)] shadow-sm">
        {icon}
      </div>

      <span className="text-xs font-semibold">
        {label}
      </span>
    </div>
  );
}

function ConceptCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function ModelCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function DeviceRow({
  device,
  functionText,
  detail,
}: {
  device: string;
  functionText: string;
  detail: string;
}) {
  return (
    <div className="grid grid-cols-2 border-b border-[var(--border)] p-4 text-sm last:border-b-0 sm:grid-cols-3">
      <span className="font-semibold">
        {device}
      </span>

      <span className="hidden text-[var(--muted-foreground)] sm:block">
        {functionText}
      </span>

      <span className="text-[var(--muted-foreground)]">
        {detail}
      </span>
    </div>
  );
}