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
import { getLabServerUrl } from "@/lib/lab-server";

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
  "ictnet101-module2-final-assessment";

const MODULE_SLUG =
  "routing-wifi-dhcp-dns";

const REQUIRED_LESSONS = [
  "routing",
  "wifi",
  "dhcp",
  "dns",
];

const baseQuestions: Question[] = [
  {
    id: 1,
    lesson: "Routers & Routing",
    question:
      "What is the primary job of a router?",
    options: [
      "Connect devices on the same LAN using MAC addresses",
      "Forward packets between different networks using IP addresses",
      "Assign domain names to websites",
      "Encrypt wireless traffic",
    ],
    answer: 1,
    explanation:
      "A router forwards packets between different networks using destination IP addresses and routing information.",
  },
  {
    id: 2,
    lesson: "Routers & Routing",
    question:
      "What is a routing table used for?",
    options: [
      "Storing Wi-Fi passwords",
      "Determining where packets should be forwarded",
      "Assigning MAC addresses",
      "Resolving domain names",
    ],
    answer: 1,
    explanation:
      "A routing table contains information that helps a router determine where packets should be sent.",
  },
  {
    id: 3,
    lesson: "Routers & Routing",
    question:
      "Which type of route is manually configured by an administrator?",
    options: [
      "Dynamic route",
      "Static route",
      "DNS route",
      "DHCP route",
    ],
    answer: 1,
    explanation:
      "A static route is manually configured by an administrator.",
  },
  {
    id: 4,
    lesson: "Routers & Routing",
    question:
      "Which of these is a dynamic routing protocol?",
    options: [
      "OSPF",
      "HTTP",
      "DHCP",
      "ARP",
    ],
    answer: 0,
    explanation:
      "OSPF is a dynamic routing protocol.",
  },
  {
    id: 5,
    lesson: "Routers & Routing",
    question:
      "What is the purpose of NAT?",
    options: [
      "Translate private addresses when accessing external networks",
      "Assign Wi-Fi channels",
      "Resolve hostnames",
      "Create MAC addresses",
    ],
    answer: 0,
    explanation:
      "NAT translates private IP addresses to public addressing when devices communicate with external networks.",
  },
  {
    id: 6,
    lesson: "Routers & Routing",
    question:
      "What does 0.0.0.0/0 normally represent?",
    options: [
      "A loopback route",
      "A default route",
      "A multicast route",
      "A DNS route",
    ],
    answer: 1,
    explanation:
      "0.0.0.0/0 is the default route used when no more-specific route matches.",
  },
  {
    id: 7,
    lesson: "Routers & Routing",
    question:
      "Which command can display the routing table on Linux?",
    options: [
      "ip route",
      "nslookup",
      "arp -a",
      "hostname",
    ],
    answer: 0,
    explanation:
      "The Linux command `ip route` can display the current routing table.",
  },
  {
    id: 8,
    lesson: "Wi-Fi",
    question:
      "What does SSID identify?",
    options: [
      "The wireless network name",
      "The router's public IP address",
      "The DHCP server port",
      "The cable type",
    ],
    answer: 0,
    explanation:
      "SSID is the name used to identify a wireless network.",
  },
  {
    id: 9,
    lesson: "Wi-Fi",
    question:
      "Which Wi-Fi band generally has longer range and better wall penetration?",
    options: [
      "2.4 GHz",
      "5 GHz",
      "6 GHz",
      "60 GHz",
    ],
    answer: 0,
    explanation:
      "2.4 GHz generally offers longer range and better wall penetration.",
  },
  {
    id: 10,
    lesson: "Wi-Fi",
    question:
      "Which Wi-Fi band generally provides higher speeds with shorter range?",
    options: [
      "2.4 GHz",
      "5 GHz",
      "800 MHz",
      "900 MHz",
    ],
    answer: 1,
    explanation:
      "5 GHz generally provides higher speeds but has shorter range than 2.4 GHz.",
  },
  {
    id: 11,
    lesson: "Wi-Fi",
    question:
      "Which channels are commonly recommended for non-overlapping 2.4 GHz networks?",
    options: [
      "1, 6, and 11",
      "2, 5, and 8",
      "3, 7, and 13",
      "4, 8, and 12",
    ],
    answer: 0,
    explanation:
      "Channels 1, 6, and 11 are commonly used because they avoid overlap with one another in the standard 2.4 GHz arrangement.",
  },
  {
    id: 12,
    lesson: "Wi-Fi",
    question:
      "Which wireless security standard is the strongest option listed here?",
    options: [
      "WEP",
      "WPA",
      "WPA2",
      "WPA3",
    ],
    answer: 3,
    explanation:
      "WPA3 is the strongest option listed and is the recommended modern wireless security standard.",
  },
  {
    id: 13,
    lesson: "Wi-Fi",
    question:
      "What device normally provides wireless access to a network?",
    options: [
      "Access Point",
      "DNS server",
      "DHCP relay only",
      "Modem only",
    ],
    answer: 0,
    explanation:
      "An access point provides Wi-Fi connectivity to devices.",
  },
  {
    id: 14,
    lesson: "DHCP",
    question:
      "What is the main purpose of DHCP?",
    options: [
      "Automatically provide IP configuration to clients",
      "Translate domain names",
      "Forward packets between networks",
      "Encrypt web traffic",
    ],
    answer: 0,
    explanation:
      "DHCP automatically supplies clients with IP addresses and other network configuration information.",
  },
  {
    id: 15,
    lesson: "DHCP",
    question:
      "What does the D in DHCP DORA stand for?",
    options: [
      "Domain",
      "Discover",
      "Deliver",
      "Direct",
    ],
    answer: 1,
    explanation:
      "DORA begins with Discover, when the client looks for a DHCP server.",
  },
  {
    id: 16,
    lesson: "DHCP",
    question:
      "Which sequence correctly describes DHCP DORA?",
    options: [
      "Discover → Offer → Request → Acknowledge",
      "Offer → Discover → Request → Acknowledge",
      "Discover → Request → Offer → Acknowledge",
      "Request → Offer → Discover → Acknowledge",
    ],
    answer: 0,
    explanation:
      "The four DHCP steps are Discover, Offer, Request, and Acknowledge.",
  },
  {
    id: 17,
    lesson: "DHCP",
    question:
      "Which UDP ports are used by DHCP?",
    options: [
      "20 and 21",
      "22 and 23",
      "53 and 54",
      "67 and 68",
    ],
    answer: 3,
    explanation:
      "DHCP uses UDP port 67 on the server side and UDP port 68 on the client side.",
  },
  {
    id: 18,
    lesson: "DHCP",
    question:
      "What is a DHCP reservation?",
    options: [
      "A permanent DNS record",
      "A fixed IP assignment associated with a particular device",
      "A wireless channel",
      "A routing protocol",
    ],
    answer: 1,
    explanation:
      "A DHCP reservation allows a specific device to consistently receive a chosen IP address.",
  },
  {
    id: 19,
    lesson: "DNS",
    question:
      "What is the main purpose of DNS?",
    options: [
      "Translate domain names into IP addresses",
      "Assign IP addresses automatically",
      "Connect wireless clients",
      "Forward Ethernet frames",
    ],
    answer: 0,
    explanation:
      "DNS translates human-readable domain names into IP addresses.",
  },
  {
    id: 20,
    lesson: "DNS",
    question:
      "Which DNS record maps a hostname to an IPv4 address?",
    options: [
      "AAAA",
      "MX",
      "A",
      "CNAME",
    ],
    answer: 2,
    explanation:
      "An A record maps a hostname to an IPv4 address.",
  },
  {
    id: 21,
    lesson: "DNS",
    question:
      "Which DNS record maps a hostname to an IPv6 address?",
    options: [
      "A",
      "AAAA",
      "MX",
      "TXT",
    ],
    answer: 1,
    explanation:
      "An AAAA record maps a hostname to an IPv6 address.",
  },
  {
    id: 22,
    lesson: "DNS",
    question:
      "Which DNS record identifies mail servers?",
    options: [
      "MX",
      "A",
      "AAAA",
      "CNAME",
    ],
    answer: 0,
    explanation:
      "An MX record identifies the mail servers responsible for a domain.",
  },
  {
    id: 23,
    lesson: "DNS",
    question:
      "Which port is normally associated with DNS?",
    options: [
      "22",
      "53",
      "67",
      "443",
    ],
    answer: 1,
    explanation:
      "DNS commonly uses port 53.",
  },
  {
    id: 24,
    lesson: "DNS",
    question:
      "Which command can be used to perform a DNS lookup?",
    options: [
      "nslookup",
      "ip route",
      "ss",
      "arp -a",
    ],
    answer: 0,
    explanation:
      "nslookup is a common command-line utility for querying DNS.",
  },
];

