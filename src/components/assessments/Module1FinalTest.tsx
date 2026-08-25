"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  Network,
  RotateCcw,
  Terminal,
  Trophy,
  XCircle,
} from "lucide-react";

import NetworkTerminal from "@/components/lab/NetworkTerminal";
import {
  shuffleArray,
  shuffleWithCorrectAnswer,
} from "@/lib/shuffle";
import { createClient } from "@/lib/supabase/client";

type Question = {
  id: number;
  lesson: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

type PracticalTask = {
  id: string;
  title: string;
  description: string;
  hint: string;
  explanation: string;
};

type AssessmentAttempt = {
  questions: Question[];
  practicalTasks: PracticalTask[];
};

const STORAGE_KEY =
  "ictnet101-module1-final-assessment";

const MODULE_SLUG =
  "introduction-to-networking";

const REQUIRED_LESSONS = [
  "introduction-to-networking",
  "osi-model",
  "basic-connectivity",
  "network-ports",
];

const baseQuestions: Question[] = [
  {
    id: 1,
    lesson: "Introduction to Networking",
    question:
      "What is the main purpose of a computer network?",
    options: [
      "To increase processor speed",
      "To share data and resources between connected devices",
      "To replace operating systems",
      "To increase storage capacity",
    ],
    answer: 1,
    explanation:
      "A computer network connects devices so they can share data and resources.",
  },
  {
    id: 2,
    lesson: "Introduction to Networking",
    question:
      "Which OSI layer handles IP addressing and routing?",
    options: [
      "Layer 1 — Physical",
      "Layer 2 — Data Link",
      "Layer 3 — Network",
      "Layer 7 — Application",
    ],
    answer: 2,
    explanation:
      "Layer 3 is the Network layer and handles IP addressing and routing.",
  },
  {
    id: 3,
    lesson: "Introduction to Networking",
    question:
      "Which device forwards frames using MAC addresses?",
    options: [
      "Router",
      "Switch",
      "Modem",
      "Access Point",
    ],
    answer: 1,
    explanation:
      "Switches primarily operate at Layer 2 and use MAC addresses to forward frames.",
  },
  {
    id: 4,
    lesson: "Introduction to Networking",
    question:
      "Which OSI layer handles data formatting, encryption/decryption, and compression?",
    options: [
      "Application",
      "Presentation",
      "Session",
      "Transport",
    ],
    answer: 1,
    explanation:
      "Layer 6 is the Presentation layer.",
  },
  {
    id: 5,
    lesson: "Introduction to Networking",
    question:
      "How many layers are in the OSI model?",
    options: ["4", "5", "7", "8"],
    answer: 2,
    explanation:
      "The OSI model contains seven layers.",
  },
  {
    id: 6,
    lesson: "The OSI Model",
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
    id: 7,
    lesson: "The OSI Model",
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
    id: 8,
    lesson: "The OSI Model",
    question:
      "Which layer deals with cables and radio waves?",
    options: [
      "Physical",
      "Data Link",
      "Network",
      "Presentation",
    ],
    answer: 0,
    explanation:
      "Layer 1 is the Physical layer.",
  },
  {
    id: 9,
    lesson: "The OSI Model",
    question:
      "Which TCP/IP layer corresponds to OSI Layer 3?",
    options: [
      "Application",
      "Transport",
      "Internet",
      "Network Access",
    ],
    answer: 2,
    explanation:
      "The TCP/IP Internet layer corresponds to OSI Layer 3.",
  },
  {
    id: 10,
    lesson: "Basic Networking Connectivity",
    question:
      "How many bits are in an IPv4 address?",
    options: ["16", "32", "64", "128"],
    answer: 1,
    explanation:
      "IPv4 uses 32-bit addresses.",
  },
  {
    id: 11,
    lesson: "Basic Networking Connectivity",
    question:
      "Which is a private IPv4 range?",
    options: [
      "8.8.8.0/24",
      "172.16.0.0/12",
      "1.1.1.0/24",
      "224.0.0.0/4",
    ],
    answer: 1,
    explanation:
      "172.16.0.0/12 is one of the three private IPv4 ranges.",
  },
  {
    id: 12,
    lesson: "Basic Networking Connectivity",
    question:
      "What does a subnet mask define?",
    options: [
      "The MAC address",
      "The network and host portions of an IP address",
      "The cable type",
      "The application protocol",
    ],
    answer: 1,
    explanation:
      "A subnet mask defines which part of an IP address represents the network and which part represents the host.",
  },
  {
    id: 13,
    lesson: "Basic Networking Connectivity",
    question:
      "What is the default gateway?",
    options: [
      "The device's MAC address",
      "The router used for destinations outside the local subnet",
      "The Wi-Fi name",
      "The subnet mask",
    ],
    answer: 1,
    explanation:
      "The default gateway is the router used when the destination isn't on the local subnet.",
  },
  {
    id: 14,
    lesson: "Basic Networking Connectivity",
    question:
      "Which command tests basic reachability?",
    options: [
      "ping",
      "ipconfig",
      "arp -a",
      "netstat",
    ],
    answer: 0,
    explanation:
      "ping tests basic reachability.",
  },
  {
    id: 15,
    lesson: "Basic Networking Connectivity",
    question:
      "Which command shows the hop-by-hop path to a destination?",
    options: [
      "ipconfig",
      "arp -a",
      "traceroute / tracert",
      "netstat",
    ],
    answer: 2,
    explanation:
      "traceroute or tracert shows the hop-by-hop path.",
  },
  {
    id: 16,
    lesson: "Network Ports & TCP/UDP",
    question:
      "What does a network port identify?",
    options: [
      "The physical cable",
      "The application/service the traffic is intended for",
      "The operating system",
      "The router's MAC address",
    ],
    answer: 1,
    explanation:
      "Ports identify which application or service network traffic is intended for.",
  },
  {
    id: 17,
    lesson: "Network Ports & TCP/UDP",
    question:
      "Which range contains well-known ports?",
    options: [
      "0–1023",
      "1024–49151",
      "49152–65535",
      "1–255",
    ],
    answer: 0,
    explanation:
      "Well-known ports are 0–1023.",
  },
  {
    id: 18,
    lesson: "Network Ports & TCP/UDP",
    question:
      "Which port is associated with SSH?",
    options: ["21", "22", "53", "443"],
    answer: 1,
    explanation:
      "SSH uses TCP port 22.",
  },
  {
    id: 19,
    lesson: "Network Ports & TCP/UDP",
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
      "DHCP uses UDP ports 67 and 68.",
  },
  {
    id: 20,
    lesson: "Network Ports & TCP/UDP",
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
      "The TCP three-way handshake is SYN → SYN-ACK → ACK.",
  },
];

const basePracticalTasks: PracticalTask[] = [
  {
    id: "ip-config",
    title: "Task 1 — Inspect Your Network Configuration",
    description:
      "Display the network interfaces and addressing information for your lab machine.",
    hint:
      "Use a command such as ip a, ip addr, or ifconfig.",
    explanation:
      "This checks whether you can inspect the IP configuration of a Linux machine.",
  },
  {
    id: "ping-gateway",
    title: "Task 2 — Test Connectivity",
    description:
      "Use ping to test whether a destination can be reached from your lab machine.",
    hint:
      "Use the ping command to send an ICMP echo request.",
    explanation:
      "This checks whether you understand how to test basic network reachability.",
  },
  {
    id: "trace-route",
    title: "Task 3 — Trace a Network Path",
    description:
      "Trace the network path toward example.com.",
    hint:
      "Use traceroute on Linux.",
    explanation:
      "This checks whether you can investigate the path packets take toward a destination.",
  },
  {
    id: "dns-lookup",
    title: "Task 4 — Resolve a Hostname",
    description:
      "Use a DNS utility to determine the IP information associated with example.com.",
    hint:
      "Use nslookup or dig.",
    explanation:
      "This checks whether you understand how to investigate hostname resolution.",
  },
  {
    id: "arp-table",
    title: "Task 5 — Inspect the Local ARP Table",
    description:
      "Display the entries currently available in the local ARP table.",
    hint:
      "Use arp -a.",
    explanation:
      "This checks whether you can inspect local IP-to-MAC address information.",
  },
  {
    id: "connections",
    title: "Task 6 — Inspect Network Connections",
    description:
      "Display network connections or listening sockets currently available on the machine.",
    hint:
      "Use ss or netstat.",
    explanation:
      "This checks whether you can inspect current network connections and listening services.",
  },
];

function createNewAttempt(): AssessmentAttempt {
  const shuffledQuestions = shuffleArray(
    baseQuestions
  ).map((question) => {
    const shuffled =
      shuffleWithCorrectAnswer(
        question.options,
        question.answer
      );

    return {
      ...question,
      options: shuffled.options,
      answer: shuffled.answer,
    };
  });

  return {
    questions: shuffledQuestions,
    practicalTasks:
      shuffleArray(basePracticalTasks),
  };
}

function loadAssessmentAttempt(): AssessmentAttempt {
  if (typeof window === "undefined") {
    return createNewAttempt();
  }

  const stored =
    window.sessionStorage.getItem(
      STORAGE_KEY
    );

  if (stored) {
    try {
      return JSON.parse(
        stored
      ) as AssessmentAttempt;
    } catch {
      window.sessionStorage.removeItem(
        STORAGE_KEY
      );
    }
  }

  const newAttempt = createNewAttempt();

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(newAttempt)
  );

  return newAttempt;
}

