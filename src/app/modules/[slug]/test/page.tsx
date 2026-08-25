import { notFound } from "next/navigation";

import Module1FinalTest from "@/components/assessments/Module1FinalTest";
import Module2FinalTest from "@/components/assessments/Module2FinalTest";
import Module3FinalTest from "@/components/assessments/Module3FinalTest";

type TestPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TestPage({
  params,
}: TestPageProps) {
  const { slug } = await params;

  switch (slug) {
    case "introduction-to-networking":
      return <Module1FinalTest />;

    case "routing-wifi-dhcp-dns":
      return <Module2FinalTest />;

    case "network-services-security-troubleshooting":
      return <Module3FinalTest />;

    default:
      notFound();
  }
}