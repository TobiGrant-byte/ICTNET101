"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import LessonNavigation from "@/components/lessons/LessonNavigation";
import { useState } from "react";

import {
  ArrowRight,
  CheckCircle2,
  CircleHelp,
  EthernetPort,
  Globe,
  Network,
  RotateCcw,
  Terminal,
  Wifi,
  XCircle,
} from "lucide-react";

type CommandResult = {
  output: string;
  type: "success" | "error" | "info";
};

type Question = {
  question: string;
  answers: string[];
  hint: string;
  explanation: string;
};

const commandOutputs: Record<string, CommandResult> = {
  ipconfig: {
    type: "success",
    output:
      "Windows IP Configuration\n\nEthernet adapter Ethernet:\n\n   IPv4 Address . . . . . . : 192.168.1.10\n   Subnet Mask . . . . . . : 255.255.255.0\n   Default Gateway . . . . : 192.168.1.1",
  },

  "ipconfig /all": {
    type: "success",
    output:
      "Windows IP Configuration\n\nEthernet adapter Ethernet:\n\n   IPv4 Address . . . . . . : 192.168.1.10\n   Subnet Mask . . . . . . : 255.255.255.0\n   Default Gateway . . . . : 192.168.1.1\n   DNS Servers . . . . . . : 8.8.8.8",
  },

  "ip a": {
    type: "success",
    output:
      "2: eth0: <UP,BROADCAST,RUNNING>\n    inet 192.168.1.10/24\n    inet6 2001:db8::1/64",
  },

  ifconfig: {
    type: "success",
    output:
      "eth0: flags=4163<UP,BROADCAST,RUNNING>\n    inet 192.168.1.10\n    netmask 255.255.255.0\n    broadcast 192.168.1.255",
  },

  "ping 192.168.1.1": {
    type: "success",
    output:
      "PING 192.168.1.1\n\n64 bytes from 192.168.1.1: icmp_seq=1 ttl=64 time=2.1 ms\n64 bytes from 192.168.1.1: icmp_seq=2 ttl=64 time=1.8 ms\n64 bytes from 192.168.1.1: icmp_seq=3 ttl=64 time=2.0 ms\n\n--- 192.168.1.1 ping statistics ---\n3 packets transmitted, 3 received, 0% packet loss",
  },

  "tracert example.com": {
    type: "success",
    output:
      "Tracing route to example.com\n\n1    2 ms    2 ms    1 ms    192.168.1.1\n2   10 ms   11 ms   10 ms    ISP Gateway\n3   18 ms   17 ms   19 ms    Destination",
  },

  "traceroute example.com": {
    type: "success",
    output:
      "traceroute to example.com\n\n1  192.168.1.1  2.1 ms\n2  ISP Gateway  10.4 ms\n3  Destination  18.2 ms",
  },

  "nslookup example.com": {
    type: "success",
    output:
      "Server:  8.8.8.8\nAddress: 8.8.8.8\n\nName:    example.com\nAddress: 93.184.216.34",
  },

  "dig example.com": {
    type: "success",
    output:
      ";; QUESTION SECTION:\n;example.com.    IN    A\n\n;; ANSWER SECTION:\nexample.com.    300    IN    A    93.184.216.34",
  },

  "arp -a": {
    type: "success",
    output:
      "Interface: 192.168.1.10\n\nInternet Address      Physical Address      Type\n192.168.1.1           aa-bb-cc-dd-ee-ff   dynamic\n192.168.1.20          11-22-33-44-55-66   dynamic",
  },

  netstat: {
    type: "success",
    output:
      "Active Connections\n\nProto  Local Address        Foreign Address       State\nTCP    192.168.1.10:443   93.184.216.34:443    ESTABLISHED\nTCP    192.168.1.10:22    192.168.1.20:52144   ESTABLISHED",
  },

  ss: {
    type: "success",
    output:
      "Netid State      Local Address:Port\n\ntcp   ESTAB      192.168.1.10:443\ntcp   LISTEN     0.0.0.0:22",
  },
};

const quickCommands = [
  "ipconfig",
  "ipconfig /all",
  "ip a",
  "ifconfig",
  "ping 192.168.1.1",
  "tracert example.com",
  "nslookup example.com",
  "arp -a",
  "netstat",
];

