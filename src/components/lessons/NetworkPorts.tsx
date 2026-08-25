"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";

import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Network,
  RefreshCcw,
  Server,
  ShieldCheck,
  Terminal,
  Trophy,
  XCircle,
} from "lucide-react";

import { useRouter } from "next/navigation";

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type Port = {
  port: string;
  protocol: string;
  service: string;
  description: string;
};

const ports: Port[] = [
  {
    port: "20/21",
    protocol: "TCP",
    service: "FTP",
    description:
      "File Transfer Protocol — data/control",
  },
  {
    port: "22",
    protocol: "TCP",
    service: "SSH",
    description:
      "Secure remote command-line access",
  },
  {
    port: "23",
    protocol: "TCP",
    service: "Telnet",
    description:
      "Older unencrypted remote access",
  },
  {
    port: "25",
    protocol: "TCP",
    service: "SMTP",
    description:
      "Outgoing email",
  },
  {
    port: "53",
    protocol: "TCP/UDP",
    service: "DNS",
    description:
      "Domain Name System",
  },
  {
    port: "67/68",
    protocol: "UDP",
    service: "DHCP",
    description:
      "Automatic network configuration",
  },
  {
    port: "80",
    protocol: "TCP",
    service: "HTTP",
    description:
      "Web traffic",
  },
  {
    port: "110",
    protocol: "TCP",
    service: "POP3",
    description:
      "Email retrieval",
  },
  {
    port: "143",
    protocol: "TCP",
    service: "IMAP",
    description:
      "Email retrieval and synchronization",
  },
  {
    port: "443",
    protocol: "TCP",
    service: "HTTPS",
    description:
      "Encrypted web traffic",
  },
  {
    port: "3389",
    protocol: "TCP",
    service: "RDP",
    description:
      "Windows Remote Desktop",
  },
];

const questions: Question[] = [
  {
    question:
      "What is the purpose of a network port?",
    options: [
      "To identify which application network traffic is intended for",
      "To replace the IP address of a device",
      "To identify a network cable",
      "To increase internet speed",
    ],
    answer: 0,
    explanation:
      "Ports let one IP address handle multiple simultaneous services by identifying which application the traffic is intended for.",
  },
  {
    question:
      "Which range contains the well-known ports?",
    options: [
      "0–1023",
      "1024–49151",
      "49152–65535",
      "100–1000",
    ],
    answer: 0,
    explanation:
      "The lesson defines well-known ports as 0–1023.",
  },
  {
    question:
      "Which range contains registered ports?",
    options: [
      "0–1023",
      "1024–49151",
      "49152–65535",
      "1–1024",
    ],
    answer: 1,
    explanation:
      "Registered ports are 1024–49151.",
  },
  {
    question:
      "Which range contains dynamic/private ports?",
    options: [
      "0–1023",
      "1024–49151",
      "49152–65535",
      "1–255",
    ],
    answer: 2,
    explanation:
      "Dynamic/private ports are 49152–65535.",
  },
  {
    question:
      "Which port is associated with SSH?",
    options: [
      "20",
      "22",
      "53",
      "443",
    ],
    answer: 1,
    explanation:
      "SSH uses TCP port 22.",
  },
  {
    question:
      "Which ports are used by DHCP?",
    options: [
      "20/21",
      "22/23",
      "53/54",
      "67/68",
    ],
    answer: 3,
    explanation:
      "DHCP uses UDP port 67 on the server side and UDP port 68 on the client side.",
  },
  {
    question:
      "Which protocol is associated with TCP port 80?",
    options: [
      "HTTPS",
      "DNS",
      "HTTP",
      "SSH",
    ],
    answer: 2,
    explanation:
      "HTTP uses TCP port 80.",
  },
  {
    question:
      "Which protocol is associated with TCP port 443?",
    options: [
      "HTTP",
      "HTTPS",
      "FTP",
      "SMTP",
    ],
    answer: 1,
    explanation:
      "HTTPS uses TCP port 443.",
  },
  {
    question:
      "Which statement correctly describes TCP?",
    options: [
      "TCP is connectionless and does not guarantee delivery",
      "TCP is connection-oriented and guarantees delivery and order",
      "TCP does not use ports",
      "TCP is only used for wireless communication",
    ],
    answer: 1,
    explanation:
      "TCP is connection-oriented and guarantees delivery and order.",
  },
  {
    question:
      "Which sequence represents the TCP three-way handshake?",
    options: [
      "ACK → SYN → SYN-ACK",
      "SYN → ACK → SYN-ACK",
      "SYN → SYN-ACK → ACK",
      "SYN-ACK → ACK → SYN",
    ],
    answer: 2,
    explanation:
      "The TCP three-way handshake is SYN, SYN-ACK, ACK.",
  },
  {
    question:
      "Which statement correctly describes UDP?",
    options: [
      "UDP guarantees delivery and order",
      "UDP is connectionless and does not guarantee delivery",
      "UDP always uses a three-way handshake",
      "UDP cannot use ports",
    ],
    answer: 1,
    explanation:
      "UDP is connectionless, faster, and does not guarantee delivery.",
  },
  {
    question:
      "Which of these is listed in the lesson as a use of UDP?",
    options: [
      "Streaming",
      "Only file transfer",
      "Only email",
      "Only web browsing",
    ],
    answer: 0,
    explanation:
      "The study material lists streaming, VoIP, and DNS lookups as examples of UDP use.",
  },
];