const basePracticalTasks: PracticalTask[] = [
  {
    id: "trace-route",
    title: "Task 1 — Inspect a Network Path",
    description:
      "Trace the network path toward example.com from your lab environment.",
    hint:
      "Use traceroute example.com.",
    explanation:
      "Tracing a route helps you understand the path packets take toward a destination and relates directly to routing.",
  },
  {
    id: "ip-config",
    title: "Task 2 — Inspect Your Network Configuration",
    description:
      "Display the current network interfaces and IP configuration of the lab machine.",
    hint:
      "Use ip a or ip addr.",
    explanation:
      "The machine's IP configuration helps identify the addressing information supplied to the host, commonly through DHCP.",
  },
  {
    id: "dns-lookup",
    title: "Task 3 — Test DNS Resolution",
    description:
      "Resolve example.com and inspect the resulting DNS information.",
    hint:
      "Use nslookup example.com or dig example.com.",
    explanation:
      "DNS lookup tools let you investigate how a hostname is translated into address information.",
  },
  {
    id: "connections",
    title: "Task 4 — Inspect Network Services",
    description:
      "Display active network connections and listening sockets.",
    hint:
      "Use ss or netstat.",
    explanation:
      "Inspecting active connections helps you understand which network services are currently communicating or listening.",
  },
  {
    id: "ping-gateway",
    title: "Task 5 — Test Basic Reachability",
    description:
      "Use ping to test whether the local networking stack can reach a destination.",
    hint:
      "Use ping 127.0.0.1.",
    explanation:
      "Ping provides a basic connectivity test and is useful when troubleshooting routing and network communication.",
  },
  {
    id: "arp-table",
    title: "Task 6 — Inspect Local Neighbor Information",
    description:
      "Display the local ARP table or neighbor information.",
    hint:
      "Use arp -a.",
    explanation:
      "The ARP table connects local IPv4 addresses to MAC addresses and helps explain local network communication.",
  },
];

