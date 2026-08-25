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
  "ictnet101-module3-final-assessment";

const MODULE_SLUG =
  "network-services-security-troubleshooting";

const REQUIRED_LESSONS = [
  "arp",
  "http",
  "email",
  "remote-access",
  "file-sharing",
  "firewalls",
  "proxies",
  "security",
  "troubleshooting",
];

const baseQuestions: Question[] = [
  {
    id: 1,
    lesson: "ARP",
    question:
      "What is the main purpose of ARP on an IPv4 local network?",
    options: [
      "Map an IP address to a MAC address",
      "Map a MAC address to a domain name",
      "Assign IP addresses automatically",
      "Encrypt Ethernet frames",
    ],
    answer: 0,
    explanation:
      "ARP resolves a known IPv4 address to the MAC address needed for local Ethernet communication.",
  },
  {
    id: 2,
    lesson: "ARP",
    question:
      "Which command can display the local neighbor or ARP information on Linux?",
    options: [
      "ip neigh",
      "nslookup",
      "traceroute",
      "curl",
    ],
    answer: 0,
    explanation:
      "The ip neigh command can display local neighbor information, including IP-to-MAC mappings.",
  },
  {
    id: 3,
    lesson: "ARP",
    question:
      "Why is ARP spoofing dangerous?",
    options: [
      "It can send false IP-to-MAC mappings",
      "It permanently changes the public DNS root servers",
      "It disables IPv6 globally",
      "It increases Wi-Fi bandwidth",
    ],
    answer: 0,
    explanation:
      "ARP spoofing can inject false mappings and potentially redirect local traffic.",
  },
  {
    id: 4,
    lesson: "HTTP & Web Services",
    question:
      "Which HTTP method is normally used to retrieve a resource?",
    options: [
      "GET",
      "POST",
      "DELETE",
      "PATCH",
    ],
    answer: 0,
    explanation:
      "GET is commonly used to request or retrieve a resource.",
  },
  {
    id: 5,
    lesson: "HTTP & Web Services",
    question:
      "Which status-code range represents successful HTTP responses?",
    options: [
      "1xx",
      "2xx",
      "4xx",
      "5xx",
    ],
    answer: 1,
    explanation:
      "HTTP 2xx responses indicate successful processing.",
  },
  {
    id: 6,
    lesson: "HTTP & Web Services",
    question:
      "Which port is normally associated with HTTPS?",
    options: [
      "21",
      "53",
      "80",
      "443",
    ],
    answer: 3,
    explanation:
      "HTTPS normally uses TCP port 443.",
  },
  {
    id: 7,
    lesson: "Email Protocols",
    question:
      "Which protocol is mainly used to send email?",
    options: [
      "SMTP",
      "IMAP",
      "POP3",
      "ARP",
    ],
    answer: 0,
    explanation:
      "SMTP is used to send outgoing email.",
  },
  {
    id: 8,
    lesson: "Email Protocols",
    question:
      "Which protocol is designed to keep email synchronized on the server?",
    options: [
      "FTP",
      "IMAP",
      "SMTP",
      "Telnet",
    ],
    answer: 1,
    explanation:
      "IMAP synchronizes mailboxes across clients while keeping messages on the server.",
  },
  {
    id: 9,
    lesson: "Email Protocols",
    question:
      "Which protocol traditionally downloads mail to a client?",
    options: [
      "POP3",
      "IMAP",
      "SMTP",
      "HTTPS",
    ],
    answer: 0,
    explanation:
      "POP3 is designed primarily for downloading email to a client.",
  },
  {
    id: 10,
    lesson: "Remote Access",
    question:
      "Which protocol provides encrypted remote command-line access?",
    options: [
      "Telnet",
      "SSH",
      "FTP",
      "HTTP",
    ],
    answer: 1,
    explanation:
      "SSH provides encrypted remote shell access and normally uses TCP port 22.",
  },
  {
    id: 11,
    lesson: "Remote Access",
    question:
      "Which protocol is commonly associated with Windows Remote Desktop?",
    options: [
      "RDP",
      "SMTP",
      "ARP",
      "DNS",
    ],
    answer: 0,
    explanation:
      "RDP is Microsoft's Remote Desktop Protocol.",
  },
  {
    id: 12,
    lesson: "Remote Access",
    question:
      "Why is Telnet generally avoided on modern networks?",
    options: [
      "It does not provide the expected encryption",
      "It only works with IPv6",
      "It cannot use TCP",
      "It is a DNS protocol",
    ],
    answer: 0,
    explanation:
      "Telnet is a legacy remote-access protocol that does not provide modern encrypted protection.",
  },
  {
    id: 13,
    lesson: "File Sharing Protocols",
    question:
      "Which protocol transfers files securely over SSH?",
    options: [
      "SFTP",
      "FTP",
      "TFTP",
      "HTTP",
    ],
    answer: 0,
    explanation:
      "SFTP provides file transfer through SSH.",
  },
  {
    id: 14,
    lesson: "File Sharing Protocols",
    question:
      "Which protocol is commonly associated with Windows file and printer sharing?",
    options: [
      "SMB",
      "IMAP",
      "SMTP",
      "ARP",
    ],
    answer: 0,
    explanation:
      "SMB is commonly used for Windows file and printer sharing.",
  },
  {
    id: 15,
    lesson: "Firewalls",
    question:
      "What does a firewall primarily do?",
    options: [
      "Filters network traffic according to rules",
      "Converts domain names into IP addresses",
      "Assigns DHCP leases",
      "Creates Ethernet cables",
    ],
    answer: 0,
    explanation:
      "Firewalls allow or block network traffic based on configured rules.",
  },
  {
    id: 16,
    lesson: "Firewalls",
    question:
      "Which firewall type tracks the state of connections?",
    options: [
      "Packet-filtering firewall",
      "Stateful firewall",
      "Passive firewall",
      "Physical firewall",
    ],
    answer: 1,
    explanation:
      "Stateful firewalls track connection state and can make decisions based on established sessions.",
  },
  {
    id: 17,
    lesson: "Proxy Servers",
    question:
      "Where does a forward proxy normally sit?",
    options: [
      "In front of clients",
      "Inside a DNS root server",
      "Behind a user's keyboard",
      "Inside an Ethernet cable",
    ],
    answer: 0,
    explanation:
      "A forward proxy sits between clients and external services and forwards requests on behalf of clients.",
  },
  {
    id: 18,
    lesson: "Proxy Servers",
    question:
      "What is a common purpose of a reverse proxy?",
    options: [
      "Load balancing and protecting backend servers",
      "Assigning MAC addresses",
      "Replacing DHCP",
      "Creating ARP broadcasts",
    ],
    answer: 0,
    explanation:
      "Reverse proxies sit in front of servers and can provide load balancing, TLS termination, and other functions.",
  },
  {
    id: 19,
    lesson: "Network Security Basics",
    question:
      "What does the CIA triad represent?",
    options: [
      "Confidentiality, Integrity, Availability",
      "Control, Internet, Authentication",
      "Connection, Integrity, Access",
      "Confidentiality, Internet, Authorization",
    ],
    answer: 0,
    explanation:
      "The CIA triad represents the core goals of confidentiality, integrity, and availability.",
  },
  {
    id: 20,
    lesson: "Network Security Basics",
    question:
      "What does least privilege mean?",
    options: [
      "Give users and systems only the access they need",
      "Give everyone administrator access",
      "Disable all network traffic",
      "Use only public IP addresses",
    ],
    answer: 0,
    explanation:
      "Least privilege limits access to only what is necessary for a task.",
  },
  {
    id: 21,
    lesson: "Network Security Basics",
    question:
      "Which approach helps protect data while it travels across a network?",
    options: [
      "TLS/HTTPS encryption",
      "Plain HTTP",
      "Telnet",
      "Unencrypted FTP",
    ],
    answer: 0,
    explanation:
      "TLS-based encryption such as HTTPS protects data in transit.",
  },
  {
    id: 22,
    lesson: "Network Troubleshooting",
    question:
      "What should normally happen first in a structured troubleshooting process?",
    options: [
      "Identify the problem and gather symptoms",
      "Replace every network device",
      "Reset all passwords",
      "Disable the firewall permanently",
    ],
    answer: 0,
    explanation:
      "Troubleshooting begins by identifying the problem and gathering useful symptoms and information.",
  },
  {
    id: 23,
    lesson: "Network Troubleshooting",
    question:
      "Which command checks whether a host is reachable?",
    options: [
      "ping",
      "arp -a",
      "ss",
      "dig",
    ],
    answer: 0,
    explanation:
      "ping provides a basic reachability test using ICMP.",
  },
  {
    id: 24,
    lesson: "Network Troubleshooting",
    question:
      "Which command can help investigate DNS resolution?",
    options: [
      "nslookup",
      "ss",
      "arp -a",
      "ip route",
    ],
    answer: 0,
    explanation:
      "nslookup and dig are commonly used to investigate DNS resolution.",
  },
  {
    id: 25,
    lesson: "Network Troubleshooting",
    question:
      "What is the bottom-up troubleshooting approach?",
    options: [
      "Physical layer → IP configuration → gateway → DNS → application",
      "Application → DNS → gateway → physical",
      "DNS → physical → application → IP",
      "Gateway → application → cable → DNS",
    ],
    answer: 0,
    explanation:
      "A common bottom-up approach checks the physical connection, IP configuration, gateway, DNS, and then the application layer.",
  },
];