export default function NetworkPorts() {
  const router = useRouter();

  const [selectedPort, setSelectedPort] =
    useState("22");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const activePort =
    ports.find(
      (port) =>
        port.port === selectedPort
    ) ?? ports[0];

  const question =
    questions[currentQuestion];

  function selectAnswer(index: number) {
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

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Network size={19} />
            Module 1
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 4 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Network Ports &amp; TCP/UDP
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how ports identify network services and explore the
            differences between TCP and UDP.
          </p>
        </header>

        {/* Progress */}
        <section className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Lesson 4 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Final lesson in Module 1
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{
                width: "100%",
              }}
            />
          </div>
        </section>

        {/* What is a Port? */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Network size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is a Network Port?
          </h2>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            A network port allows a single IP address to handle many
            simultaneous connections and services. Ports help identify which
            application network traffic is meant for.
          </p>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Think of an IP address as identifying a device, while a port helps
            identify the particular service or application on that device
            receiving the traffic.
          </p>
        </section>

        {/* Port Ranges */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Port Ranges
          </h2>

          <p className="mt-4 text-base leading-7 text-[var(--muted-foreground)]">
            The study material divides ports into three ranges.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <RangeCard
              range="0–1023"
              title="Well-known"
              description="Reserved for standard services."
            />

            <RangeCard
              range="1024–49151"
              title="Registered"
              description="Assigned to specific applications."
            />

            <RangeCard
              range="49152–65535"
              title="Dynamic / Private"
              description="Used temporarily by clients."
            />
          </div>
        </section>

        {/* Port Explorer */}
        <section className="mt-8">
          <div className="mb-5">
            <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Interactive explorer
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Explore Common Ports
            </h2>

            <p className="mt-2 text-[var(--muted-foreground)]">
              Select a port to see the service and protocol associated with
              it.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[280px_1fr]">

            {/* Port List */}
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {ports.map((port) => {
                const active =
                  port.port ===
                  selectedPort;

                return (
                  <button
                    key={port.port}
                    type="button"
                    onClick={() =>
                      setSelectedPort(
                        port.port
                      )
                    }
                    className={`rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-[var(--primary)] bg-[var(--muted)]"
                        : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <p className="text-lg font-black text-[var(--primary)]">
                      {port.port}
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {port.service}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Active Port */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                  <Server size={26} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    Port {activePort.port}
                  </p>

                  <h3 className="text-3xl font-black">
                    {activePort.service}
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  title="Protocol"
                  value={
                    activePort.protocol
                  }
                />

                <InfoBox
                  title="Port"
                  value={
                    activePort.port
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                <p className="text-sm font-bold">
                  Service
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {activePort.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* TCP */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={24}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              TCP
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            TCP is connection-oriented. The study material states that TCP
            guarantees delivery and order.
          </p>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-6">
            <p className="text-sm font-bold uppercase tracking-wider text-[var(--primary)]">
              Three-way handshake
            </p>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <HandshakeStep
                number="1"
                label="SYN"
                description="Connection request"
              />

              <HandshakeStep
                number="2"
                label="SYN-ACK"
                description="Request acknowledged"
              />

              <HandshakeStep
                number="3"
                label="ACK"
                description="Acknowledgement completes the handshake"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] p-5">
            <p className="font-bold">
              Key characteristics
            </p>

            <ul className="mt-3 space-y-2 text-sm leading-7 text-[var(--muted-foreground)]">
              <li>• Connection-oriented</li>
              <li>• Guarantees delivery</li>
              <li>• Guarantees order</li>
              <li>• Uses ports</li>
            </ul>
          </div>
        </section>

        {/* UDP */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Terminal
              size={24}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              UDP
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            UDP is connectionless. It is faster than TCP in the sense
            described by the study material, but it does not guarantee
            delivery.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              title="Connectionless"
              description="UDP does not establish a connection before sending data."
            />

            <FeatureCard
              title="Faster"
              description="UDP prioritizes speed instead of delivery guarantees."
            />

            <FeatureCard
              title="No Delivery Guarantee"
              description="UDP does not guarantee that data will arrive or arrive in order."
            />
          </div>

          <div className="mt-7 rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5">
            <p className="font-bold">
              Examples from the lesson
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {[
                "Streaming",
                "VoIP",
                "DNS lookups",
              ].map((item) => (
                <span
                  key={item}
                  className="rounded-lg bg-[var(--card)] px-3 py-2 text-sm font-semibold text-[var(--primary)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* TCP vs UDP */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            TCP vs UDP
          </h2>

          <div className="mt-6 overflow-hidden rounded-2xl border border-[var(--border)]">
            <div className="grid grid-cols-3 border-b border-[var(--border)] bg-[var(--muted)] p-4 text-sm font-bold">
              <span>Feature</span>
              <span>TCP</span>
              <span>UDP</span>
            </div>

            <ComparisonRow
              feature="Connection"
              tcp="Connection-oriented"
              udp="Connectionless"
            />

            <ComparisonRow
              feature="Delivery"
              tcp="Guaranteed"
              udp="No guarantee"
            />

            <ComparisonRow
              feature="Order"
              tcp="Guaranteed"
              udp="No guarantee"
            />

            <ComparisonRow
              feature="Speed"
              tcp="Reliable delivery"
              udp="Faster"
            />
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Lesson Summary
          </h2>

          <div className="mt-5 space-y-3 text-sm leading-7">
            <p>
              <strong>Ports:</strong>{" "}
              Identify which application network
              traffic is meant for.
            </p>

            <p>
              <strong>
                Well-known ports:
              </strong>{" "}
              0–1023.
            </p>

            <p>
              <strong>
                Registered ports:
              </strong>{" "}
              1024–49151.
            </p>

            <p>
              <strong>
                Dynamic/private ports:
              </strong>{" "}
              49152–65535.
            </p>

            <p>
              <strong>TCP:</strong>{" "}
              Connection-oriented, guarantees delivery
              and order, and uses the SYN → SYN-ACK → ACK handshake.
            </p>

            <p>
              <strong>UDP:</strong>{" "}
              Connectionless, faster, and does not
              guarantee delivery.
            </p>
          </div>
        </section>

        {/* Practice */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={23}
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
                  Question{" "}
                  {currentQuestion + 1} of{" "}
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
                    width: `${progress}%`,
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

                    let className =
                      "border-[var(--border)] hover:border-[var(--primary)]";

                    if (
                      selectedAnswer !==
                      null
                    ) {
                      if (correct) {
                        className =
                          "border-green-500 bg-green-500/10";
                      } else if (
                        selected
                      ) {
                        className =
                          "border-red-500 bg-red-500/10";
                      }
                    }

                    return (
                      <button
                        key={`${question.question}-${option}`}
                        type="button"
                        onClick={() =>
                          selectAnswer(
                            index
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${className}`}
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
                </div>
              )}

              {selectedAnswer !==
                null && (
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
              )}
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <Trophy size={34} />
              </div>

              <h3 className="mt-5 text-2xl font-bold">
                Lesson practice complete
              </h3>

              <p className="mt-3 text-[var(--muted-foreground)]">
                You scored{" "}
                <span className="font-bold text-[var(--foreground)]">
                  {score}/{questions.length}
                </span>
                .
              </p>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
                The Module 1 final test will combine questions from all four
                lessons.
              </p>

              <button
                type="button"
                onClick={restartQuiz}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                <RefreshCcw size={17} />
                Review Practice
              </button>
            </div>
          )}
        </section>

        {/* Lesson Completion */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <LessonCompletionButton
            moduleSlug="introduction-to-networking"
            lessonSlug="network-ports"
          />
        </section>

        {/* Final Lesson Navigation */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() =>
              router.push(
                "/modules/introduction-to-networking"
              )
            }
            className="group flex items-center justify-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-5 py-4 text-sm font-bold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft
              size={19}
              className="text-[var(--primary)]"
            />

            <span>Back to Module</span>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/modules/introduction-to-networking/test"
              )
            }
            className="group flex items-center justify-center gap-3 rounded-2xl bg-[var(--primary)] px-5 py-4 text-sm font-bold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            <Trophy size={19} />

            <span>
              Take Module 1 Final Test
            </span>

            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

      </div>
    </main>
  );
}

function RangeCard({
  range,
  title,
  description,
}: {
  range: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-2xl font-black text-[var(--primary)]">
        {range}
      </p>

      <h3 className="mt-2 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function InfoBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-2 text-lg font-black text-[var(--primary)]">
        {value}
      </p>
    </div>
  );
}

function HandshakeStep({
  number,
  label,
  description,
}: {
  number: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)] text-sm font-black text-[var(--primary)]">
        {number}
      </div>

      <p className="mt-4 font-black">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
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

function ComparisonRow({
  feature,
  tcp,
  udp,
}: {
  feature: string;
  tcp: string;
  udp: string;
}) {
  return (
    <div className="grid grid-cols-3 border-b border-[var(--border)] p-4 text-sm last:border-b-0">
      <span className="font-semibold">
        {feature}
      </span>

      <span className="text-[var(--muted-foreground)]">
        {tcp}
      </span>

      <span className="text-[var(--muted-foreground)]">
        {udp}
      </span>
    </div>
  );
}