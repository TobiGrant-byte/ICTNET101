"use client";

import LessonCompletionButton from "@/components/learning/LessonCompletionButton";
import { useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Globe,
  Network,
  RefreshCcw,
  Router,
  Server,
  ShieldCheck,
  TableProperties,
  XCircle,
} from "lucide-react";

type RoutingTableEntry = {
  destination: string;
  nextHop: string;
  interfaceName: string;
  type: "Connected" | "Static" | "Dynamic" | "Default";
};

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

const routingTable: RoutingTableEntry[] = [
  {
    destination: "192.168.1.0/24",
    nextHop: "Directly connected",
    interfaceName: "eth0",
    type: "Connected",
  },
  {
    destination: "10.0.0.0/8",
    nextHop: "10.0.0.1",
    interfaceName: "eth1",
    type: "Static",
  },
  {
    destination: "172.16.0.0/16",
    nextHop: "172.16.1.1",
    interfaceName: "eth2",
    type: "Dynamic",
  },
  {
    destination: "0.0.0.0/0",
    nextHop: "192.168.1.1",
    interfaceName: "eth0",
    type: "Default",
  },
];

const questions: Question[] = [
  {
    question: "What is the main job of a router?",
    options: [
      "To forward packets between networks",
      "To store files for network users",
      "To replace every switch on a network",
      "To increase the speed of a CPU",
    ],
    answer: 0,
    explanation:
      "Routers connect networks and make forwarding decisions so packets can reach destinations on other networks.",
  },
  {
    question: "What does a routing table contain?",
    options: [
      "Only MAC addresses",
      "Information used to determine where packets should be forwarded",
      "Only DNS records",
      "Only wireless network names",
    ],
    answer: 1,
    explanation:
      "A routing table contains routes that help a router determine where packets should be sent.",
  },
  {
    question: "What is a static route?",
    options: [
      "A route manually configured by an administrator",
      "A route automatically learned from every host",
      "A route used only by Wi-Fi devices",
      "A route that can never be changed",
    ],
    answer: 0,
    explanation:
      "Static routes are manually configured by an administrator.",
  },
  {
    question: "What is dynamic routing?",
    options: [
      "Routes entered manually one at a time",
      "Routes learned and updated through routing protocols",
      "A route used only for private IP addresses",
      "A replacement for subnet masks",
    ],
    answer: 1,
    explanation:
      "Dynamic routing uses routing protocols to learn and update routes automatically.",
  },
  {
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
      "OSPF is a dynamic routing protocol. Other examples include RIP and BGP.",
  },
  {
    question: "What does a default route represent?",
    options: [
      "A route used only for local traffic",
      "A route used when no more specific route matches",
      "A route that points only to a DNS server",
      "A route used only by switches",
    ],
    answer: 1,
    explanation:
      "A default route is used when a destination does not match a more specific route in the routing table.",
  },
  {
    question: "What is NAT commonly used for?",
    options: [
      "Translating between private and public addressing",
      "Encrypting every packet automatically",
      "Replacing DNS",
      "Creating wireless SSIDs",
    ],
    answer: 0,
    explanation:
      "Network Address Translation commonly allows private internal addresses to communicate through a public address.",
  },
  {
    question:
      "Which statement best describes a typical home router?",
    options: [
      "It can combine routing, NAT, DHCP and other network functions",
      "It can only provide Wi-Fi",
      "It can only forward Ethernet frames",
      "It is only used as a DNS server",
    ],
    answer: 0,
    explanation:
      "Many home routers combine several functions such as routing, NAT, DHCP, switching, and Wi-Fi access.",
  },
];

const protocolCards = [
  {
    title: "RIP",
    description:
      "A routing protocol that uses hop count as its routing metric.",
  },
  {
    title: "OSPF",
    description:
      "A link-state routing protocol commonly used inside larger networks.",
  },
  {
    title: "BGP",
    description:
      "A routing protocol used to exchange routing information between autonomous systems.",
  },
];

const routingConcepts = [
  {
    title: "Routing Table",
    description:
      "A collection of routes that tells the router how destinations can be reached.",
    icon: TableProperties,
  },
  {
    title: "Next Hop",
    description:
      "The next router or destination toward which a packet should be forwarded.",
    icon: ArrowRight,
  },
  {
    title: "Interface",
    description:
      "The network interface through which a router forwards traffic.",
    icon: Network,
  },
  {
    title: "Default Route",
    description:
      "The route used when no more specific destination route matches.",
    icon: Globe,
  },
];

