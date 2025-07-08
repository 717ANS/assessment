import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "业务能力成熟度评估 - 制造业企业能力成熟度评估系统",
  description: "评估企业在战略与领导力、生产与运营管理、市场与客户、技术与创新、组织与人才等五大维度的成熟度水平",
};

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 