export default function Module1FinalTest() {
  const [accessChecked, setAccessChecked] =
    useState(false);

  const [lessonsCompleted, setLessonsCompleted] =
    useState(false);

  const [accessError, setAccessError] =
    useState("");

  const [attempt, setAttempt] =
    useState<AssessmentAttempt>(
      loadAssessmentAttempt
    );

  const [section, setSection] =
    useState<
      "knowledge" | "practical" | "results"
    >("knowledge");

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [taskIndex, setTaskIndex] =
    useState(0);

  const [completedTasks, setCompletedTasks] =
    useState<string[]>([]);

  const [checkingTask, setCheckingTask] =
    useState(false);

  const [taskMessage, setTaskMessage] =
    useState("");

  const [savingResult, setSavingResult] =
    useState(false);

  const [resultSaved, setResultSaved] =
    useState(false);

  const [resultSaveError, setResultSaveError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function checkAssessmentAccess() {
      try {
        const supabase = createClient();

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          if (active) {
            window.location.href = "/login";
          }
          return;
        }

        const {
          data: progressRows,
          error: progressError,
        } = await supabase
          .from("lesson_progress")
          .select(
            "lesson_slug, completed"
          )
          .eq("user_id", user.id)
          .eq(
            "module_slug",
            MODULE_SLUG
          );

        if (progressError) {
          throw progressError;
        }

        const completed =
          new Set(
            (progressRows ?? [])
              .filter(
                (row) =>
                  row.completed === true
              )
              .map(
                (row) =>
                  row.lesson_slug
              )
          );

        /*
         * Some of the lesson pages use the
         * short route slugs while the database
         * stores the completion using the full
         * lesson slugs.
         *
         * Accept both so the assessment
         * doesn't incorrectly lock a completed
         * module.
         */
        const alternativeLessonSlugs = [
          [
            "introduction",
            "introduction-to-networking",
          ],
          [
            "osi",
            "osi-model",
          ],
          [
            "connectivity",
            "basic-connectivity",
          ],
          [
            "ports",
            "network-ports",
          ],
        ];

        const allComplete =
          alternativeLessonSlugs.every(
            ([shortSlug, databaseSlug]) =>
              completed.has(shortSlug) ||
              completed.has(databaseSlug)
          );

        if (!allComplete) {
          if (active) {
            setLessonsCompleted(false);
            setAccessError(
              "Complete all four Module 1 lessons before taking the final assessment."
            );
            setAccessChecked(true);
          }
          return;
        }

        if (active) {
          setLessonsCompleted(true);
          setAccessChecked(true);
        }
      } catch (error) {
        console.error(
          "Module 1 assessment access error:",
          error
        );

        if (active) {
          setAccessError(
            "We could not verify your Module 1 lesson progress."
          );
          setAccessChecked(true);
        }
      }
    }

    void checkAssessmentAccess();

    return () => {
      active = false;
    };
  }, []);

  const questions = attempt.questions;
  const practicalTasks =
    attempt.practicalTasks;

  const question =
    questions[currentQuestion];

  const task =
    practicalTasks[taskIndex];

  const knowledgeProgress =
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
        (previous) =>
          previous + 1
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

    setSection("practical");
  }

  async function checkTask() {
    setCheckingTask(true);
    setTaskMessage("");

    try {
      const supabase = createClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        throw new Error(
          "You must be signed in."
        );
      }

      const response = await fetch(
        `http://localhost:3001/check-task?task=${encodeURIComponent(
          task.id
        )}&access_token=${encodeURIComponent(
          session.access_token
        )}`,
        {
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Assessment request failed"
        );
      }

      const data =
        await response.json();

      if (!data.correct) {
        setTaskMessage(
          "The task has not been completed yet. Review the instruction and try again."
        );
        return;
      }

      setCompletedTasks(
        (previous) =>
          previous.includes(task.id)
            ? previous
            : [
                ...previous,
                task.id,
              ]
      );

      setTaskMessage(
        "Task completed successfully."
      );
    } catch (error) {
      console.error(error);

      setTaskMessage(
        "The assessment server could not be reached or your session could not be verified."
      );
    } finally {
      setCheckingTask(false);
    }
  }

  async function saveAssessmentResult(
    finalPracticalScore: number
  ) {
    if (resultSaved) {
      return true;
    }

    setSavingResult(true);
    setResultSaveError("");

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "You must be signed in to save your assessment result."
        );
      }

      const finalTotalScore =
        score +
        finalPracticalScore;

      const finalTotalPossible =
        questions.length +
        practicalTasks.length;

      const finalPercentage =
        Math.round(
          (finalTotalScore /
            finalTotalPossible) *
            100
        );

      const passed =
        finalPercentage >= 70;

      const {
        error: saveError,
      } =
        await supabase
          .from(
            "assessment_results"
          )
          .insert({
            user_id: user.id,
            assessment_name:
              "Module 1 Final Assessment",
            module_slug:
              MODULE_SLUG,
            knowledge_score:
              score,
            knowledge_total:
              questions.length,
            practical_score:
              finalPracticalScore,
            practical_total:
              practicalTasks.length,
            total_score:
              finalTotalScore,
            total_possible:
              finalTotalPossible,
            percentage:
              finalPercentage,
            passed,
          });

      if (saveError) {
        throw saveError;
      }

      setResultSaved(true);
      return true;
    } catch (error) {
      console.error(
        "Assessment result save error:",
        error
      );

      setResultSaveError(
        "Your result could not be saved to your account. Please try again."
      );

      return false;
    } finally {
      setSavingResult(false);
    }
  }

  async function nextTask() {
    if (
      taskIndex <
      practicalTasks.length - 1
    ) {
      setTaskIndex(
        (previous) =>
          previous + 1
      );
      setTaskMessage("");
      return;
    }

    const practicalScore =
      completedTasks.length;

    const saved =
      await saveAssessmentResult(
        practicalScore
      );

    if (saved) {
      setSection("results");
    }
  }

  function restartTest() {
    const newAttempt =
      createNewAttempt();

    if (
      typeof window !==
      "undefined"
    ) {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(newAttempt)
      );
    }

    setAttempt(newAttempt);
    setSection("knowledge");
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setTaskIndex(0);
    setCompletedTasks([]);
    setCheckingTask(false);
    setTaskMessage("");
    setSavingResult(false);
    setResultSaved(false);
    setResultSaveError("");
  }

  function leaveTest() {
    if (
      typeof window !==
      "undefined"
    ) {
      window.sessionStorage.removeItem(
        STORAGE_KEY
      );
    }
  }

  if (!accessChecked) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-16">
          <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
              <Trophy size={32} />
            </div>

            <h1 className="mt-6 text-2xl font-black">
              Checking assessment access...
            </h1>

            <p className="mt-3 text-sm text-[var(--muted-foreground)]">
              Verifying your Module 1 lesson progress.
            </p>
          </section>
        </div>
      </main>
    );
  }

  if (!lessonsCompleted) {
    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto flex min-h-screen max-w-3xl items-center justify-center px-5 py-16">
          <section className="w-full rounded-3xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--muted-foreground)]">
              <Lock size={32} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Module 1 Assessment
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Assessment Locked
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              {accessError ||
                "Complete all four Module 1 lessons before taking the final assessment."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/modules/${MODULE_SLUG}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-bold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Return to Module
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                Dashboard
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  if (section === "results") {
    const practicalScore =
      completedTasks.length;

    const totalScore =
      score +
      practicalScore;

    const totalPossible =
      questions.length +
      practicalTasks.length;

    const percentage =
      Math.round(
        (totalScore /
          totalPossible) *
          100
      );

    return (
      <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
          <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 text-center sm:p-12">
            {savingResult && (
              <div className="mb-6 rounded-2xl bg-[var(--muted)] p-4 text-sm font-semibold">
                Saving your assessment result...
              </div>
            )}

            {resultSaveError && (
              <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm">
                {resultSaveError}
              </div>
            )}

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[var(--muted)] text-[var(--primary)]">
              <Trophy size={40} />
            </div>

            <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
              Module 1 Assessment Complete
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Final Results
            </h1>

            <p className="mt-8 text-6xl font-black text-[var(--primary)]">
              {percentage}%
            </p>

            <p className="mt-3 text-lg text-[var(--muted-foreground)]">
              {totalScore} / {totalPossible} points
            </p>

            <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
              <ScoreCard
                title="Knowledge Test"
                score={score}
                total={questions.length}
              />

              <ScoreCard
                title="Practical Assessment"
                score={practicalScore}
                total={practicalTasks.length}
              />
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-[var(--muted)] p-5">
              <p className="font-bold">
                {percentage >= 70
                  ? "Module 1 assessment passed."
                  : "Keep reviewing Module 1 before retaking the assessment."}
              </p>

              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Your practical section was completed using the real Linux networking terminal.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={restartTest}
                disabled={savingResult}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={17} />
                New Attempt
              </button>

              <Link
                href={`/modules/${MODULE_SLUG}`}
                onClick={leaveTest}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Back to Module
                <ArrowRight size={17} />
              </Link>

              <Link
                href="/dashboard"
                onClick={leaveTest}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                Dashboard
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header>
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Network size={19} />
            Module 1 Final Assessment
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Introduction to Networking
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Complete both the knowledge test and practical networking assessment.
          </p>
        </header>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <div
            className={`rounded-2xl border p-4 ${
              section === "knowledge"
                ? "border-[var(--primary)] bg-[var(--muted)]"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Part A
            </p>

            <p className="mt-1 font-bold">
              Knowledge Test
            </p>

            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {score}/{questions.length} correct so far
            </p>
          </div>

          <div
            className={`rounded-2xl border p-4 ${
              section === "practical"
                ? "border-[var(--primary)] bg-[var(--muted)]"
                : "border-[var(--border)] bg-[var(--card)]"
            }`}
          >
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
              Part B
            </p>

            <p className="mt-1 font-bold">
              Practical Assessment
            </p>

            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              {completedTasks.length}/
              {practicalTasks.length} tasks complete
            </p>
          </div>
        </div>

        {section === "knowledge" && (
          <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
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
                  width: `${knowledgeProgress}%`,
                }}
              />
            </div>

            <div className="mt-8 rounded-xl bg-[var(--muted)] px-4 py-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                From
              </p>

              <p className="mt-1 text-sm font-bold text-[var(--primary)]">
                {question.lesson}
              </p>
            </div>

            <h2 className="mt-7 text-2xl font-bold leading-9">
              {question.question}
            </h2>

            <div className="mt-7 space-y-3">
              {question.options.map(
                (option, index) => {
                  const selected =
                    selectedAnswer === index;

                  const correct =
                    index === question.answer;

                  let optionClass =
                    "border-[var(--border)] hover:border-[var(--primary)]";

                  if (
                    selectedAnswer !== null
                  ) {
                    if (correct) {
                      optionClass =
                        "border-green-500 bg-green-500/10";
                    } else if (selected) {
                      optionClass =
                        "border-red-500 bg-red-500/10";
                    }
                  }

                  return (
                    <button
                      key={`${question.id}-${option}`}
                      type="button"
                      onClick={() =>
                        chooseAnswer(index)
                      }
                      className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${optionClass}`}
                    >
                      {selectedAnswer !== null &&
                      correct ? (
                        <CheckCircle2
                          size={21}
                          className="shrink-0 text-green-500"
                        />
                      ) : selectedAnswer !== null &&
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

            {selectedAnswer !== null && (
              <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                <p className="text-sm font-bold">
                  {selectedAnswer === question.answer
                    ? "Correct"
                    : "Review this answer"}
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {question.explanation}
                </p>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
                  >
                    {currentQuestion ===
                    questions.length - 1
                      ? "Start Practical Assessment"
                      : "Next Question"}

                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {section === "practical" && (
          <>
            <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--card)] p-7 sm:p-10">
              <div className="flex items-center gap-3">
                <Terminal
                  size={24}
                  className="text-[var(--primary)]"
                />

                <div>
                  <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                    Part B
                  </p>

                  <h2 className="text-2xl font-black">
                    Practical Networking Assessment
                  </h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                Complete each task using the real Linux networking terminal. Read the instruction carefully and use what you learned in the lessons.
              </p>
            </section>

            <section className="mt-8">
              <NetworkTerminal />
            </section>

            <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                    Practical Progress
                  </p>

                  <h2 className="mt-1 text-xl font-bold">
                    Task {taskIndex + 1} of{" "}
                    {practicalTasks.length}
                  </h2>
                </div>

                <span className="text-sm font-semibold text-[var(--muted-foreground)]">
                  {completedTasks.length}/
                  {practicalTasks.length}
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all"
                  style={{
                    width: `${
                      ((taskIndex + 1) /
                        practicalTasks.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </section>

            <section className="mt-5 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-[var(--primary)]">
                Current Task
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {task.title}
              </h2>

              <p className="mt-5 text-base leading-8 text-[var(--muted-foreground)]">
                {task.description}
              </p>

              <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Tiny Hint
                </p>

                <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                  {task.hint}
                </p>
              </div>

              {taskMessage && (
                <div
                  className={`mt-6 rounded-2xl border p-5 ${
                    taskMessage.includes(
                      "successfully"
                    )
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-yellow-500/30 bg-yellow-500/10"
                  }`}
                >
                  <p className="text-sm leading-7">
                    {taskMessage}
                  </p>
                </div>
              )}

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={checkTask}
                  disabled={checkingTask}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2 size={18} />

                  {checkingTask
                    ? "Checking..."
                    : "Check Task"}
                </button>

                {completedTasks.includes(
                  task.id
                ) && (
                  <button
                    type="button"
                    onClick={nextTask}
                    disabled={savingResult}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 font-bold transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {taskIndex ===
                    practicalTasks.length - 1
                      ? savingResult
                        ? "Saving Result..."
                        : "View Final Results"
                      : "Next Task"}

                    <ArrowRight size={18} />
                  </button>
                )}
              </div>

              <p className="mt-5 text-xs leading-5 text-[var(--muted-foreground)]">
                {task.explanation}
              </p>
            </section>

            <div className="mt-8">
              <Link
                href="/modules"
                onClick={leaveTest}
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)]"
              >
                <ArrowLeft size={17} />
                Back to Modules
              </Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

function ScoreCard({
  title,
  score,
  total,
}: {
  title: string;
  score: number;
  total: number;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <p className="text-sm font-semibold text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-2 text-3xl font-black text-[var(--primary)]">
        {score}/{total}
      </p>
    </div>
  );
}