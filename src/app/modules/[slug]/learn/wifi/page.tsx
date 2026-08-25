"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import Link from "next/link";
import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  LockKeyhole,
  Radio,
  RefreshCcw,
  Router,
  ShieldCheck,
  Signal,
  Wifi,
  XCircle,
} from "lucide-react";

type WifiBand = {
  name: string;
  frequency: string;
  strengths: string[];
  limitations: string[];
  typicalUse: string;
};

type WifiSecurity = {
  name: string;
  description: string;
  recommended: boolean;
};

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const wifiBands: WifiBand[] = [
  {
    name: "2.4 GHz",
    frequency: "2.4 GHz",
    strengths: [
      "Longer range",
      "Better wall penetration",
      "Widely supported",
    ],
    limitations: [
      "More congestion",
      "More interference",
      "Usually lower performance than newer bands",
    ],
    typicalUse:
      "Useful when coverage and range are more important than maximum speed.",
  },
  {
    name: "5 GHz",
    frequency: "5 GHz",
    strengths: [
      "Higher performance",
      "More available channels",
      "Generally less congested than 2.4 GHz",
    ],
    limitations: [
      "Shorter range than 2.4 GHz",
      "More easily affected by walls",
    ],
    typicalUse:
      "Useful for higher-speed connections when the device is reasonably close to the access point.",
  },
  {
    name: "6 GHz",
    frequency: "6 GHz",
    strengths: [
      "Newer wireless spectrum",
      "More clean spectrum",
      "Designed for modern Wi-Fi deployments",
    ],
    limitations: [
      "Shorter coverage compared with lower frequencies",
      "Requires compatible devices",
    ],
    typicalUse:
      "Useful for modern high-performance Wi-Fi environments with compatible equipment.",
  },
];

const securityOptions: WifiSecurity[] = [
  {
    name: "WEP",
    description:
      "An older wireless security standard that is no longer considered secure.",
    recommended: false,
  },
  {
    name: "WPA",
    description:
      "An improvement over WEP, but now outdated compared with modern standards.",
    recommended: false,
  },
  {
    name: "WPA2",
    description:
      "A widely used wireless security standard that provides much stronger protection than WEP and WPA.",
    recommended: true,
  },
  {
    name: "WPA3",
    description:
      "A newer Wi-Fi security standard designed to provide stronger modern wireless protection.",
    recommended: true,
  },
];

const questions: Question[] = [
  {
    question:
      "What does an SSID identify?",
    options: [
      "The wireless network name",
      "The router's MAC address",
      "The internet service provider",
      "The Wi-Fi password itself",
    ],
    answer: 0,
    explanation:
      "The SSID is the name used to identify a wireless network.",
  },
  {
    question:
      "Which Wi-Fi band generally provides the longest range?",
    options: [
      "2.4 GHz",
      "5 GHz",
      "6 GHz",
      "All have exactly the same range",
    ],
    answer: 0,
    explanation:
      "2.4 GHz generally travels farther and penetrates obstacles better than the higher-frequency bands.",
  },
  {
    question:
      "Which band is generally associated with higher performance and shorter range than 2.4 GHz?",
    options: [
      "2.4 GHz",
      "5 GHz",
      "Only AM radio",
      "Ethernet",
    ],
    answer: 1,
    explanation:
      "5 GHz commonly provides higher performance but generally has shorter range than 2.4 GHz.",
  },
  {
    question:
      "Which of these is a modern Wi-Fi security standard?",
    options: [
      "WPA3",
      "FTP",
      "HTTP",
      "ARP",
    ],
    answer: 0,
    explanation:
      "WPA3 is a modern Wi-Fi security standard.",
  },
  {
    question:
      "Why can Wi-Fi channels matter?",
    options: [
      "They determine the amount of network storage",
      "They can affect interference and wireless performance",
      "They replace the IP address",
      "They determine the CPU speed",
    ],
    answer: 1,
    explanation:
      "Choosing an appropriate channel can reduce interference and improve wireless performance.",
  },
  {
    question:
      "Which statement about 2.4 GHz is generally correct?",
    options: [
      "It always has the shortest range",
      "It generally provides longer range than higher Wi-Fi bands",
      "It cannot be used for Wi-Fi",
      "It is only used for wired Ethernet",
    ],
    answer: 1,
    explanation:
      "2.4 GHz generally provides longer range and better penetration through obstacles.",
  },
  {
    question:
      "Which Wi-Fi security option should generally be preferred when supported?",
    options: [
      "WEP",
      "WPA",
      "WPA3",
      "No security",
    ],
    answer: 2,
    explanation:
      "WPA3 is the newest security standard in this lesson and should generally be preferred when compatible equipment supports it.",
  },
  {
    question:
      "What is a major cause of poor wireless performance?",
    options: [
      "Interference and congestion",
      "Using an IP address",
      "Having a subnet mask",
      "Using Ethernet elsewhere in the network",
    ],
    answer: 0,
    explanation:
      "Wireless interference and congestion can reduce performance and reliability.",
  },
];

