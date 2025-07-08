import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "出海能力成熟度评估 - 制造业企业能力成熟度评估系统",
  description: "专门针对中小企业国际化发展需求，评估国际市场认知、产品国际化、供应链国际化、人才国际化、风险管控等能力",
};

export default function GlobalizationSurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 