const questions: Question[] = [
  {
    question:
      "A computer wants to check whether its default gateway at 192.168.1.1 is reachable. Which command should you use?",
    answers: ["ping 192.168.1.1"],
    hint: "Use the command that tests basic reachability.",
    explanation:
      "The lesson explains that ping tests basic reachability between a source and destination using ICMP echo request and reply.",
  },
  {
    question:
      "You are using a Windows computer and need to view its IPv4 address, subnet mask and default gateway. Which command should you use?",
    answers: ["ipconfig", "ipconfig /all"],
    hint:
      "Think about the Windows command used to display local IP configuration.",
    explanation:
      "ipconfig displays local IP configuration information such as the IPv4 address, subnet mask and default gateway.",
  },
  {
    question:
      "You are using Linux and want to view network interfaces and their IP addresses. Which command could you use?",
    answers: ["ip a", "ifconfig"],
    hint:
      "The lesson gives two Linux commands that can display interface information.",
    explanation:
      "ip a displays network interfaces and their addresses. ifconfig can also display interface configuration.",
  },
  {
    question:
      "You want to discover the hop-by-hop path packets take toward example.com from a Windows computer. Which command should you use?",
    answers: ["tracert example.com"],
    hint: "Windows uses a command beginning with 'trac'.",
    explanation:
      "tracert shows the hop-by-hop path toward a destination on Windows.",
  },
  {
    question: "Which type of IP address is 192.168.1.10?",
    answers: ["private", "private ip", "private ipv4"],
    hint:
      "Look at the private IPv4 ranges taught in this lesson.",
    explanation:
      "192.168.1.10 falls within the private IPv4 range 192.168.0.0/16.",
  },
  {
    question: "What does a subnet mask define?",
    answers: [
      "which part of an ip address is the network and which part is the host",
      "network and host portions",
    ],
    hint:
      "It separates two important parts of an IP address.",
    explanation:
      "A subnet mask defines which part of an IP address represents the network and which part represents the host.",
  },
  {
    question: "What is the role of a default gateway?",
    answers: [
      "router",
      "the router a device sends traffic to when the destination is outside its subnet",
      "send traffic outside the local subnet",
    ],
    hint:
      "Think about what happens when the destination is not on the local network.",
    explanation:
      "The default gateway is the router a device sends traffic to when the destination is outside its own subnet.",
  },
  {
    question: "Which command can be used to inspect the local ARP table?",
    answers: ["arp -a"],
    hint: "The command begins with 'arp'.",
    explanation:
      "arp -a displays entries in the local ARP table.",
  },
];

