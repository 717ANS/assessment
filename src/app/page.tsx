"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [final, setFinal] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any>(null);
  const [latestResult, setLatestResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setDimensions(data.dimensions);
        setFinal(data.final);
        setQuestionnaire(data.questionnaire);
        setLoading(false);
      })
      .catch(err => {
        console.error("加载数据失败:", err);
        setLoading(false);
      });
    
    // 获取本地最新评估结果
    try {
      const local = localStorage.getItem("survey_result");
      if (local) {
        setLatestResult(JSON.parse(local));
      }
    } catch (err) {
      console.error("解析本地数据失败:", err);
    }
  }, []);

  // 获取综合建议
  const getOverallAdvice = () => {
    if (!latestResult || !final || typeof latestResult?.overall?.level === 'undefined') {
      return null;
    }
    
    const overallLevel = latestResult.overall.level;
    if (!final.总结 || !Array.isArray(final.总结)) {
      return null;
    }
    
    return final.总结.find((item: any) => {
      if (!item.成熟度 || typeof item.成熟度 !== 'string') return false;
      const match = item.成熟度.match(/^L\d+/);
      return match && match[0] === `L${overallLevel}`;
    });
  };

  const overallAdvice = getOverallAdvice();

  return (
    <div className="min-h-screen bg-perficient-black">
      {/* 顶部导航栏 */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-gray-1 shadow-lg border-b border-gray-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="text-2xl font-bold text-perficient-red">能力成熟度评估</a>
          <div className="flex space-x-8 items-center">
            <a href="/" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">首页</a>
            <a href="/survey" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">能力评估</a>
            <a href="/survey/result" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">评估结果</a>
          </div>
        </div>
      </nav>
      
      <div className="max-w-6xl mx-auto pt-20 px-6">
        {/* 系统介绍 */}
        <section className="mb-12">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-perficient-white mb-6">
              制造业企业能力成熟度评估系统
            </h1>
            <p className="text-xl text-light-gray max-w-3xl mx-auto leading-relaxed">
              基于科学的评估模型，帮助企业全面了解自身能力水平，为战略决策提供数据支撑
            </p>
          </div>
          
          {/* 能力模型可视化 */}
          <div className="card-dark p-6 mb-8">
            <h3 className="text-2xl font-bold text-perficient-white mb-6 text-center">能力模型结构</h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(dimensions).map(([dimName, dim]: any, idx: number) => (
                <div key={dimName} className="bg-gray-2 border border-gray-3 rounded-lg p-4 hover:border-perficient-gold transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-lg font-bold text-perficient-white">{dimName}</h4>
                    <div className="w-2 h-2 bg-perficient-red rounded-full"></div>
                  </div>
                  <div className="pt-3 border-t border-gray-3">
                    <span className="font-semibold text-perficient-gold text-sm">核心能力：</span>
                    <span className="text-light-gray text-sm ml-1">{dim["核心能力"] || dim.core_capability}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 评估入口 */}
          <div className="flex justify-center mb-12">
            <Link href="/survey">
              <button className="btn-skew">
                <span>开始能力成熟度评估</span>
              </button>
            </Link>
          </div>
        </section>
        
        {/* 评估结果模块 */}
        {/* 已删除评估结果模块 */}
      </div>
    </div>
  );
}
