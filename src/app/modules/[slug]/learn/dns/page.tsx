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
  Database,
  Globe,
  Network,
  RefreshCcw,
  Search,
  Server,
  ShieldCheck,
  XCircle,
} from "lucide-react";

type DnsRecord = {
  type: string;
  name: string;
  purpose: string;
  example: string;
};

type ResolutionStep = {
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

const dnsRecords: DnsRecord[] = [
  {
    type: "A",
    name: "IPv4 Address",
    purpose:
      "Maps a hostname to an IPv4 address.",
    example:
      "example.com → 93.184.216.34",
  },
  {
    type: "AAAA",
    name: "IPv6 Address",
    purpose:
      "Maps a hostname to an IPv6 address.",
    example:
      "example.com → 2001:db8::1",
  },
  {
    type: "CNAME",
    name: "Canonical Name",
    purpose:
      "Creates an alias that points to another hostname.",
    example:
      "www.example.com → example.com",
  },
  {
    type: "MX",
    name: "Mail Exchange",
    purpose:
      "Identifies mail servers responsible for a domain.",
    example:
      "example.com → mail.example.com",
  },
  {
    type: "TXT",
    name: "Text",
    purpose:
      "Stores text information associated with a domain.",
    example:
      "Verification or policy information",
  },
  {
    type: "NS",
    name: "Name Server",
    purpose:
      "Identifies authoritative name servers for a domain.",
    example:
      "example.com → ns1.example.com",
  },
];

const resolutionSteps: ResolutionStep[] = [
  {
    number: 1,
    name: "Client Request",
    description:
      "The client needs the IP address associated with a hostname.",
    detail:
      "For example, a browser may need to find the address for example.com before connecting to the web server.",
  },
  {
    number: 2,
    name: "Recursive Resolver",
    description:
      "The client's DNS request is handled by a recursive resolver.",
    detail:
      "The recursive resolver searches for the requested DNS information and may use cached data.",
  },
  {
    number: 3,
    name: "DNS Hierarchy",
    description:
      "The resolver can work through the DNS hierarchy.",
    detail:
      "The hierarchy includes root servers, top-level domain servers, and authoritative name servers.",
  },
  {
    number: 4,
    name: "Authoritative Answer",
    description:
      "The authoritative server provides the answer for the domain.",
    detail:
      "The resolver receives the requested record, such as an A or AAAA record.",
  },
  {
    number: 5,
    name: "Cached Response",
    description:
      "The resolver can cache the result and return it to the client.",
    detail:
      "Caching helps reduce repeated DNS queries and can improve response time.",
  },
];

const hierarchyCards = [
  {
    title: "Root Servers",
    description:
      "The top level of the DNS hierarchy. They help direct queries toward the appropriate top-level domain servers.",
    icon: Globe,
  },
  {
    title: "TLD Servers",
    description:
      "Top-level domain servers handle domains such as .com, .org, and country-code top-level domains.",
    icon: Server,
  },
  {
    title: "Authoritative Servers",
    description:
      "These servers contain the authoritative DNS records for domains.",
    icon: Database,
  },
];

const questions: Question[] = [
  {
    question:
      "What is the main purpose of DNS?",
    options: [
      "To translate hostnames into IP addresses and provide other DNS information",
      "To automatically assign MAC addresses",
      "To replace routing tables",
      "To encrypt every network packet",
    ],
    answer: 0,
    explanation:
      "DNS provides name resolution and other DNS information, such as records for mail and name servers.",
  },
  {
    question:
      "What does a recursive DNS resolver do?",
    options: [
      "It searches for DNS information on behalf of the client",
      "It only stores MAC addresses",
      "It assigns IP addresses to clients",
      "It forwards Ethernet frames",
    ],
    answer: 0,
    explanation:
      "A recursive resolver performs DNS lookups on behalf of the client and may use cached results.",
  },
  {
    question:
      "Which DNS server is at the top of the DNS hierarchy?",
    options: [
      "The client computer",
      "The root DNS servers",
      "The DHCP server",
      "The web server",
    ],
    answer: 1,
    explanation:
      "Root servers are at the top of the DNS hierarchy.",
  },
  {
    question:
      "Which DNS record maps a hostname to an IPv4 address?",
    options: [
      "AAAA",
      "MX",
      "A",
      "NS",
    ],
    answer: 2,
    explanation:
      "An A record maps a hostname to an IPv4 address.",
  },
  {
    question:
      "Which DNS record maps a hostname to an IPv6 address?",
    options: [
      "A",
      "AAAA",
      "CNAME",
      "TXT",
    ],
    answer: 1,
    explanation:
      "An AAAA record maps a hostname to an IPv6 address.",
  },
  {
    question:
      "Which record is used for mail server information?",
    options: [
      "MX",
      "A",
      "NS",
      "CNAME",
    ],
    answer: 0,
    explanation:
      "MX records identify mail servers for a domain.",
  },
  {
    question:
      "What does a CNAME record provide?",
    options: [
      "An alias pointing to another hostname",
      "A mail server",
      "An IPv4 address only",
      "A DHCP lease",
    ],
    answer: 0,
    explanation:
      "A CNAME record creates an alias that points to another hostname.",
  },
  {
    question:
      "What is DNS caching used for?",
    options: [
      "To reduce repeated DNS lookups and improve response time",
      "To replace IP addressing",
      "To create wireless channels",
      "To assign DHCP leases",
    ],
    answer: 0,
    explanation:
      "DNS caching stores previous results temporarily so repeated queries can be answered more efficiently.",
  },
  {
    question:
      "Which transport protocol is commonly used by normal DNS queries?",
    options: [
      "UDP",
      "FTP",
      "SSH",
      "SMTP",
    ],
    answer: 0,
    explanation:
      "Normal DNS queries commonly use UDP port 53. DNS can also use TCP when required.",
  },
  {
    question:
      "Which DNS record identifies authoritative name servers?",
    options: [
      "A",
      "CNAME",
      "NS",
      "TXT",
    ],
    answer: 2,
    explanation:
      "NS records identify the authoritative name servers for a domain.",
  },
];

export default function DNS() {
  const [selectedStep, setSelectedStep] =
    useState(0);

  const [selectedRecord, setSelectedRecord] =
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
    resolutionSteps[selectedStep];

  const activeRecord =
    dnsRecords[selectedRecord];

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
            <Globe size={19} />
            Module 2
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 4 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            DNS
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how DNS resolves hostnames, how recursive and
            authoritative servers work, how caching improves resolution,
            and how common DNS record types are used.
          </p>
        </header>

        {/* Progress */}
        <section className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Lesson 4 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Module 2 — 100%
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

        {/* What is DNS */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Globe size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is DNS?
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            DNS stands for Domain Name System. It provides a way to use
            human-readable hostnames while networks still communicate using
            IP addresses.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            When a device needs to connect to a hostname, DNS can provide
            information about that hostname, including the IP address
            associated with it.
          </p>

          <div className="mt-8 rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Simple example
            </p>

            <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <code className="rounded-xl bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--primary)]">
                example.com
              </code>

              <ArrowRight
                size={20}
                className="text-[var(--primary)]"
              />

              <code className="rounded-xl bg-[var(--background)] px-4 py-3 text-sm font-bold text-[var(--primary)]">
                93.184.216.34
              </code>
            </div>
          </div>
        </section>

        {/* DNS Resolution */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Search
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                DNS Resolution Process
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Select each step to see what happens during a typical DNS
            resolution process.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

            {/* Steps */}
            <div className="space-y-2">
              {resolutionSteps.map(
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

                      <div className="min-w-0">
                        <p className="font-bold">
                          {step.name}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          Resolution step {step.number}
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
                    Resolution Step
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
                  Details
                </p>

                <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
                  {activeStep.detail}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* DNS Hierarchy */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Server
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              DNS Hierarchy
            </h2>
          </div>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            DNS is organized as a hierarchy. A resolver can work through
            different levels to find the server responsible for the requested
            information.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {hierarchyCards.map(
              (item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                      <Icon size={21} />
                    </div>

                    <h3 className="mt-4 font-bold">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                      {item.description}
                    </p>
                  </div>
                );
              }
            )}
          </div>
        </section>

        {/* Recursive Resolver */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoSection
            icon={<Search size={23} />}
            title="Recursive Resolver"
            description="A recursive resolver receives a client's DNS request and searches for the information needed to provide an answer."
            points={[
              "Receives DNS queries from clients",
              "Can work through the DNS hierarchy",
              "Can use cached responses",
            ]}
          />

          <InfoSection
            icon={<Database size={23} />}
            title="DNS Caching"
            description="Resolvers can temporarily store DNS results so that repeated requests can be answered without performing the complete lookup again."
            points={[
              "Reduces repeated lookups",
              "Can improve response time",
              "Cached information eventually expires",
            ]}
          />
        </section>

        {/* DNS Record Explorer */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Database
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Common DNS Records
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Select a DNS record to learn what it stores and why it is used.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">

            {/* Record List */}
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {dnsRecords.map(
                (record, index) => {
                  const active =
                    index ===
                    selectedRecord;

                  return (
                    <button
                      key={record.type}
                      type="button"
                      onClick={() =>
                        setSelectedRecord(
                          index
                        )
                      }
                      className={`rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-[var(--primary)] bg-[var(--muted)]"
                          : "border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]"
                      }`}
                    >
                      <p className="text-xl font-black text-[var(--primary)]">
                        {record.type}
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {record.name}
                      </p>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Record */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-lg font-black text-[var(--primary)]">
                  {activeRecord.type}
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    DNS Record
                  </p>

                  <h3 className="text-3xl font-black">
                    {activeRecord.name}
                  </h3>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Purpose
                </p>

                <p className="mt-2 text-base font-semibold leading-7">
                  {activeRecord.purpose}
                </p>
              </div>

              <div className="mt-6 rounded-2xl bg-[var(--muted)] p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
                  Example
                </p>

                <code className="mt-2 block text-sm font-bold text-[var(--primary)]">
                  {activeRecord.example}
                </code>
              </div>
            </div>
          </div>
        </section>

        {/* DNS Port */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Network
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              DNS Ports
            </h2>
          </div>

          <p className="mt-4 text-base leading-8">
            DNS commonly uses UDP port 53 for normal queries. DNS can also
            use TCP port 53 when required.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <PortCard
              port="UDP 53"
              title="Normal DNS Queries"
              description="Commonly used for standard DNS query traffic."
            />

            <PortCard
              port="TCP 53"
              title="DNS over TCP"
              description="Can be used when TCP is required for DNS communication."
            />
          </div>
        </section>

        {/* DNS Tools */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Search
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              DNS Investigation Tools
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Networking tools can be used to investigate DNS resolution and
            inspect the records returned for a hostname.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <ToolCard
              command="nslookup example.com"
              description="Performs a DNS lookup and displays information about the queried hostname."
            />

            <ToolCard
              command="dig example.com"
              description="Provides detailed DNS query and response information."
            />
          </div>
        </section>

        {/* Practical Example */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Globe
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Practical Example
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            When you type a website address into a browser, the browser needs
            to know where that hostname is located. DNS helps translate the
            hostname into the IP information needed to establish the
            connection.
          </p>

          <div className="mt-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-center">
            <ProcessBox
              title="Hostname"
              value="example.com"
            />

            <ArrowRight
              size={20}
              className="mx-auto rotate-90 text-[var(--primary)] md:mx-0 md:rotate-0"
            />

            <ProcessBox
              title="DNS Lookup"
              value="A / AAAA"
            />

            <ArrowRight
              size={20}
              className="mx-auto rotate-90 text-[var(--primary)] md:mx-0 md:rotate-0"
            />

            <ProcessBox
              title="IP Address"
              value="Destination"
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
              <strong>1.</strong> DNS translates hostnames into IP information
              and provides other records for domains.
            </li>

            <li>
              <strong>2.</strong> A recursive resolver performs DNS lookups on
              behalf of clients.
            </li>

            <li>
              <strong>3.</strong> DNS uses a hierarchy that includes root,
              TLD, and authoritative servers.
            </li>

            <li>
              <strong>4.</strong> DNS caching can reduce repeated lookups and
              improve response time.
            </li>

            <li>
              <strong>5.</strong> A records contain IPv4 addresses.
            </li>

            <li>
              <strong>6.</strong> AAAA records contain IPv6 addresses.
            </li>

            <li>
              <strong>7.</strong> CNAME records provide aliases.
            </li>

            <li>
              <strong>8.</strong> MX records identify mail servers.
            </li>

            <li>
              <strong>9.</strong> NS records identify authoritative name
              servers.
            </li>

            <li>
              <strong>10.</strong> DNS commonly uses port 53 over UDP and can
              also use TCP.
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
            lessonSlug="dns"
          />
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/dhcp"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={17} />
            Previous Lesson
          </Link>

          <Link
            href="/modules/routing-wifi-dhcp-dns"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
          >
            Back to Module
            <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </main>
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

function ToolCard({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <code className="block rounded-xl bg-[var(--muted)] p-4 text-sm font-bold text-[var(--primary)]">
        {command}
      </code>

      <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>
    </div>
  );
}

function ProcessBox({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
        {title}
      </p>

      <p className="mt-2 font-black text-[var(--primary)]">
        {value}
      </p>
    </div>
  );
}
