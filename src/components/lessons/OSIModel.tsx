"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import { useState } from "react";

import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronRight,
  Layers3,
  Network,
  Server,
  Shield,
  XCircle,
} from "lucide-react";

type Layer = {
  number: number;
  name: string;
  purpose: string;
  examples: string[];
  description: string;
};

const layers: Layer[] = [
  {
    number: 7,
    name: "Application",
    purpose:
      "Provides network services that applications and users interact with.",
    examples: ["HTTP", "DNS", "SMTP", "FTP"],
    description:
      "The Application layer is the top layer of the OSI model. It provides network services that applications and users interact with. Examples include HTTP, DNS, SMTP, and FTP.",
  },
  {
    number: 6,
    name: "Presentation",
    purpose:
      "Handles data formatting, encryption/decryption, and compression.",
    examples: [
      "Data formatting",
      "Encryption",
      "Decryption",
      "Compression",
    ],
    description:
      "The Presentation layer deals with how information is represented. It handles data formatting, encryption and decryption, and compression.",
  },
  {
    number: 5,
    name: "Session",
    purpose:
      "Establishes, maintains, and ends communication sessions.",
    examples: [
      "Session establishment",
      "Session maintenance",
      "Session termination",
    ],
    description:
      "The Session layer manages communication sessions between hosts, including establishing, maintaining, and ending sessions.",
  },
  {
    number: 4,
    name: "Transport",
    purpose:
      "Provides end-to-end transport between hosts.",
    examples: ["TCP", "UDP", "Ports"],
    description:
      "The Transport layer handles end-to-end transport. TCP provides reliable delivery while UDP is faster but does not guarantee delivery. Ports are associated with this layer.",
  },
  {
    number: 3,
    name: "Network",
    purpose:
      "Handles IP addressing and routing between networks.",
    examples: ["IPv4", "IPv6", "IP addressing", "Routing"],
    description:
      "The Network layer handles IP addressing and routing. It moves packets between different networks using IP addresses.",
  },
  {
    number: 2,
    name: "Data Link",
    purpose:
      "Handles MAC addressing and frames.",
    examples: ["MAC addresses", "Ethernet", "Wi-Fi", "Switches"],
    description:
      "The Data Link layer handles frames and MAC addressing. Ethernet and Wi-Fi are associated with this layer, and switches primarily operate here.",
  },
  {
    number: 1,
    name: "Physical",
    purpose:
      "Handles physical transmission of bits.",
    examples: [
      "Cables",
      "Radio waves",
      "Connectors",
      "Electrical signaling",
    ],
    description:
      "The Physical layer handles the physical transmission of data through media such as cables and radio waves.",
  },
];

const questions = [
  {
    question: "How many layers are in the OSI model?",
    options: ["4", "5", "7", "8"],
    answer: 2,
    explanation:
      "The OSI model contains seven layers.",
  },
  {
    question:
      "Which layer provides services that applications and users interact with?",
    options: [
      "Physical",
      "Network",
      "Transport",
      "Application",
    ],
    answer: 3,
    explanation:
      "Layer 7 is the Application layer.",
  },
  {
    question:
      "Which layer handles data formatting, encryption/decryption, and compression?",
    options: [
      "Presentation",
      "Session",
      "Transport",
      "Data Link",
    ],
    answer: 0,
    explanation:
      "Layer 6 is the Presentation layer.",
  },
  {
    question:
      "Which layer handles IP addressing and routing?",
    options: [
      "Data Link",
      "Network",
      "Transport",
      "Application",
    ],
    answer: 1,
    explanation:
      "Layer 3 is the Network layer.",
  },
  {
    question:
      "Which layer handles MAC addresses and frames?",
    options: [
      "Physical",
      "Data Link",
      "Network",
      "Transport",
    ],
    answer: 1,
    explanation:
      "Layer 2 is the Data Link layer.",
  },
  {
    question:
      "Which layer is associated with TCP, UDP, and ports?",
    options: [
      "Network",
      "Transport",
      "Session",
      "Application",
    ],
    answer: 1,
    explanation:
      "TCP, UDP, and ports are associated with Layer 4, the Transport layer.",
  },
  {
    question:
      "Which layer deals with cables, radio waves, and connectors?",
    options: [
      "Physical",
      "Data Link",
      "Presentation",
      "Application",
    ],
    answer: 0,
    explanation:
      "Layer 1 is the Physical layer.",
  },
];

