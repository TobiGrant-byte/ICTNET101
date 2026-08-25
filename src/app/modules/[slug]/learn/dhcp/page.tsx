"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  CircleHelp,
  Clock3,
  Network,
  RefreshCcw,
  Router,
  Server,
  ShieldCheck,
  Smartphone,
  XCircle,
} from "lucide-react";

type DchpStep = {
  number: number;
  name: string;
  description: string;
  detail: string;
};

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const doraSteps: DchpStep[] = [
  {
    number: 1,
    name: "Discover",
    description:
      "The client broadcasts a DHCP Discover message.",
    detail:
      "The client is looking for a DHCP server that can provide network configuration.",
  },
  {
    number: 2,
    name: "Offer",
    description:
      "A DHCP server responds with an available configuration.",
    detail:
      "The offer can contain an IP address and other configuration information.",
  },
  {
    number: 3,
    name: "Request",
    description:
      "The client requests the offered configuration.",
    detail:
      "The client indicates which DHCP offer it wants to accept.",
  },
  {
    number: 4,
    name: "Acknowledge",
    description:
      "The server confirms the configuration.",
    detail:
      "The client can now use the assigned configuration for the lease period.",
  },
];

const configurationItems = [
  {
    title: "IP Address",
    description:
      "The address assigned to the client so it can communicate on the network.",
    icon: Network,
  },
  {
    title: "Subnet Mask",
    description:
      "Defines the network and host portions of the assigned IP address.",
    icon: Server,
  },
  {
    title: "Default Gateway",
    description:
      "Provides the router address used to reach destinations outside the local network.",
    icon: Router,
  },
  {
    title: "DNS Server",
    description:
      "Provides the DNS server information the client can use for hostname resolution.",
    icon: CircleHelp,
  },
];

const questions: Question[] = [
  {
    question:
      "What is the main purpose of DHCP?",
    options: [
      "To automatically provide network configuration to clients",
      "To encrypt all network traffic",
      "To replace DNS",
      "To forward packets between networks",
    ],
    answer: 0,
    explanation:
      "DHCP automatically provides clients with network configuration such as an IP address and other settings.",
  },
  {
    question:
      "What does the D in DORA represent?",
    options: [
      "Discover",
      "Deliver",
      "Direct",
      "Domain",
    ],
    answer: 0,
    explanation:
      "DORA begins with Discover, where the client looks for a DHCP server.",
  },
  {
    question:
      "What happens during the DHCP Offer stage?",
    options: [
      "The client releases its IP address",
      "A DHCP server offers network configuration to the client",
      "The client sends a DNS query",
      "The router changes its MAC address",
    ],
    answer: 1,
    explanation:
      "During the Offer stage, a DHCP server responds with an available configuration for the client.",
  },
  {
    question:
      "What happens during DHCP Request?",
    options: [
      "The client requests the offered configuration",
      "The server deletes the lease",
      "The client performs DNS resolution",
      "The switch creates a VLAN",
    ],
    answer: 0,
    explanation:
      "The client requests the DHCP configuration it wants to use.",
  },
  {
    question:
      "What is the final stage of DORA?",
    options: [
      "Discover",
      "Offer",
      "Request",
      "Acknowledge",
    ],
    answer: 3,
    explanation:
      "Acknowledge is the final stage, where the DHCP server confirms the configuration.",
  },
  {
    question:
      "Which UDP ports are associated with DHCP?",
    options: [
      "20 and 21",
      "22 and 23",
      "53 and 54",
      "67 and 68",
    ],
    answer: 3,
    explanation:
      "DHCP uses UDP ports 67 and 68.",
  },
  {
    question:
      "What is a DHCP lease?",
    options: [
      "A permanent ownership record for an IP address",
      "A period for which a client is allowed to use assigned network configuration",
      "A DNS record",
      "A routing protocol",
    ],
    answer: 1,
    explanation:
      "A DHCP lease defines how long a client can use the assigned configuration before renewal is required.",
  },
  {
    question:
      "What is a DHCP reservation?",
    options: [
      "A way to reserve a particular IP address for a specific client",
      "A method of encrypting DHCP traffic",
      "A replacement for the default gateway",
      "A type of DNS lookup",
    ],
    answer: 0,
    explanation:
      "A DHCP reservation allows a network administrator to associate a particular IP address with a specific client.",
  },
  {
    question:
      "Which device commonly provides DHCP on a small home network?",
    options: [
      "A home router",
      "A keyboard",
      "A monitor",
      "A printer",
    ],
    answer: 0,
    explanation:
      "Home routers commonly provide DHCP services for devices on the local network.",
  },
  {
    question:
      "Why does DHCP reduce manual configuration?",
    options: [
      "It automatically distributes network settings to clients",
      "It removes the need for IP addresses",
      "It removes all network security",
      "It replaces Ethernet with Wi-Fi",
    ],
    answer: 0,
    explanation:
      "DHCP automates the distribution of network configuration instead of requiring every device to be configured manually.",
  },
];