function createNewAttempt(): AssessmentAttempt {
  const shuffledQuestions =
    shuffleArray(baseQuestions).map(
      (question) => {
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
      }
    );

  return {
    questions: shuffledQuestions,
    practicalTasks:
      shuffleArray(basePracticalTasks),
  };
}

function loadAssessmentAttempt(): AssessmentAttempt {
  if (
    typeof window ===
    "undefined"
  ) {
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

  const newAttempt =
    createNewAttempt();

  window.sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(newAttempt)
  );

  return newAttempt;
}

export default function Module2FinalTest() {
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
        } =
          await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          if (active) {
            window.location.href =
              "/login";
          }
          return;
        }

        const {
          data: progressRows,
          error: progressError,
        } =
          await supabase
            .from("lesson_progress")
            .select(
              "lesson_slug, completed"
            )
            .eq(
              "user_id",
              user.id
            )
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

        const allComplete =
          REQUIRED_LESSONS.every(
            (lessonSlug) =>
              completed.has(
                lessonSlug
              )
          );

        if (!allComplete) {
          if (active) {
            setLessonsCompleted(
              false
            );

            setAccessError(
              "Complete all four Module 2 lessons before taking the final assessment."
            );

            setAccessChecked(
              true
            );
          }

          return;
        }

        if (active) {
          setLessonsCompleted(
            true
          );

          setAccessChecked(
            true
          );
        }
      } catch (error) {
        console.error(
          "Module 2 assessment access error:",
          error
        );

        if (active) {
          setAccessError(
            "We could not verify your Module 2 lesson progress."
          );

          setAccessChecked(
            true
          );
        }
      }
    }

    void checkAssessmentAccess();

    return () => {
      active = false;
    };
  }, []);

  const questions =
    attempt.questions;

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

  function chooseAnswer(
    index: number
  ) {
    if (
      selectedAnswer !== null
    ) {
      return;
    }

    setSelectedAnswer(index);

    if (
      index ===
      question.answer
    ) {
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

      setSelectedAnswer(
        null
      );

      return;
    }

    setSection("practical");
  }

  async function checkTask() {
    setCheckingTask(true);
    setTaskMessage("");

    try {
      const supabase =
        createClient();

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (
        !session?.access_token
      ) {
        throw new Error(
          "You must be signed in."
        );
      }

      const labServerUrl =
        getLabServerUrl();

      const response =
        await fetch(
          `${labServerUrl}/check-task?task=${encodeURIComponent(
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
          `Assessment request failed: ${response.status}`
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
          previous.includes(
            task.id
          )
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
      const supabase =
        createClient();

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
              "Module 2 Final Assessment",

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
        "Module 2 assessment result save error:",
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
        JSON.stringify(
          newAttempt
        )
      );
    }

    setAttempt(
      newAttempt
    );

    setSection(
      "knowledge"
    );

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
              Verifying your Module 2 lesson progress.
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
              Module 2 Assessment
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Assessment Locked
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              {accessError ||
                "Complete all four Module 2 lessons before taking the final assessment."}
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
              Module 2 Assessment Complete
            </p>

            <h1 className="mt-2 text-4xl font-black">
              Final Results
            </h1>

            <p className="mt-8 text-6xl font-black text-[var(--primary)]">
              {percentage}%
            </p>

            <p className="mt-3 text-lg text-[var(--muted-foreground)]">
              {totalScore} /{" "}
              {totalPossible} points
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
                total={
                  practicalTasks.length
                }
              />
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-[var(--muted)] p-5">
              <p className="font-bold">
                {percentage >= 70
                  ? "Module 2 assessment passed."
                  : "Keep reviewing Module 2 before retaking the assessment."}
              </p>

              <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                Your practical section was completed using the real Linux networking terminal.
              </p>
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={
                  restartTest
                }
                disabled={
                  savingResult
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw size={17} />
                New Attempt
              </button>

              <Link
                href={`/modules/${MODULE_SLUG}`}
                onClick={
                  leaveTest
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Back to Module
                <ArrowRight
                  size={17}
                />
              </Link>

              <Link
                href="/dashboard"
                onClick={
                  leaveTest
                }
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
            Module 2 Final Assessment
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Routers, Wi-Fi, DHCP & DNS
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
              {practicalTasks.length}{" "}
              tasks complete
            </p>
          </div>
        </div>

        {section === "knowledge" && (
          <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
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
                      key={`${question.id}-${option}`}
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
                      ? "Start Practical Assessment"
                      : "Next Question"}

                    <ArrowRight
                      size={18}
                    />
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
                Complete each task using the real Linux networking terminal.
                Read the instruction carefully and use what you learned in
                Module 2.
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
                  onClick={
                    checkTask
                  }
                  disabled={
                    checkingTask
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <CheckCircle2
                    size={18}
                  />

                  {checkingTask
                    ? "Checking..."
                    : "Check Task"}
                </button>

                {completedTasks.includes(
                  task.id
                ) && (
                  <button
                    type="button"
                    onClick={
                      nextTask
                    }
                    disabled={
                      savingResult
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-6 py-3 font-bold transition hover:border-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {taskIndex ===
                    practicalTasks.length -
                      1
                      ? savingResult
                        ? "Saving Result..."
                        : "View Final Results"
                      : "Next Task"}

                    <ArrowRight
                      size={18}
                    />
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
                onClick={
                  leaveTest
                }
                className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)]"
              >
                <ArrowLeft
                  size={17}
                />
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