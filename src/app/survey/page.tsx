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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 计算每个维度分数
    const dimResults: any[] = [];
    Object.entries(questionnaire).forEach(([dimName, dimObj]: any) => {
      let total = 0, weightSum = 0;
      Object.entries(dimObj)
        .filter(([k]) => k.startsWith('Q'))
        .forEach(([qKey, q]: any) => {
          const v = Number(answers[`${dimName}_${qKey}`] || 0);
          total += v * (q.weight || 1);
          weightSum += (q.weight || 1);
        });
      const avg = weightSum > 0 ? total / weightSum : 0;
      const level = Math.floor(avg);
      // 查找建议
      // 维度建议查找可根据 dimName 匹配 dimensions
      let advice = "暂无建议";
      const dimModel = dimensions && (Array.isArray(dimensions) ? dimensions.find((d: any) => d.name === dimName) : dimensions[dimName]);
      if (dimModel && dimModel.levels && dimModel.levels[`L${level}`]) {
        advice = dimModel.levels[`L${level}`].advice || dimModel.levels[`L${level}`].desc || "暂无建议";
      }
      dimResults.push({
        id: dimName,
        name: dimName,
        score: avg,
        level,
        advice
      });
    });
    // 计算综合能力
    let total = 0, weightSum = 0;
    Object.entries(questionnaire).forEach(([dimName, dimObj]: any) => {
      Object.entries(dimObj)
        .filter(([k]) => k.startsWith('Q'))
        .forEach(([qKey, q]: any) => {
          const v = Number(answers[`${dimName}_${qKey}`] || 0);
          total += v * (q.weight || 1) * (Number(dimObj.weight) || 1);
          weightSum += (q.weight || 1) * (Number(dimObj.weight) || 1);
        });
    });
    const avg = weightSum > 0 ? total / weightSum : 0;
    const level = Math.floor(avg);
    const finalAdvice = final.levels && final.levels[`L${level}`] ? final.levels[`L${level}`].advice || final.levels[`L${level}`].desc || "暂无建议" : "暂无建议";
    // 保存到本地
    const result = {
      dimResults,
      overall: {
        score: avg,
        level,
        advice: finalAdvice
      },
      answers,
      timestamp: Date.now()
    };
    localStorage.setItem("survey_result", JSON.stringify(result));
    router.push("/survey/result");
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
          {Object.entries(questionnaire).map(([dimName, dimObj]: any, idx: number) => (
            <div key={dimName} className="card-dark p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-perficient-white">
                  {dimName}
                </h2>
                <span className="bg-perficient-red text-perficient-white px-3 py-1 rounded-full text-sm font-medium">
                  权重 {dimObj.weight}
                </span>
              </div>
              
              {Object.entries(dimObj)
                .filter(([k]) => k.startsWith('Q'))
                .map(([qKey, q]: any, qIdx: number) => (
                  <div key={qKey} className="mb-8 p-6 border-l-4 border-perficient-red bg-gray-2 rounded-r-lg">
                    <div className="flex items-start justify-between mb-4">
                      <label className="block font-semibold text-perficient-white text-lg leading-relaxed">
                        {q.question}
                      </label>
                      <span className="bg-perficient-gold text-perficient-white px-2 py-1 rounded text-xs font-medium ml-4 flex-shrink-0">
                        权重 {q.weight}
                      </span>
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