export default function DHCP() {
  const [selectedStep, setSelectedStep] =
    useState(0);

  const [selectedConfiguration, setSelectedConfiguration] =
    useState(0);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const activeStep =
    doraSteps[selectedStep];

  const activeConfiguration =
    configurationItems[
      selectedConfiguration
    ];

  const question =
    questions[currentQuestion];

  const progress =
    ((currentQuestion + 1) /
      questions.length) *
    100;

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

    setQuizFinished(true);
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setQuizFinished(false);
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">

        {/* Header */}
        <header>
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Server size={19} />
            Module 2
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 3 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            DHCP
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how DHCP automatically gives devices the network
            configuration they need, understand the DORA process, and
            explore leases, reservations, and DHCP ports.
          </p>
        </header>

        {/* Progress */}
        <section className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Lesson 3 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Module 2 — 75%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{
                width: "75%",
              }}
            />
          </div>
        </section>

        {/* What is DHCP */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Server size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is DHCP?
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            DHCP stands for Dynamic Host Configuration Protocol. It allows
            network devices to receive configuration automatically instead
            of requiring every device to be configured manually.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            DHCP can provide information such as an IP address, subnet mask,
            default gateway, and DNS server information.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<Network size={21} />}
              title="Automatic Configuration"
              description="Clients can receive their network settings automatically."
            />

            <FeatureCard
              icon={<Clock3 size={21} />}
              title="Leases"
              description="Assigned configuration is normally provided for a defined lease period."
            />
          </div>
        </section>

        {/* DORA Explorer */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <RefreshCcw
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                The DHCP DORA Process
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            DHCP is commonly explained using four stages: Discover, Offer,
            Request, and Acknowledge.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

            {/* Steps */}
            <div className="space-y-2">
              {doraSteps.map(
                (step, index) => {
                  const active =
                    index ===
                    selectedStep;

                  return (
                    <button
                      key={step.name}
                      type="button"
                      onClick={() =>
                        setSelectedStep(
                          index
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-[var(--primary)] bg-[var(--muted)]"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-black ${
                          active
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                            : "bg-[var(--muted)] text-[var(--primary)]"
                        }`}
                      >
                        {step.number}
                      </div>

                      <div>
                        <p className="font-bold">
                          {step.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          DHCP stage {step.number}
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Step */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-xl font-black text-[var(--primary)]">
                  {activeStep.number}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    DORA Stage
                  </p>

                  <h3 className="text-3xl font-black">
                    {activeStep.name}
                  </h3>
                </div>
              </div>

              <p className="mt-8 text-lg font-bold">
                {activeStep.description}
              </p>

              <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  What happens?
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {activeStep.detail}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-4">
            {doraSteps.map(
              (step, index) => (
                <div
                  key={step.name}
                  className={`rounded-2xl border p-4 text-center ${
                    index === selectedStep
                      ? "border-[var(--primary)] bg-[var(--muted)]"
                      : "border-[var(--border)]"
                  }`}
                >
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                    Step {step.number}
                  </p>

                  <p className="mt-1 font-black text-[var(--primary)]">
                    {step.name}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Configuration */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Network
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                What Can DHCP Configure?
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Select a configuration item to understand the information DHCP
            can provide to a client.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

            <div className="space-y-2">
              {configurationItems.map(
                (item, index) => {
                  const Icon =
                    item.icon;

                  const active =
                    index ===
                    selectedConfiguration;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() =>
                        setSelectedConfiguration(
                          index
                        )
                      }
                      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-[var(--primary)] bg-[var(--muted)]"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          active
                            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                            : "bg-[var(--muted)] text-[var(--primary)]"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <span className="font-semibold">
                        {item.title}
                      </span>
                    </button>
                  );
                }
              )}
            </div>

            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <Network size={25} />
              </div>

              <h3 className="mt-6 text-3xl font-black">
                {activeConfiguration.title}
              </h3>

              <p className="mt-4 max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
                {activeConfiguration.description}
              </p>
            </div>
          </div>
        </section>

        {/* DHCP Ports */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Server
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              DHCP Ports
            </h2>
          </div>

          <p className="mt-4 text-base leading-8">
            DHCP uses UDP for communication. The lesson identifies UDP
            port 67 for DHCP servers and UDP port 68 for DHCP clients.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PortCard
              port="UDP 67"
              title="DHCP Server"
              description="Used by the DHCP server side of the exchange."
            />

            <PortCard
              port="UDP 68"
              title="DHCP Client"
              description="Used by the client side of the exchange."
            />
          </div>
        </section>

        {/* Lease and Renewal */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoSection
            icon={<Clock3 size={23} />}
            title="DHCP Leases"
            description="A DHCP lease determines how long a client can use an assigned configuration."
            points={[
              "The configuration is temporary rather than permanent",
              "The client can renew the lease",
              "The server manages the lease duration",
            ]}
          />

          <InfoSection
            icon={<RefreshCcw size={23} />}
            title="Lease Renewal"
            description="Clients can renew their assigned configuration so they can continue using the address and other settings."
            points={[
              "Helps clients retain their configuration",
              "Reduces unnecessary address changes",
              "Allows the DHCP server to manage address usage",
            ]}
          />
        </section>

        {/* DHCP Reservation */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              DHCP Reservations
            </h2>
          </div>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            A DHCP reservation allows an administrator to associate a
            particular IP address with a particular client. This can provide
            predictable addressing while still using DHCP.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <ExampleCard
              title="Client"
              value="MAC address"
            />

            <ExampleCard
              title="Reserved IP"
              value="192.168.1.50"
            />

            <ExampleCard
              title="Result"
              value="Predictable DHCP address"
            />
          </div>
        </section>

        {/* Practical Example */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Smartphone
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Practical Example
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Imagine connecting a phone to your home Wi-Fi for the first time.
            The phone does not normally require you to manually type every
            network setting. DHCP can provide the phone with an IP address,
            subnet information, gateway, and DNS server configuration.
          </p>

          <div className="mt-7 rounded-2xl bg-[var(--muted)] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Example configuration
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBox
                title="IP Address"
                value="192.168.1.25"
              />

              <InfoBox
                title="Subnet Mask"
                value="255.255.255.0"
              />

              <InfoBox
                title="Gateway"
                value="192.168.1.1"
              />

              <InfoBox
                title="DNS"
                value="192.168.1.1"
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Lesson Summary
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-7">
            <li>
              <strong>1.</strong> DHCP automatically provides network
              configuration to clients.
            </li>

            <li>
              <strong>2.</strong> DORA stands for Discover, Offer, Request,
              and Acknowledge.
            </li>

            <li>
              <strong>3.</strong> DHCP can provide an IP address, subnet mask,
              default gateway, and DNS information.
            </li>

            <li>
              <strong>4.</strong> DHCP uses UDP ports 67 and 68.
            </li>

            <li>
              <strong>5.</strong> DHCP leases determine how long assigned
              configuration can be used.
            </li>

            <li>
              <strong>6.</strong> Clients can renew their leases.
            </li>

            <li>
              <strong>7.</strong> DHCP reservations can associate a specific
              address with a specific client.
            </li>
          </ul>
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
                Check Your Understanding
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
                <span className="font-bold text-[var(--foreground)]">
                  {score}/{questions.length}
                </span>
                .
              </p>

              <button
                type="button"
                onClick={
                  restartQuiz
                }
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
            moduleSlug="routing-wifi-dhcp-dns"
            lessonSlug="dhcp"
          />
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/wifi"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={17} />
            Previous Lesson
          </Link>

          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/dns"
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

function FeatureCard({
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

      <p className="mt-2 text-sm font-bold leading-6 text-[var(--primary)]">
        {value}
      </p>
    </div>
  );
}

function PortCard({
  port,
  title,
  description,
}: {
  port: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
      <code className="text-2xl font-black text-[var(--primary)]">
        {port}
      </code>

      <h3 className="mt-3 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function InfoSection({
  icon,
  title,
  description,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  points: string[];
}) {
  return (
    <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-9">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
          {icon}
        </div>

        <h2 className="text-xl font-black">
          {title}
        </h2>
      </div>

      <p className="mt-5 text-sm leading-7 text-[var(--muted-foreground)]">
        {description}
      </p>

      <ul className="mt-5 space-y-2">
        {points.map((point) => (
          <li
            key={point}
            className="flex items-start gap-3 text-sm"
          >
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-[var(--primary)]"
            />

            <span>{point}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ExampleCard({
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
