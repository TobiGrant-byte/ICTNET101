import { notFound } from "next/navigation";

import IntroductionLessonPage from "@/app/modules/[slug]/learn/introduction/page";
import OSILessonPage from "@/app/modules/[slug]/learn/osi/page";
import ConnectivityLessonPage from "@/app/modules/[slug]/learn/connectivity/page";
import NetworkPortsPage from "@/app/modules/[slug]/learn/ports/page";

import RoutingLessonPage from "@/app/modules/[slug]/learn/routing/page";
import WiFiLessonPage from "@/app/modules/[slug]/learn/wifi/page";
import DHCPLessonPage from "@/app/modules/[slug]/learn/dhcp/page";
import DNSLessonPage from "@/app/modules/[slug]/learn/dns/page";

import ARP from "@/components/lessons/ARP";
import HTTP from "@/components/lessons/HTTP";
import Email from "@/components/lessons/Email";
import RemoteAccess from "@/components/lessons/RemoteAccess";
import FileSharing from "@/components/lessons/FileSharing";
import Firewalls from "@/components/lessons/Firewalls";
import Proxies from "@/components/lessons/Proxies";
import Security from "@/components/lessons/Security";
import Troubleshooting from "@/components/lessons/Troubleshooting";

type LessonPageProps = {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
};

export default async function LessonPage({
  params,
}: LessonPageProps) {
  const { slug, lesson } = await params;

  /*
   * MODULE 1
   */
  if (slug === "introduction-to-networking") {
    switch (lesson) {
      case "introduction":
        return <IntroductionLessonPage />;

      case "osi":
        return <OSILessonPage />;

      case "connectivity":
        return <ConnectivityLessonPage />;

      case "ports":
        return <NetworkPortsPage />;

      default:
        notFound();
    }
  }

  /*
   * MODULE 2
   */
  if (slug === "routing-wifi-dhcp-dns") {
    switch (lesson) {
      case "routing":
        return <RoutingLessonPage />;

      case "wifi":
        return <WiFiLessonPage />;

      case "dhcp":
        return <DHCPLessonPage />;

      case "dns":
        return <DNSLessonPage />;

      default:
        notFound();
    }
  }

  /*
   * MODULE 3
   */
  if (
    slug ===
    "network-services-security-troubleshooting"
  ) {
    switch (lesson) {
      case "arp":
        return <ARP />;

      case "http":
        return <HTTP />;

      case "email":
        return <Email />;

      case "remote-access":
        return <RemoteAccess />;

      case "file-sharing":
        return <FileSharing />;

      case "firewalls":
        return <Firewalls />;

      case "proxies":
        return <Proxies />;

      case "security":
        return <Security />;

      case "troubleshooting":
        return <Troubleshooting />;

      default:
        notFound();
    }
  }

  notFound();
}