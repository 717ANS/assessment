"use client";
import { useState } from "react";
import DimensionAdmin from "./dimension/page";
import QuestionnaireAdmin from "./questionnaire/page";
import OverallAdmin from "./overall/page";
import EnterpriseAdmin from "./enterprise/page";

function Overview() {
  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">后台概览</h2>
      <p>欢迎使用后台管理系统。请在左侧选择功能。</p>
    </div>
  );
}

const TABS = [
  { key: "overview", label: "概览" },
  { key: "dimension", label: "能力维度管理" },
  { key: "questionnaire", label: "问卷管理" },
  { key: "overall", label: "总结管理" },
  { key: "enterprise", label: "用户企业管理" },
];

export default function AdminPage() {
  const [tab, setTab] = useState("overview");

  return (
    <div className="min-h-screen flex bg-black">
      {/* 侧边栏 */}
      <aside className="w-48 bg-gray-900 text-white flex flex-col py-8 px-2 space-y-2 border-r border-gray-700 shadow-none">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`text-left px-4 py-2 rounded-none transition-all font-medium border-l-4 ${tab === t.key ? "bg-perficient-red text-white border-perficient-gold" : "hover:bg-gray-700 border-transparent"}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </aside>
      {/* 内容区 */}
      <main className="flex-1 bg-black min-h-screen p-0 border-l-0 shadow-none">
        <div className="max-w-6xl mx-auto p-8">
          {tab === "overview" && <Overview />}
          {tab === "dimension" && <DimensionAdmin />}
          {tab === "questionnaire" && <QuestionnaireAdmin />}
          {tab === "overall" && <OverallAdmin />}
          {tab === "enterprise" && <EnterpriseAdmin />}
        </div>
      </main>
    </div>
  );
} 