export default function OSIModel() {
  const [selectedLayer, setSelectedLayer] =
    useState(7);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [finished, setFinished] =
    useState(false);

  const activeLayer =
    layers.find(
      (layer) =>
        layer.number === selectedLayer
    ) ?? layers[0];

  const question =
    questions[currentQuestion];

  function chooseLayer(number: number) {
    setSelectedLayer(number);
  }

  function chooseAnswer(index: number) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(index);

    if (index === question.answer) {
      setScore(
        (previous) => previous + 1
      );
    }
  }

  function nextQuestion() {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      );

      setSelectedAnswer(null);
      return;
    }

    setFinished(true);
  }

  function resetPractice() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Layers3 size={19} />
            Module 1
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 2 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            The OSI 7-Layer Model
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how network communication is divided into seven layers and
            understand the role of each layer.
          </p>
        </header>

        {/* Progress */}
        <div className="mt-8">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">
              Lesson progress
            </span>

            <span className="text-[var(--muted-foreground)]">
              50%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{
                width: "50%",
              }}
            />
          </div>
        </div>

        {/* Introduction */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Network size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is the OSI Model?
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            The OSI model is a seven-layer framework for describing network
            communication. Each layer performs a different role.
          </p>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            By separating communication into layers, it becomes easier to
            understand networking technologies and determine where a
            particular function belongs.
          </p>

          <div className="mt-7 rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
            <p className="text-sm font-bold text-[var(--primary)]">
              Layer order
            </p>

            <p className="mt-2 text-sm leading-7">
              Application → Presentation → Session → Transport → Network →
              Data Link → Physical
            </p>
          </div>
        </section>

        {/* Explorer */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Layers3
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Explore the Seven Layers
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Click any layer below. The information panel will update
            immediately.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

            {/* Buttons */}
            <div className="space-y-2">
              {layers.map((layer) => {
                const active =
                  layer.number ===
                  selectedLayer;

                return (
                  <button
                    key={layer.number}
                    type="button"
                    onClick={() =>
                      chooseLayer(
                        layer.number
                      )
                    }
                    className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-[var(--primary)] bg-[var(--muted)]"
                        : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                        active
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                          : "bg-[var(--muted)] text-[var(--primary)]"
                      }`}
                    >
                      {layer.number}
                    </span>

                    <span className="font-semibold">
                      {layer.name}
                    </span>

                    <ChevronRight
                      size={17}
                      className={`ml-auto transition-transform ${
                        active
                          ? "translate-x-1 text-[var(--primary)]"
                          : ""
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Detail */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-xl font-black text-[var(--primary)]">
                  {activeLayer.number}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    Layer {activeLayer.number}
                  </p>

                  <h3 className="text-3xl font-black">
                    {activeLayer.name}
                  </h3>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Main responsibility
                </p>

                <p className="mt-2 text-lg font-bold">
                  {activeLayer.purpose}
                </p>
              </div>

              <p className="mt-6 text-base leading-8 text-[var(--muted-foreground)]">
                {activeLayer.description}
              </p>

              <div className="mt-7">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Examples
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {activeLayer.examples.map(
                    (example) => (
                      <span
                        key={example}
                        className="rounded-lg bg-[var(--muted)] px-3 py-2 text-sm font-semibold text-[var(--primary)]"
                      >
                        {example}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Relationships */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Important Networking Relationships
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard
              icon={<Network size={20} />}
              title="Switch"
              layer="Layer 2 — Data Link"
              description="Switches primarily operate at Layer 2 and use MAC addresses to forward frames."
            />

            <InfoCard
              icon={<Server size={20} />}
              title="Router"
              layer="Layer 3 — Network"
              description="Routers operate at Layer 3 and use IP addresses to forward packets."
            />

            <InfoCard
              icon={<Shield size={20} />}
              title="TCP / UDP"
              layer="Layer 4 — Transport"
              description="TCP and UDP are associated with the Transport layer, where ports are used."
            />

            <InfoCard
              icon={<Network size={20} />}
              title="Physical Media"
              layer="Layer 1 — Physical"
              description="Cables, radio waves, connectors, and electrical signaling belong to the Physical layer."
            />
          </div>
        </section>

        {/* TCP/IP */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            TCP/IP Model
          </h2>

          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            The TCP/IP model condenses the seven OSI layers into four broader
            layers.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ModelCard
              title="Application"
              mapping="OSI 5–7"
            />

            <ModelCard
              title="Transport"
              mapping="OSI 4"
            />

            <ModelCard
              title="Internet"
              mapping="OSI 3"
            />

            <ModelCard
              title="Network Access"
              mapping="OSI 1–2"
            />
          </div>
        </section>

        {/* Practice */}
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
                Check Your Understanding
              </h2>
            </div>
          </div>

          {!finished ? (
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
                    const selected =
                      selectedAnswer ===
                      index;

                    const correct =
                      index ===
                      question.answer;

                    let optionClass =
                      "border-[var(--border)] hover:border-[var(--primary)]";

                    if (
                      selectedAnswer !==
                      null
                    ) {
                      if (correct) {
                        optionClass =
                          "border-green-500 bg-green-500/10";
                      } else if (
                        selected
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
                          chooseAnswer(
                            index
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${optionClass}`}
                      >
                        {selectedAnswer !==
                          null &&
                        correct ? (
                          <CheckCircle2
                            size={21}
                            className="shrink-0 text-green-500"
                          />
                        ) : selectedAnswer !==
                            null &&
                          selected ? (
                          <XCircle
                            size={21}
                            className="shrink-0 text-red-500"
                          />
                        ) : (
                          <Circle
                            size={21}
                            className="shrink-0 text-[var(--muted-foreground)]"
                          />
                        )}

                        <span className="text-sm font-medium">
                          {option}
                        </span>
                      </button>
                    );
                  }
                )}
              </div>

              {selectedAnswer !==
                null && (
                <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                  <p className="text-sm font-bold">
                    {selectedAnswer ===
                    question.answer
                      ? "Correct"
                      : "Review this answer"}
                  </p>

                  <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                    {question.explanation}
                  </p>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={
                        nextQuestion
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
                    >
                      {currentQuestion ===
                      questions.length - 1
                        ? "View Result"
                        : "Next Question"}

                      <ArrowRight
                        size={18}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <CheckCircle2 size={34} />
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Practice Complete
              </h3>

              <p className="mt-3 text-[var(--muted-foreground)]">
                You scored{" "}
                <span className="font-bold">
                  {score}/{questions.length}
                </span>
                .
              </p>

              <button
                type="button"
                onClick={
                  resetPractice
                }
                className="mt-6 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                Review Practice
              </button>
            </div>
          )}
        </section>

        {/* Lesson Completion */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <LessonCompletionButton
            moduleSlug="introduction-to-networking"
            lessonSlug="osi-model"
          />
        </section>

        {/* Bottom Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/modules/introduction-to-networking/learn/introduction"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={17} />
            Previous Lesson
          </Link>

          <Link
            href="/modules/introduction-to-networking/learn/connectivity"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            Next Lesson
            <ArrowRight size={17} />
          </Link>
        </div>

      </div>
    </main>
  );
}

function InfoCard({
  icon,
  title,
  layer,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  layer: string;
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

      <p className="mt-1 text-sm font-semibold text-[var(--primary)]">
        {layer}
      </p>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function ModelCard({
  title,
  mapping,
}: {
  title: string;
  mapping: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[var(--primary)]">
        {mapping}
      </p>
    </div>
  );
}