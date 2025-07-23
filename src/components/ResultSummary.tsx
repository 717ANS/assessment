"use client";
import React from "react";

export default function ResultSummary({ overallAdviceObj, overallLevel }: { overallAdviceObj: any, overallLevel: number }) {
  if (!overallAdviceObj) {
    return <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">暂无建议</div>;
  }
  return (
    <div
      className="cursor-pointer mb-8 hover:shadow-lg transition-shadow"
      onClick={() => window.location.href = '/survey/result'}
      title="点击查看详细评估结果"
    >
      <div className="mb-2 text-center">
        <span className="text-lg font-semibold">您的综合等级：</span>
        <span className="text-2xl text-blue-600 font-bold">L{overallLevel}</span>
      </div>
      <div className="p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded">
        <div className="mb-2 font-semibold">{overallAdviceObj.成熟度} 综合建议</div>
        <div className="mb-2">
          <span className="font-semibold">核心策略：</span>
          <ul className="list-disc pl-6">
            {overallAdviceObj.核心策略?.map((s: string, idx: number) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
        <div>
          <span className="font-semibold">关键行动：</span>
          <ul className="list-disc pl-6">
            {overallAdviceObj.关键行动?.map((s: string, idx: number) => (
              <li key={idx} dangerouslySetInnerHTML={{__html: s}} />
            ))}
          </ul>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-2">点击查看详细评估结果</div>
    </div>
  );
} 