"use client";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

export default function SurveyResultPage({ onlySummary }: { onlySummary?: boolean } = {}) {
  const [result, setResult] = useState<any>(null);
  const [questionnaire, setQuestionnaire] = useState<any[]>([]);
  const [dimensions, setDimensions] = useState<any[]>([]);
  const [final, setFinal] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const local = localStorage.getItem("survey_result");
    if (!local) {
      router.replace("/survey");
      return;
    }
    setResult(JSON.parse(local));
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setQuestionnaire(data.questionnaire);
        setDimensions(data.dimensions);
        setFinal(data.final);
        setLoading(false);
      });
  }, [router]);

  // 重新计算分数
  const levelScore: Record<string, number> = { L1: 1, L2: 2, L3: 3, L4: 4, L5: 5 };
  // 维度得分与建议（用 useMemo 保证每次都是新数组）
  const dimResults = useMemo(() => {
    if (!result) return [];
    const arr: any[] = [];
    const dimKeys = Object.keys(dimensions);
    Object.entries(questionnaire).forEach(([dimName, dimObj]: any) => {
      let total = 0, weightSum = 0;
      Object.entries(dimObj)
        .filter(([k]) => k.startsWith('Q'))
        .forEach(([qKey, q]: any) => {
          const answerLevel = result.answers[`${dimName}_${qKey}`];
          const score = levelScore[answerLevel] || 0;
          const qWeight = Number(q.weight) || 1;
          total += score * qWeight;
          weightSum += qWeight;
        });
      const avg = weightSum > 0 ? total / weightSum : 0;
      const level = Math.floor(avg);
      // 匹配 dimension.json 里的维度对象
      let dimModel = dimensions[dimName];
      if (!dimModel) {
        // 尝试模糊匹配
        const foundIdx = dimKeys.findIndex(key =>
          key === dimName ||
          key.replace(/能力$/, '') === dimName.replace(/能力$/, '') ||
          dimName.includes(key) ||
          key.includes(dimName)
        );
        if (foundIdx !== -1) dimModel = dimensions[dimKeys[foundIdx] as keyof typeof dimensions];
      }
      let adviceObj = null;
      if (dimModel && Array.isArray(dimModel.分级)) {
        adviceObj = dimModel.分级.find((item: any) => {
          const match = typeof item.等级 === 'string' && item.等级.match(/^L\d+/);
          return match && match[0] === `L${level}`;
        });
      }
      arr.push({
        id: dimName,
        name: dimName,
        score: avg,
        level,
        adviceObj
      });
    });
    return arr;
  }, [questionnaire, result, dimensions]);

  const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

  if (loading || !result) return <div className="text-center py-20 text-gray-500">正在加载结果...</div>;
  // 综合得分
  let total = 0, weightSum = 0;
  Object.entries(questionnaire).forEach(([dimName, dimObj]: any) => {
    Object.entries(dimObj)
      .filter(([k]) => k.startsWith('Q'))
      .forEach(([qKey, q]: any) => {
        const answerLevel = result.answers[`${dimName}_${qKey}`];
        const score = levelScore[answerLevel] || 0;
        const qWeight = Number(q.weight) || 1;
        const dimWeight = Number(dimObj.weight) || 1;
        total += score * qWeight * dimWeight;
        weightSum += qWeight * dimWeight;
      });
  });
  const overallScore = weightSum > 0 ? total / weightSum : 0;
  const overallLevel = Math.floor(overallScore);
  
  // 更新result.overall并保存到localStorage
  if (result && (result.overall.score !== overallScore || result.overall.level !== overallLevel)) {
    const updatedResult = {
      ...result,
      overall: {
        ...result.overall,
        score: overallScore,
        level: overallLevel
      }
    };
    localStorage.setItem("survey_result", JSON.stringify(updatedResult));
    setResult(updatedResult);
  }
  
  // 综合建议（final.json 总结）
  let overallAdviceObj = null;
  if (final.总结 && Array.isArray(final.总结)) {
    overallAdviceObj = final.总结.find((item: any) => item.成熟度 === `L${overallLevel}`);
  }

  if (onlySummary) {
    return (
      <div className="">
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 text-perficient-white">综合建议</h2>
          {overallAdviceObj ? (
            <div className="p-6 bg-gray-2 border-l-4 border-perficient-red text-light-gray rounded cursor-pointer hover:bg-gray-1 transition-shadow" onClick={() => window.location.href = '/survey/result'} title="点击查看详细评估结果">
              <div className="mb-3 font-semibold text-perficient-red text-lg">{overallAdviceObj.成熟度} 综合建议</div>
              <div className="mb-3">
                <span className="font-semibold text-perficient-gold">核心策略：</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {overallAdviceObj.核心策略?.map((s: string, idx: number) => (
                    <li key={idx} className="text-light-gray">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-perficient-gold">关键行动：</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {overallAdviceObj.关键行动?.map((s: string, idx: number) => (
                    <li key={idx} className="text-light-gray" dangerouslySetInnerHTML={{__html: s}} />
                  ))}
                </ul>
              </div>
              <div className="text-center text-sm text-medium-gray mt-4 pt-4 border-t border-gray-3">点击查看详细评估结果</div>
            </div>
          ) : (
            <div className="p-6 bg-gray-2 border-l-4 border-perficient-red text-light-gray rounded">暂无建议</div>
          )}
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
            <a href="/survey" className="text-perficient-white hover:text-perficient-red font-medium transition-colors">能力评估</a>
            <a href="/survey/result" className="text-perficient-red font-medium">评估结果</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto pt-20 px-6 pb-12">
        {/* 左上角返回按钮 */}
        <div className="mb-6">
          <a href="/">
            <button className="btn-skew">
              <span>返回主页</span>
            </button>
          </a>
        </div>
        
        <h1 className="text-4xl font-bold mb-8 text-center text-perficient-white">能力成熟度评估结果</h1>
        
        {/* 雷达图展示 */}
        <div className="mb-10 card-dark p-8">
          <h3 className="text-2xl font-bold mb-6 text-perficient-white text-center">能力雷达图</h3>
          <RadarChart
            data={dimResults.map(d => ({
              name: d.name,
              actual: d.score / 5, // 归一化到0~1
              recommend: 0.7 // 推荐指数可自定义
            }))}
          />
        </div>
        
        {/* 综合得分 */}
        <div className="mb-10 card-dark p-8 text-center">
          <div className="flex justify-center items-center space-x-12">
            <div>
              <span className="text-xl font-semibold text-perficient-white">综合得分：</span>
              <span className="text-4xl text-perficient-red font-bold ml-2">{overallScore.toFixed(2)}</span>
            </div>
            <div className="w-px h-16 bg-gray-3"></div>
            <div>
              <span className="text-xl font-semibold text-perficient-white">综合等级：</span>
              <span className="text-4xl text-perficient-gold font-bold ml-2">L{overallLevel}</span>
            </div>
          </div>
        </div>
        
        {/* 综合建议 */}
        <div className="mb-10 card-dark p-8">
          <h2 className="text-2xl font-bold mb-6 text-perficient-white">综合建议</h2>
          {overallAdviceObj ? (
            <div className="p-6 bg-gray-2 border-l-4 border-perficient-red text-light-gray rounded">
              <div className="mb-4 font-semibold text-perficient-red text-xl">{overallAdviceObj.成熟度} 综合建议</div>
              <div className="mb-4">
                <span className="font-semibold text-perficient-gold">核心策略：</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {overallAdviceObj.核心策略?.map((s: string, idx: number) => (
                    <li key={idx} className="text-light-gray">{s}</li>
                  ))}
                </ul>
              </div>
              <div>
                <span className="font-semibold text-perficient-gold">关键行动：</span>
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  {overallAdviceObj.关键行动?.map((s: string, idx: number) => (
                    <li key={idx} className="text-light-gray" dangerouslySetInnerHTML={{__html: s}} />
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 bg-gray-2 border-l-4 border-perficient-red text-light-gray rounded">暂无建议</div>
          )}
        </div>
        
        {/* 各维度得分与建议 */}
        <div className="mb-10 card-dark p-8">
          <h2 className="text-2xl font-bold mb-6 text-perficient-white">各维度得分与建议</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-3 text-sm">
              <thead>
                <tr className="bg-gray-2">
                  <th className="border border-gray-3 px-4 py-3 text-left font-semibold text-perficient-white">维度</th>
                  <th className="border border-gray-3 px-4 py-3 text-center font-semibold text-perficient-white">得分</th>
                  <th className="border border-gray-3 px-4 py-3 text-center font-semibold text-perficient-white">等级</th>
                  <th className="border border-gray-3 px-4 py-3 text-left font-semibold text-perficient-white">定义</th>
                  <th className="border border-gray-3 px-4 py-3 text-left font-semibold text-perficient-white">策略与方案</th>
                </tr>
              </thead>
              <tbody>
                {dimResults.map((d: any, i: number) => (
                  <tr key={d.id || i} className={d.level < 3 ? "bg-red-900/20" : ""}>
                    <td className="border border-gray-3 px-4 py-3 font-semibold text-perficient-white">{d.name}</td>
                    <td className="border border-gray-3 px-4 py-3 text-center text-perficient-red font-semibold">{d.score.toFixed(2)}</td>
                    <td className="border border-gray-3 px-4 py-3 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        d.level >= 4 ? 'bg-green-900/30 text-green-300' :
                        d.level >= 3 ? 'bg-blue-900/30 text-blue-300' :
                        'bg-red-900/30 text-red-300'
                      }`}>
                        {d.adviceObj?.等级 || `L${d.level}`}
                      </span>
                    </td>
                    <td className="border border-gray-3 px-4 py-3 text-light-gray">{d.adviceObj?.定义 || "-"}</td>
                    <td className="border border-gray-3 px-4 py-3 text-light-gray" dangerouslySetInnerHTML={{__html: d.adviceObj?.策略与方案 || "-"}} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* 缺陷项 */}
        <div className="mb-10 card-dark p-8">
          <h2 className="text-2xl font-bold mb-6 text-red-400">缺陷项（等级低于L3）</h2>
          {dimResults.filter((d: any) => d.level < 3).length === 0 ? (
            <div className="text-green-400 text-lg font-medium">暂无明显缺陷，整体表现良好！</div>
          ) : (
            <ul className="list-disc pl-6 space-y-2">
              {dimResults.filter((d: any) => d.level < 3).map((d: any) => (
                <li key={d.id} className="text-red-400 font-semibold text-lg">{d.name}（等级：L{d.level}）</li>
              ))}
            </ul>
          )}
        </div>
        
        {/* 返回按钮 */}
        <div className="text-center space-x-6">
          <a href="/">
            <button className="btn-skew">
              <span>返回主页</span>
            </button>
          </a>
          <a href="/survey">
            <button className="btn-skew">
              <span>重新评估</span>
            </button>
          </a>
        </div>
      </div>
    </div>
  );
} 