export default function RoutingBasics() {
  const [selectedRoute, setSelectedRoute] =
    useState(0);

  const [currentQuestion, setCurrentQuestion] =
    useState(0);

  const [selectedAnswer, setSelectedAnswer] =
    useState<number | null>(null);

  const [score, setScore] =
    useState(0);

  const [quizFinished, setQuizFinished] =
    useState(false);

  const activeRoute =
    routingTable[selectedRoute];

  const question =
    questions[currentQuestion];

  function chooseRoute(index: number) {
    setSelectedRoute(index);
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
            <Router size={19} />
            Module 2
          </div>

          <p className="mt-6 text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
            Lesson 1 of 4
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">
            Routers &amp; Routing Basics
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Learn how routers connect networks, how routing tables guide
            packet forwarding, the difference between static and dynamic
            routing, default routes, NAT, and common routing protocols.
          </p>
        </header>

        {/* Progress */}
        <section className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              Lesson 1 of 4
            </span>

            <span className="text-[var(--muted-foreground)]">
              Module 2 — 25%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--muted)]">
            <div
              className="h-full rounded-full bg-[var(--primary)]"
              style={{ width: "25%" }}
            />
          </div>
        </section>

        {/* What is a Router */}
        <section className="mt-10 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
            <Router size={28} />
          </div>

          <h2 className="mt-7 text-2xl font-bold">
            What is a Router?
          </h2>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            A router connects different networks and forwards packets toward
            their destinations. Unlike a switch, which primarily forwards
            frames inside a local network using MAC addresses, a router makes
            forwarding decisions using network-layer information such as IP
            addresses.
          </p>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            A router examines the destination of a packet and uses its routing
            information to determine where the packet should go next.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <FeatureCard
              icon={<Network size={21} />}
              title="Connects Networks"
              description="Routers provide communication between separate IP networks."
            />

            <FeatureCard
              icon={<ArrowRight size={21} />}
              title="Forwards Packets"
              description="Routers choose where packets should be sent next."
            />
          </div>
        </section>

        {/* How Routing Works */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <ArrowRight
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              How Does Routing Work?
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            When a router receives a packet, it looks at the destination IP
            address and compares it against the routes it knows. The best
            matching route determines the next step.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            <StepCard
              number="1"
              title="Receive"
              description="The router receives a packet through one of its interfaces."
            />

            <StepCard
              number="2"
              title="Look Up"
              description="The router checks the destination against its routing table."
            />

            <StepCard
              number="3"
              title="Forward"
              description="The router forwards the packet through the selected interface."
            />
          </div>
        </section>

        {/* Routing Table Explorer */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <TableProperties
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Interactive explorer
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Explore a Routing Table
              </h2>
            </div>
          </div>

          <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
            Select a route to see how its destination, next hop, interface,
            and route type work together.
          </p>

          <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">

            {/* Route Buttons */}
            <div className="space-y-2">
              {routingTable.map(
                (route, index) => {
                  const active =
                    index ===
                    selectedRoute;

                  return (
                    <button
                      key={`${route.destination}-${route.type}`}
                      type="button"
                      onClick={() =>
                        chooseRoute(
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
                        <Router size={18} />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold">
                          {route.destination}
                        </p>

                        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                          {route.type}
                        </p>
                      </div>
                    </button>
                  );
                }
              )}
            </div>

            {/* Active Route */}
            <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-7 sm:p-9">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--muted)] text-[var(--primary)]">
                  <TableProperties size={25} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[var(--primary)]">
                    Destination
                  </p>

                  <h3 className="text-3xl font-black">
                    {activeRoute.destination}
                  </h3>
                </div>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <InfoBox
                  title="Next Hop"
                  value={
                    activeRoute.nextHop
                  }
                />

                <InfoBox
                  title="Interface"
                  value={
                    activeRoute.interfaceName
                  }
                />

                <InfoBox
                  title="Route Type"
                  value={
                    activeRoute.type
                  }
                />

                <InfoBox
                  title="Meaning"
                  value={
                    activeRoute.type ===
                    "Default"
                      ? "Used when no specific route matches"
                      : activeRoute.type ===
                          "Connected"
                        ? "Directly attached network"
                        : activeRoute.type ===
                            "Static"
                          ? "Manually configured route"
                          : "Learned through routing"
                  }
                />
              </div>
            </div>
          </div>
        </section>

        {/* Static and Dynamic Routing */}
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <InfoSection
            icon={<Server size={23} />}
            title="Static Routing"
            description="A static route is manually configured by an administrator. Static routing can be predictable and useful when the network topology is simple."
            points={[
              "Manually configured",
              "Predictable forwarding",
              "Useful for simple or stable networks",
            ]}
          />

          <InfoSection
            icon={<RefreshCcw size={23} />}
            title="Dynamic Routing"
            description="Dynamic routing allows routers to learn and update routes using routing protocols."
            points={[
              "Routes can be learned automatically",
              "Routing information can change as the network changes",
              "Common protocols include RIP, OSPF, and BGP",
            ]}
          />
        </section>

        {/* Routing Protocols */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Network
              size={23}
              className="text-[var(--primary)]"
            />

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-[var(--primary)]">
                Routing protocols
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                RIP, OSPF and BGP
              </h2>
            </div>
          </div>

          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Routing protocols help routers exchange information and determine
            how destinations can be reached.
          </p>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {protocolCards.map(
              (protocol) => (
                <div
                  key={protocol.title}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--muted)] text-[var(--primary)]">
                    <Network size={20} />
                  </div>

                  <h3 className="mt-4 text-lg font-black">
                    {protocol.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                    {protocol.description}
                  </p>
                </div>
              )
            )}
          </div>
        </section>

        {/* Default Route */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Globe
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Default Routes
            </h2>
          </div>

          <p className="mt-4 text-base leading-8">
            A default route is used when the router does not have a more
            specific route for the destination. It provides a general path
            for traffic that does not match another entry in the routing
            table.
          </p>

          <div className="mt-6 rounded-2xl bg-[var(--card)] p-5">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Common representation
            </p>

            <code className="mt-2 block rounded-xl bg-[var(--background)] p-4 text-sm font-bold text-[var(--primary)]">
              0.0.0.0/0
            </code>

            <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">
              The <code>0.0.0.0/0</code> route matches destinations that are
              not covered by a more specific IPv4 route.
            </p>
          </div>
        </section>

        {/* NAT */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <ShieldCheck
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              Network Address Translation (NAT)
            </h2>
          </div>

          <p className="mt-4 text-base leading-8 text-[var(--muted-foreground)]">
            NAT is commonly used at the boundary between a private network
            and a public network. It allows private internal addresses to
            communicate using a public-facing address.
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <StepCard
              number="1"
              title="Private Host"
              description="An internal device uses a private IP address."
            />

            <StepCard
              number="2"
              title="NAT"
              description="The router translates the traffic for the external network."
            />

            <StepCard
              number="3"
              title="Public Network"
              description="The traffic continues using the public-facing address."
            />
          </div>
        </section>

        {/* Home Router */}
        <section className="mt-8 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7 sm:p-10">
          <div className="flex items-center gap-3">
            <Router
              size={23}
              className="text-[var(--primary)]"
            />

            <h2 className="text-2xl font-bold">
              What a Home Router Can Provide
            </h2>
          </div>

          <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--muted-foreground)]">
            A typical home router is often more than just a router. One
            device can combine several networking functions.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Routing",
              "NAT",
              "DHCP",
              "Wi-Fi",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5 text-center"
              >
                <p className="font-bold text-[var(--primary)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mt-8 rounded-3xl border border-[var(--primary)] bg-[var(--muted)] p-7 sm:p-10">
          <h2 className="text-2xl font-bold">
            Lesson Summary
          </h2>

          <ul className="mt-5 space-y-3 text-sm leading-7">
            <li>
              <strong>1.</strong> Routers connect different networks and
              forward packets.
            </li>

            <li>
              <strong>2.</strong> Routing tables contain information used to
              determine where packets should be forwarded.
            </li>

            <li>
              <strong>3.</strong> Static routes are manually configured.
            </li>

            <li>
              <strong>4.</strong> Dynamic routing protocols can automatically
              learn and update routes.
            </li>

            <li>
              <strong>5.</strong> RIP, OSPF, and BGP are examples of routing
              protocols.
            </li>

            <li>
              <strong>6.</strong> A default route is used when no more specific
              route matches.
            </li>

            <li>
              <strong>7.</strong> NAT commonly translates between private
              internal addressing and public addressing.
            </li>

            <li>
              <strong>8.</strong> Home routers commonly combine routing, NAT,
              DHCP, and Wi-Fi functions.
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
            lessonSlug="routing"
          />
        </section>

        {/* Navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/modules/routing-wifi-dhcp-dns"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-5 py-3 text-sm font-semibold transition hover:border-[var(--primary)] hover:bg-[var(--muted)]"
          >
            <ArrowLeft size={17} />
            Back to Module
          </Link>

          <Link
            href="/modules/routing-wifi-dhcp-dns/learn/wifi"
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

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--muted)] text-sm font-black text-[var(--primary)]">
        {number}
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

      <p className="mt-2 text-lg font-black text-[var(--primary)]">
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