export default function BasicConnectivity() {
  const [command, setCommand] = useState("");

  const [history, setHistory] = useState<
    { command: string; result: CommandResult }[]
  >([]);

  const [questionIndex, setQuestionIndex] = useState(0);
  const [questionInput, setQuestionInput] = useState("");

  const [questionResult, setQuestionResult] = useState<
    "correct" | "wrong" | null
  >(null);

  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  function executeCommand(input?: string) {
    const value = (input ?? command).trim().toLowerCase();

    if (!value) return;

    const result =
      commandOutputs[value] ??
      ({
        type: "error",
        output:
          `Command not found: ${value}\n\n` +
          "ICTNET101 supports selected networking commands covered in this lesson.",
      } as CommandResult);

    setHistory((previous) => [
      ...previous,
      {
        command: value,
        result,
      },
    ]);

    setCommand("");
  }

  function resetTerminal() {
    setHistory([]);
    setCommand("");
  }

  function checkQuestion() {
    const answer = questionInput.trim().toLowerCase();

    if (!answer) return;

    const isCorrect = questions[
      questionIndex
    ].answers.some(
      (correctAnswer) =>
        answer === correctAnswer.toLowerCase()
    );

    setQuestionResult(
      isCorrect ? "correct" : "wrong"
    );

    if (isCorrect) {
      setScore((previous) => previous + 1);
    }
  }

  function nextQuestion() {
    if (questionIndex < questions.length - 1) {
      setQuestionIndex((previous) => previous + 1);
      setQuestionInput("");
      setQuestionResult(null);
    } else {
      setQuizFinished(true);
    }
  }

  function restartPractice() {
    setQuestionIndex(0);
    setQuestionInput("");
    setQuestionResult(null);
    setScore(0);
    setQuizFinished(false);
  }

  const currentQuestion =
    questions[questionIndex];

  const questionProgress =
    ((questionIndex + 1) /
      questions.length) *
    100;

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
        <header>
          <div className="flex items-center gap-3 text-sm font-semibold text-[var(--primary)]">
            <Network size={19} />
            Module 1
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 3 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Basic Networking Connectivity
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how devices physically and logically reach each other,
            understand IP addressing, network media, and use common
            connectivity tools to investigate a network.
          </p>
        </header>

        <section className="mt-8">
          <div className="flex justify-between text-sm">
            <span className="font-semibold">
              Lesson 3 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              75% of Module 1
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: "75%" }}
            />
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Network size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is networking connectivity?
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            Connectivity is about how devices physically and logically reach
            each other. Physical connectivity concerns the medium used to
            connect devices, while logical connectivity involves addressing
            and the network information devices use to communicate.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="Physical connectivity"
              text="Concerns how devices are connected using physical or wireless media."
              example="Ethernet • Fiber • Wireless"
            />

            <InfoCard
              title="Logical connectivity"
              text="Concerns addressing and the network information used to communicate."
              example="IP address • Subnet mask • Gateway"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Globe
              size={23}
              className="text-[var(--primary)]"
            />
            <h2 className="text-2xl font-bold">
              IP Addressing
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            An IP address identifies a device at the network layer. This
            lesson focuses on IPv4 and IPv6 and the information that works
            with an IP address to determine how traffic should be delivered.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            <InfoCard
              title="IPv4"
              text="IPv4 uses a 32-bit address written as four octets."
              example="192.168.1.10"
            />

            <InfoCard
              title="IPv6"
              text="IPv6 uses a 128-bit address written in hexadecimal groups and was built to solve IPv4 address exhaustion."
              example="2001:db8::1"
            />

            <InfoCard
              title="Subnet mask"
              text="A subnet mask defines which part of an IP address represents the network and which part represents the host."
              example="255.255.255.0 = /24"
            />

            <InfoCard
              title="Default gateway"
              text="The default gateway is the router a device sends traffic to when the destination is outside its own subnet."
              example="192.168.1.1"
            />
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--primary)] bg-[var(--muted)] p-5">
            <p className="text-sm font-bold text-[var(--primary)]">
              Example
            </p>

            <p className="mt-2 text-sm leading-7">
              A computer might have the IPv4 address{" "}
              <code className="font-bold">
                192.168.1.10
              </code>
              , subnet mask{" "}
              <code className="font-bold">
                255.255.255.0
              </code>
              , and default gateway{" "}
              <code className="font-bold">
                192.168.1.1
              </code>
              .
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Private IPv4 Addresses
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            The study material identifies three private IPv4 ranges. These
            addresses are used inside private networks and are not routable
            on the public internet.
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              "10.0.0.0/8",
              "172.16.0.0/12",
              "192.168.0.0/16",
            ].map((range) => (
              <div
                key={range}
                className="rounded-2xl border border-[var(--border)] bg-[var(--muted)] p-5 text-center"
              >
                <code className="font-bold text-[var(--primary)]">
                  {range}
                </code>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-[var(--border)] p-5">
            <p className="font-bold">Example</p>

            <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
              The address{" "}
              <code className="font-semibold text-[var(--primary)]">
                192.168.1.10
              </code>{" "}
              belongs to the{" "}
              <code className="font-semibold">
                192.168.0.0/16
              </code>{" "}
              private range.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <EthernetPort
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Cabling and Network Media
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            Devices need a medium through which network communication can
            travel. The study material identifies twisted-pair Ethernet,
            fiber optic and wireless communication.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <MediaCard
              icon={<EthernetPort size={23} />}
              title="Twisted Pair"
              description="Cat5e and Cat6 are common Ethernet cables."
              details="Uses RJ45 connectors."
            />

            <MediaCard
              icon={<Network size={23} />}
              title="Fiber Optic"
              description="Uses light to transmit data."
              details="Supports high speed and long distance and is immune to electrical interference."
            />

            <MediaCard
              icon={<Wifi size={23} />}
              title="Wireless"
              description="Uses radio frequency for communication."
              details="Wi-Fi is the wireless networking technology discussed in the study material."
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Terminal
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Common Connectivity Test Tools
            </h2>
          </div>

          <div className="mt-7 overflow-hidden rounded-2xl border border-[var(--border)]">
            {[
              [
                "ping",
                "Tests basic reachability using ICMP echo request/reply.",
              ],
              [
                "traceroute / tracert",
                "Shows the hop-by-hop path toward a destination.",
              ],
              [
                "ipconfig / ifconfig / ip a",
                "Shows local IP configuration and network interfaces.",
              ],
              [
                "nslookup / dig",
                "Queries DNS information.",
              ],
              [
                "arp -a",
                "Displays entries in the local ARP table.",
              ],
              [
                "netstat / ss",
                "Shows active network connections and listening ports.",
              ],
            ].map(([name, description]) => (
              <div
                key={name}
                className="grid gap-2 border-b border-[var(--border)] p-4 last:border-b-0 sm:grid-cols-[280px_1fr]"
              >
                <code className="font-semibold text-[var(--primary)]">
                  {name}
                </code>

                <span className="text-sm leading-6 text-[var(--muted-foreground)]">
                  {description}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <Terminal
                  size={24}
                  className="text-[var(--primary)]"
                />
                <h2 className="text-2xl font-bold">
                  Interactive Terminal
                </h2>
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted-foreground)]">
                Practice the networking commands introduced in this lesson.
              </p>
            </div>

            <button
              type="button"
              onClick={resetTerminal}
              className="flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-3 text-sm transition hover:border-[var(--primary)]"
            >
              <RotateCcw size={17} />
              Clear
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {quickCommands.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() =>
                  executeCommand(item)
                }
                className="rounded-lg border border-[var(--border)] px-3 py-2 text-xs font-medium transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <div className="border-b border-white/10 px-4 py-3 text-xs text-white/50">
              ICTNET101 Terminal — Networking Practice
            </div>

            <div className="min-h-[360px] max-h-[520px] overflow-y-auto p-5 font-mono text-sm">
              <div className="text-white/60">
                ICTNET101 Networking Terminal
              </div>

              <div className="mt-1 text-white/40">
                Try commands such as ipconfig, ping, tracert or nslookup.
              </div>

              {history.map((entry, index) => (
                <div
                  key={`${entry.command}-${index}`}
                  className="mt-6"
                >
                  <div className="flex flex-wrap gap-2 text-white">
                    <span className="text-green-400">
                      student@ictnet101
                    </span>

                    <span className="text-white/50">
                      $
                    </span>

                    <span>{entry.command}</span>
                  </div>

                  <pre
                    className={`mt-2 whitespace-pre-wrap leading-6 ${
                      entry.result.type === "error"
                        ? "text-red-400"
                        : "text-white/70"
                    }`}
                  >
                    {entry.result.output}
                  </pre>
                </div>
              ))}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  executeCommand();
                }}
                className="mt-6 flex gap-2"
              >
                <span className="shrink-0 text-green-400">
                  student@ictnet101
                </span>

                <span className="text-white/50">
                  $
                </span>

                <input
                  value={command}
                  onChange={(event) =>
                    setCommand(event.target.value)
                  }
                  className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/20"
                  placeholder="type a command..."
                  autoComplete="off"
                  spellCheck={false}
                />
              </form>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <CircleHelp
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Choosing the right tool
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            When troubleshooting a connection, the command you choose should
            match the question you are trying to answer.
          </p>

          <div className="mt-6 space-y-3">
            <TroubleshootingItem
              question="Is the host reachable?"
              command="ping"
            />

            <TroubleshootingItem
              question="Where does the path toward the destination go?"
              command="traceroute / tracert"
            />

            <TroubleshootingItem
              question="What IP address and gateway does this device have?"
              command="ipconfig / ip a"
            />

            <TroubleshootingItem
              question="Is DNS resolving the hostname?"
              command="nslookup / dig"
            />

            <TroubleshootingItem
              question="What entries are in the local ARP table?"
              command="arp -a"
            />

            <TroubleshootingItem
              question="What network connections or ports are active?"
              command="netstat / ss"
            />
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <CheckCircle2
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-semibold text-[var(--primary)]">
                Practice
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
                  Question {questionIndex + 1} of{" "}
                  {questions.length}
                </span>

                <span className="text-[var(--muted-foreground)]">
                  Score: {score}
                </span>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
                <div
                  className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                  style={{
                    width: `${questionProgress}%`,
                  }}
                />
              </div>

              <h3 className="mt-7 text-xl font-bold leading-8">
                {currentQuestion.question}
              </h3>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  value={questionInput}
                  onChange={(event) =>
                    setQuestionInput(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      checkQuestion();
                    }
                  }}
                  disabled={questionResult === "correct"}
                  placeholder="Enter your answer..."
                  className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-transparent px-4 py-3 font-mono text-sm outline-none transition focus:border-[var(--primary)] disabled:opacity-50"
                />

                <button
                  type="button"
                  onClick={checkQuestion}
                  disabled={
                    !questionInput.trim() ||
                    questionResult === "correct"
                  }
                  className="rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-bold text-[var(--primary-foreground)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Check Answer
                </button>
              </div>

              {questionResult && (
                <div
                  className={`mt-5 rounded-2xl border p-5 ${
                    questionResult === "correct"
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {questionResult === "correct" ? (
                      <CheckCircle2
                        size={20}
                        className="text-green-500"
                      />
                    ) : (
                      <XCircle
                        size={20}
                        className="text-red-500"
                      />
                    )}

                    <p className="font-bold">
                      {questionResult === "correct"
                        ? "Correct!"
                        : "Not quite."}
                    </p>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                    {questionResult === "correct"
                      ? currentQuestion.explanation
                      : currentQuestion.hint}
                  </p>

                  {questionResult === "wrong" && (
                    <p className="mt-3 text-sm leading-7">
                      Review the relevant section of the lesson and try
                      again.
                    </p>
                  )}

                  {questionResult === "correct" && (
                    <div className="mt-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">
                        Answer
                      </p>

                      <code className="mt-2 block rounded-lg bg-[var(--muted)] px-4 py-3 text-sm text-[var(--primary)]">
                        {currentQuestion.answers[0]}
                      </code>

                      <button
                        type="button"
                        onClick={nextQuestion}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-90"
                      >
                        {questionIndex === questions.length - 1
                          ? "View result"
                          : "Next question"}

                        <ArrowRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="mt-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                <CheckCircle2 size={34} />
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
                You have completed the practice section for Basic Networking
                Connectivity. The Module 1 final test will combine material
                from all four lessons.
              </p>

              <button
                type="button"
                onClick={restartPractice}
                className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 font-semibold transition hover:border-[var(--primary)]"
              >
                <RotateCcw size={17} />
                Review practice
              </button>
            </div>
          )}
        </section>

        <LessonCompletionButton
          moduleSlug="introduction-to-networking"
          lessonSlug="connectivity"
        />

        <LessonNavigation />
      </div>
    </main>
  );
}

function InfoCard({
  title,
  text,
  example,
}: {
  title: string;
  text: string;
  example: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <h3 className="font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">
        {text}
      </p>

      <code className="mt-4 block rounded-lg bg-[var(--muted)] px-3 py-2 text-xs text-[var(--primary)]">
        {example}
      </code>
    </div>
  );
}

function MediaCard({
  icon,
  title,
  description,
  details,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
        {icon}
      </div>

      <h3 className="mt-4 font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
        {description}
      </p>

      <p className="mt-3 text-xs leading-5 text-[var(--muted-foreground)]">
        {details}
      </p>
    </div>
  );
}

function TroubleshootingItem({
  question,
  command,
}: {
  question: string;
  command: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-[var(--border)] p-4 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-medium">
        {question}
      </span>

      <code className="rounded-lg bg-[var(--muted)] px-3 py-2 text-xs font-semibold text-[var(--primary)]">
        {command}
      </code>
    </div>
  );
}