export default function WifiLesson() {
  const [selectedBand, setSelectedBand] =
    useState(0);

  const [selectedSecurity, setSelectedSecurity] =
    useState(2);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const activeBand =
    wifiBands[selectedBand];

  const activeSecurity =
    securityOptions[selectedSecurity];

  const question =
    questions[currentQuestion];

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
            <Wifi size={19} />
            Module 2
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 2 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Wi-Fi Explained
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how wireless networks use radio frequencies, SSIDs,
            channels, and security standards to connect devices.
          </p>
        </header>

        {/* Progress */}
        <section className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Lesson 2 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Module 2 — 50%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: "50%" }}
            />
          </div>
        </section>

        {/* What is Wi-Fi */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Wifi size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is Wi-Fi?
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            Wi-Fi is a wireless networking technology that allows devices
            to communicate over radio frequencies instead of requiring a
            physical Ethernet cable for every connection.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            A wireless access point provides the wireless connection and
            allows compatible devices such as laptops, phones, and tablets
            to participate in the network.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <FeatureCard
              icon={<Radio size={21} />}
              title="Radio"
              description="Wireless communication uses radio frequencies."
            />

            <FeatureCard
              icon={<Router size={21} />}
              title="Access Point"
              description="An access point provides wireless connectivity to the network."
            />

            <FeatureCard
              icon={<Signal size={21} />}
              title="Signal"
              description="Distance, obstacles, interference, and band selection affect wireless performance."
            />
          </div>
        </section>

        {/* SSID */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Signal
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              SSID — The Wi-Fi Network Name
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            The SSID identifies a wireless network. When you open the Wi-Fi
            settings on a phone or computer, the network names you see are
            SSIDs.
          </p>

          <div className="mt-7 rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Example
            </p>

            <code className="mt-2 block rounded-xl bg-[var(--background)] p-4 text-sm font-bold text-[var(--primary)]">
              ICTNET101-Campus-WiFi
            </code>
          </div>
        </section>

        {/* Frequency Bands */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Radio
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Explore Wi-Fi Frequency Bands
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Select a frequency band to compare its strengths, limitations,
            and typical use.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* Band List */}
            <div className="space-y-2">
              {wifiBands.map(
                (band, index) => {
                  const active =
                    index ===
                    selectedBand;

                  return (
                    <button
                      key={band.name}
                      type="button"
                      onClick={() =>
                        setSelectedBand(
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
                        <Wifi size={18} />
                      </div>

                      <div>
                        <p className="font-bold">
                          {band.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {band.frequency}
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Band */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                  <Radio size={26} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    Frequency Band
                  </p>

                  <h3 className="text-3xl font-black">
                    {activeBand.name}
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  title="Frequency"
                  value={
                    activeBand.frequency
                  }
                />

                <InfoBox
                  title="Typical Use"
                  value={
                    activeBand.typicalUse
                  }
                />
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">

                <div className="rounded-2xl border border-green-500/30 bg-green-500/10 p-5">
                  <p className="text-sm font-bold text-green-600 dark:text-green-400">
                    Strengths
                  </p>

                  <ul className="mt-3 space-y-2">
                    {activeBand.strengths.map(
                      (item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm leading-6"
                        >
                          <CheckCircle2
                            size={16}
                            className="mt-1 shrink-0 text-green-500"
                          />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-5">
                  <p className="text-sm font-bold text-yellow-700 dark:text-yellow-400">
                    Limitations
                  </p>

                  <ul className="mt-3 space-y-2">
                    {activeBand.limitations.map(
                      (item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-sm leading-6"
                        >
                          <Circle
                            size={16}
                            className="mt-1 shrink-0 text-yellow-600 dark:text-yellow-400"
                          />
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Channels and Interference */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoSection
            icon={<Radio size={23} />}
            title="Wireless Channels"
            description="Wi-Fi communication uses channels within a frequency band. Choosing an appropriate channel can help reduce interference from nearby wireless networks."
            points={[
              "Channels are parts of the available wireless spectrum",
              "Nearby networks can compete for the same spectrum",
              "Channel selection can affect reliability and performance",
            ]}
          />

          <InfoSection
            icon={<Signal size={23} />}
            title="Interference"
            description="Wireless signals can be affected by other networks, physical obstacles, and other sources of radio interference."
            points={[
              "Congestion can reduce performance",
              "Walls and distance can weaken signals",
              "Poor channel choices can increase interference",
            ]}
          />
        </section>

        {/* Security */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Wi-Fi Security Standards
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Wireless security has evolved over time. Select a standard to
            review its role and whether it should generally be preferred.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {securityOptions.map(
              (security, index) => {
                const active =
                  index ===
                  selectedSecurity;

                return (
                  <button
                    key={security.name}
                    type="button"
                    onClick={() =>
                      setSelectedSecurity(
                        index
                      )
                    }
                    className={`rounded-2xl border p-5 text-left transition ${
                      active
                        ? "border-[var(--primary)] bg-[var(--muted)]"
                        : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-lg font-black text-[var(--primary)]">
                        {security.name}
                      </span>

                      {security.recommended && (
                        <CheckCircle2
                          size={18}
                          className="text-green-500"
                        />
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {security.description}
                    </p>
                  </button>
                );
              }
            )}
          </div>

          <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
            <div className="flex items-center gap-3">
              <LockKeyhole
                size={20}
                className="text-[var(--primary)]"
              />

              <p className="font-bold">
                Selected:{" "}
                {activeSecurity.name}
              </p>
            </div>

            <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
              {activeSecurity.description}
            </p>

            <p className="mt-3 text-xs font-semibold text-[var(--muted-foreground)]">
              {activeSecurity.recommended
                ? "This is a modern security option."
                : "This is an older security standard and should not be preferred for a new deployment."}
            </p>
          </div>
        </section>

        {/* Wi-Fi Security Recommendations */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Practical Wi-Fi Security
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <SecurityTip
              title="Use Modern Security"
              text="Prefer WPA3 when supported. WPA2 remains widely deployed."
            />

            <SecurityTip
              title="Protect the Network"
              text="Use a strong wireless password instead of leaving the network open."
            />

            <SecurityTip
              title="Choose Channels Carefully"
              text="Consider nearby networks and interference when selecting channels."
            />

            <SecurityTip
              title="Use Compatible Bands"
              text="Select the band that matches the required range, performance, and device compatibility."
            />
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Lesson Summary
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-7">
            <li>
              <strong>1.</strong> Wi-Fi uses radio frequencies to provide
              wireless network connectivity.
            </li>

            <li>
              <strong>2.</strong> An SSID identifies a wireless network.
            </li>

            <li>
              <strong>3.</strong> 2.4 GHz generally provides longer range and
              better obstacle penetration.
            </li>

            <li>
              <strong>4.</strong> 5 GHz generally provides higher performance
              but shorter range than 2.4 GHz.
            </li>

            <li>
              <strong>5.</strong> 6 GHz provides newer spectrum for compatible
              modern Wi-Fi equipment.
            </li>

            <li>
              <strong>6.</strong> Wireless channels affect congestion and
              interference.
            </li>

            <li>
              <strong>7.</strong> WPA2 and WPA3 provide much stronger
              protection than older WEP and WPA standards.
            </li>

            <li>
              <strong>8.</strong> Wireless performance can be affected by
              distance, walls, congestion, and interference.
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
            moduleSlug="routing-wifi-dhcp-dns"
            lessonSlug="wifi"
          />
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/routing"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={17} />
            Previous Lesson
          </Link>

          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/dhcp"
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

function SecurityTip({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <div className="flex items-center gap-3">
        <ShieldCheck
          size={19}
          className="text-[var(--primary)]"
        />

        <h3 className="font-bold">
          {title}
        </h3>
      </div>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        {text}
      </p>
    </div>
  );
}