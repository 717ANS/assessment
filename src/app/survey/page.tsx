"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SurveyPage() {
  const [questionnaire, setQuestionnaire] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [final, setFinal] = useState<any>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [enterpriseName, setEnterpriseName] = useState("");
  const [enterpriseInfo, setEnterpriseInfo] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setQuestionnaire(data.questionnaire);
        setDimensions(data.dimensions);
        setFinal(data.final);
        setLoading(false);
      });
  }, []);

  const handleChange = (dimName: string, qKey: string, value: string) => {
    setAnswers(prev => ({ ...prev, [`${dimName}_${qKey}`]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 仅记录题目序号和选项
    const answerArr: { dim: string, qKey: string, value: string }[] = [];
    Object.entries(questionnaire).forEach(([dimName, dimObj]: any) => {
      Object.entries(dimObj)
        .filter(([k]) => k.startsWith('Q'))
        .forEach(([qKey, q]: any) => {
          if (answers[`${dimName}_${qKey}`]) {
            answerArr.push({ dim: dimName, qKey, value: answers[`${dimName}_${qKey}`] });
          }
        });
    });
    const result = {
      answers: answerArr,
      timestamp: Date.now()
    };
    const infoObj = { remark: enterpriseInfo };
    // 新增：本地保存企业名
    localStorage.setItem("enterprise_latest", JSON.stringify({ name: enterpriseName }));
    const res = await fetch("/api/admin/enterprise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: enterpriseName, info: infoObj, result }),
    });
    const data = await res.json();
    if (data.success !== false) {
      router.push(`/survey/result?id=${data.id || ''}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-perficient-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-perficient-red mb-4"></div>
          <p className="text-light-gray text-lg">正在加载问卷...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-perficient-black">
      {/* 顶部导航栏 */}
      <nav className="w-full fixed top-0 left-0 z-50 bg-gray-1 shadow-lg border-b border-gray-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between h-16 px-6">
          <a href="/" className="text-2xl font-bold text-perficient-red">能力成熟度评估</a>
          <div className="flex space-x-8 items-center">
            <a href="/" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">首页</a>
            <a href="/survey" className="text-perficient-red font-medium">能力评估</a>
            <a href="/survey/result" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">评估结果</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-20 px-6 pb-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-perficient-white mb-4">制造业企业能力成熟度问卷</h1>
          <p className="text-light-gray text-lg">请根据您的实际情况，选择最符合的选项</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 企业信息输入 */}
          <div className="card-dark p-8 mb-8">
            <h2 className="text-xl font-bold text-perficient-white mb-4">企业信息</h2>
            <div className="mb-4">
              <label className="block text-light-gray mb-1">企业名称 <span className="text-perficient-red">*</span></label>
              <input
                type="text"
                className="px-3 py-2 rounded w-full text-black"
                value={enterpriseName}
                onChange={e => setEnterpriseName(e.target.value)}
                required
                placeholder="请输入企业名称"
              />
            </div>
            <div>
              <label className="block text-light-gray mb-1">企业备注信息</label>
              <textarea
                className="px-3 py-2 rounded w-full text-black min-h-[60px]"
                value={enterpriseInfo}
                onChange={e => setEnterpriseInfo(e.target.value)}
                placeholder="可填写企业简介、行业、规模等信息"
              />
            </div>
          </div>
          {Object.entries(questionnaire).map(([dimName, dimObj]: any, idx: number) => (
            <div key={dimName} className="card-dark p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-perficient-white">
                  {dimName}
                </h2>
              </div>
              
              {Object.entries(dimObj)
                .filter(([k]) => k.startsWith('Q'))
                .map(([qKey, q]: any, qIdx: number) => (
                  <div key={qKey} className="mb-8 p-6 border-l-4 border-perficient-red bg-gray-2 rounded-r-lg">
                    <div className="flex items-start justify-between mb-4">
                      <label className="block font-semibold text-perficient-white text-lg leading-relaxed">
                        {q.question}
                      </label>
                    </div>
                    
                    <div className="space-y-3">
                      {q.option && q.option.map((opt: any, idx: number) => {
                        const level = Object.keys(opt)[0];
                        const label = opt[level];
                        const isSelected = answers[`${dimName}_${qKey}`] === level;
                        return (
                          <label 
                            key={level} 
                            className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                              isSelected 
                                ? 'border-perficient-red bg-gray-1' 
                                : 'border-gray-3 hover:border-perficient-gold hover:bg-gray-2'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`${dimName}_${qKey}`}
                              value={level}
                              checked={isSelected}
                              onChange={() => handleChange(dimName, qKey, level)}
                              required
                              className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                              isSelected 
                                ? 'border-perficient-red' 
                                : 'border-medium-gray'
                            }`}>
                              {isSelected && (
                                <div className="w-3 h-3 bg-perficient-red rounded-full"></div>
                              )}
                            </div>
                            <span className={`font-medium ${
                              isSelected ? 'text-perficient-red' : 'text-light-gray'
                            }`}>
                              {label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          ))}
          
          <div className="text-center space-x-6 pt-8">
            <button
              type="submit"
              className="btn-skew"
            >
              <span>提交评估</span>
            </button>
            <Link href="/">
              <button type="button" className="btn-skew">
                <span>返回主页</span>
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}