const basePracticalTasks: PracticalTask[] = [
  {
    id: "arp-table-module3",
    title: "Task 1 — Inspect the ARP/Neighbor Table",
    description:
      "Display the local IP-to-MAC neighbor information on your lab machine.",
    hint:
      "Try `arp -a` or `ip neigh`.",
    explanation:
      "This checks your ability to inspect local IP-to-MAC mappings.",
  },
  {
    id: "http-test-module3",
    title: "Task 2 — Test a Web Service",
    description:
      "Use a command-line HTTP client to request the headers from example.com.",
    hint:
      "Try `curl -I http://example.com`.",
    explanation:
      "This checks whether you can investigate HTTP communication from the command line.",
  },
  {
    id: "dns-lookup-module3",
    title: "Task 3 — Investigate DNS",
    description:
      "Resolve example.com using a DNS lookup utility.",
    hint:
      "Use `nslookup example.com` or `dig example.com`.",
    explanation:
      "DNS investigation is an important troubleshooting skill.",
  },
  {
    id: "ssh-port-module3",
    title: "Task 4 — Inspect the SSH Service Port",
    description:
      "Inspect listening sockets and identify whether TCP port 22 is available.",
    hint:
      "Use `ss -tuln`.",
    explanation:
      "SSH normally uses TCP port 22.",
  },
  {
    id: "connections-module3",
    title: "Task 5 — Inspect Active Connections",
    description:
      "Display active network connections and listening sockets.",
    hint:
      "Use `ss -tuln` or `netstat -tuln`.",
    explanation:
      "This checks your ability to investigate active network services.",
  },
  {
    id: "ip-config-module3",
    title: "Task 6 — Verify Local Network Configuration",
    description:
      "Display the machine's interfaces, IP addresses, and routing information.",
    hint:
      "Use `ip a` and `ip route`.",
    explanation:
      "Local addressing and route information are important starting points during troubleshooting.",
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

export default function Module3FinalTest() {
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
    useState<number | null>(
      null
    );

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
              "Complete all nine Module 3 lessons before taking the final assessment."
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
          "Module 3 assessment access error:",
          error
        );

        if (active) {
          setAccessError(
            "We could not verify your Module 3 lesson progress."
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
      setCheckingTask(
        false
      );
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
              "Module 3 Final Assessment",
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
        "Module 3 assessment result save error:",
        error
      );

      setResultSaveError(
        "Your result could not be saved to your account. Please try again."
      );

      return false;
    } finally {
      setSavingResult(
        false
      );
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

    const saved =
      await saveAssessmentResult(
        completedTasks.length
      );

    if (saved) {
      setSection(
        "results"
      );
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

    setCurrentQuestion(
      0
    );

    setSelectedAnswer(
      null
    );

    setScore(0);
    setTaskIndex(0);
    setCompletedTasks(
      []
    );
    setCheckingTask(
      false
    );
    setTaskMessage("");
    setSavingResult(
      false
    );
    setResultSaved(
      false
    );
    setResultSaveError(
      ""
    );
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
              Verifying your Module 3 lesson progress.
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
              Module 3 Assessment
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Assessment Locked
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)]">
              {accessError ||
                "Complete all nine Module 3 lessons before taking the final assessment."}
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={`/modules/${MODULE_SLUG}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-bold text-[var(--primary-foreground)] transition hover:opacity-90"
              >
                Return to Module
                <ArrowRight
                  size={17}
                />
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
              Module 3 Assessment Complete
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
                total={
                  questions.length
                }
              />

              <ScoreCard
                title="Practical Assessment"
                score={
                  practicalScore
                }
                total={
                  practicalTasks.length
                }
              />
            </div>

            <div className="mx-auto mt-8 max-w-2xl rounded-2xl bg-[var(--muted)] p-5">
              <p className="font-bold">
                {percentage >= 70
                  ? "Module 3 assessment passed."
                  : "Keep reviewing Module 3 before retaking the assessment."}
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
            Module 3 Final Assessment
          </div>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Network Services, Security & Troubleshooting
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Complete the knowledge test and practical networking assessment.
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
              {score}/
              {questions.length}{" "}
              correct so far
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

        {section ===
          "knowledge" && (
          <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold">
                Question{" "}
                {currentQuestion + 1}{" "}
                of{" "}
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
                (
                  option,
                  index
                ) => {
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
                    questions.length -
                      1
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

        {section ===
          "practical" && (
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
                Complete each task using the real Linux networking terminal and apply the concepts from Module 3.
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
                    Task{" "}
                    {taskIndex + 1}{" "}
                    of{" "}
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