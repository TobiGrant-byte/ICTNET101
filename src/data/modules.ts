export type Lesson = {
  id: number;
  title: string;
  description: string;
  slug: string;
  duration: string;
  completed?: boolean;
};

export type Module = {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  topics: string[];
  lessons: Lesson[];
};

export const modules: Module[] = [
  {
    id: 1,
    slug: "introduction-to-networking",
    title: "Introduction to Networking",
    description:
      "Learn the foundations of computer networking, the OSI model, TCP/IP, network connectivity, IP addressing, network media, ports, TCP, UDP, and essential networking commands.",
    icon: "Network",
    difficulty: "Beginner",
    estimatedTime: "2–3 hours",
    topics: [
      "Computer Networks",
      "OSI Model",
      "TCP/IP Model",
      "Networking Devices",
      "IP Addressing",
      "IPv4",
      "IPv6",
      "Private IP Addresses",
      "Subnet Masks",
      "Default Gateways",
      "Network Media",
      "Network Ports",
      "TCP",
      "UDP",
      "Connectivity Commands",
    ],
    lessons: [
      {
        id: 1,
        title: "Introduction to Networking",
        description:
          "Learn what computer networks are, why they are used, the OSI and TCP/IP models, and the main networking devices.",
        slug: "introduction",
        duration: "30 min",
        completed: false,
      },
      {
        id: 2,
        title: "The OSI 7-Layer Model",
        description:
          "Explore all seven OSI layers and understand the role of each layer in network communication.",
        slug: "osi",
        duration: "35 min",
        completed: false,
      },
      {
        id: 3,
        title: "Basic Networking Connectivity",
        description:
          "Learn IPv4, IPv6, private addresses, subnet masks, default gateways, network media, and connectivity commands.",
        slug: "connectivity",
        duration: "40 min",
        completed: false,
      },
      {
        id: 4,
        title: "Network Ports & TCP/UDP",
        description:
          "Learn how network ports identify services and understand the differences between TCP and UDP.",
        slug: "ports",
        duration: "35 min",
        completed: false,
      },
    ],
  },

  {
    id: 2,
    slug: "routing-wifi-dhcp-dns",
    title: "Routing, Wi-Fi, DHCP & DNS",
    description:
      "Learn routing fundamentals, wireless networking, DHCP address assignment, DNS name resolution, and the tools used to investigate and manage network connectivity.",
    icon: "Router",
    difficulty: "Beginner",
    estimatedTime: "2–3 hours",
    topics: [
      "Routing",
      "Routing Tables",
      "Default Routes",
      "Static Routing",
      "Dynamic Routing",
      "NAT",
      "Wi-Fi",
      "SSID",
      "2.4 GHz",
      "5 GHz",
      "6 GHz",
      "Wi-Fi Security",
      "DHCP",
      "DORA",
      "DHCP Leases",
      "DHCP Reservations",
      "DNS",
      "DNS Resolution",
      "DNS Records",
      "DNS Caching",
      "DNS Tools",
    ],
    lessons: [
      {
        id: 1,
        title: "Routing Basics",
        description:
          "Learn how routers forward packets, understand routing tables and default routes, and explore static routing, dynamic routing, and NAT.",
        slug: "routing",
        duration: "35 min",
        completed: false,
      },
      {
        id: 2,
        title: "Wi-Fi Explained",
        description:
          "Learn how wireless networks work, understand SSIDs, frequency bands, channels, interference, and Wi-Fi security.",
        slug: "wifi",
        duration: "35 min",
        completed: false,
      },
      {
        id: 3,
        title: "DHCP",
        description:
          "Learn how DHCP automatically assigns network configuration, understand the DORA process, leases, reservations, and DHCP ports.",
        slug: "dhcp",
        duration: "35 min",
        completed: false,
      },
      {
        id: 4,
        title: "DNS",
        description:
          "Learn how DNS resolves hostnames, understand DNS hierarchy, records, caching, recursive resolution, and DNS investigation tools.",
        slug: "dns",
        duration: "40 min",
        completed: false,
      },
    ],
  },

  {
    id: 3,
    slug: "network-services-security-troubleshooting",
    title: "Network Services, Security & Troubleshooting",
    description:
      "Learn ARP, web services, email protocols, remote access, file sharing, firewalls, proxy servers, network security, and structured network troubleshooting.",
    icon: "Shield",
    difficulty: "Intermediate",
    estimatedTime: "4–5 hours",
    topics: [
      "ARP",
      "MAC Address Resolution",
      "ARP Tables",
      "ARP Spoofing",
      "HTTP",
      "HTTPS",
      "HTTP Methods",
      "HTTP Status Codes",
      "SMTP",
      "IMAP",
      "POP3",
      "SSH",
      "RDP",
      "VNC",
      "VPN",
      "Telnet",
      "FTP",
      "FTPS",
      "SFTP",
      "SMB",
      "NFS",
      "Firewalls",
      "Packet Filtering",
      "Stateful Firewalls",
      "NGFW",
      "Host-Based Firewalls",
      "Network-Based Firewalls",
      "Proxy Servers",
      "Forward Proxy",
      "Reverse Proxy",
      "Transparent Proxy",
      "CIA Triad",
      "Network Segmentation",
      "Least Privilege",
      "Encryption in Transit",
      "Strong Authentication",
      "Patch Management",
      "Monitoring and Logging",
      "Network Troubleshooting",
      "OSI Troubleshooting",
    ],
    lessons: [
      {
        id: 1,
        title: "ARP — Address Resolution Protocol",
        description:
          "Learn how ARP maps IP addresses to MAC addresses on a local network, how ARP tables work, and why ARP spoofing is a security concern.",
        slug: "arp",
        duration: "30 min",
        completed: false,
      },
      {
        id: 2,
        title: "HTTP & Web Services",
        description:
          "Learn how HTTP and HTTPS work, understand request methods, common status codes, and the role of TCP ports 80 and 443.",
        slug: "http",
        duration: "35 min",
        completed: false,
      },
      {
        id: 3,
        title: "Email Protocols",
        description:
          "Learn how SMTP, IMAP, and POP3 handle email, including their ports, purposes, and the differences between synchronized and downloaded mail.",
        slug: "email",
        duration: "30 min",
        completed: false,
      },
      {
        id: 4,
        title: "Remote Access",
        description:
          "Explore SSH, RDP, VNC, VPN, and Telnet and understand how each technology provides remote access.",
        slug: "remote-access",
        duration: "35 min",
        completed: false,
      },
      {
        id: 5,
        title: "File Sharing Protocols",
        description:
          "Learn FTP, FTPS, SFTP, SMB, and NFS and understand how different protocols provide file and printer sharing.",
        slug: "file-sharing",
        duration: "35 min",
        completed: false,
      },
      {
        id: 6,
        title: "Firewalls",
        description:
          "Learn how firewalls filter traffic and compare packet-filtering, stateful, next-generation, host-based, and network-based firewalls.",
        slug: "firewalls",
        duration: "35 min",
        completed: false,
      },
      {
        id: 7,
        title: "Proxy Servers",
        description:
          "Learn how proxy servers work and compare forward, reverse, and transparent proxies and their common benefits.",
        slug: "proxies",
        duration: "30 min",
        completed: false,
      },
      {
        id: 8,
        title: "Network Security Basics",
        description:
          "Learn the CIA triad, segmentation, least privilege, encryption in transit, strong authentication, patch management, and security monitoring.",
        slug: "security",
        duration: "40 min",
        completed: false,
      },
      {
        id: 9,
        title: "Network Troubleshooting",
        description:
          "Learn a structured troubleshooting process, useful networking commands, and a bottom-up approach based on the OSI model.",
        slug: "troubleshooting",
        duration: "40 min",
        completed: false,
      },
    ],
  },
];

export default modules;