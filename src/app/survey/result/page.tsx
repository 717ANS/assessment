"use client";
import { useEffect, useState } from "react";
import { getSurveyResultByType } from "@/lib/storage";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const RadarChart = dynamic(() => import("@/components/RadarChart"), { ssr: false });

interface SectionScore {
  name: string;
  actual: number;
  recommend: number;
}

export default function SurveyResultPage() {
  const [sectionScores, setSectionScores] = useState<SectionScore[]>([]);
  const [detail, setDetail] = useState<any[]>([]);
  const [maturity, setMaturity] = useState("");
  const [percentage, setPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 获取最新业务能力评估结果
    const result = getSurveyResultByType("business");
    if (!result) {
      router.replace("/survey");
      return;
    }
    // 解析详细分数
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        const sections = data.sections;
        const answers = result.answers; // 这是 (number | number[])[][] 格式
        let scores: SectionScore[] = [];
        let details: any[] = [];
        
        sections.forEach((section: any, sectionIdx: number) => {
          let actualSum = 0, maxSum = 0;
          section.subSections.forEach((sub: any, subIdx: number) => {
            sub.questions.forEach((q: any, qIdx: number) => {
              // 使用正确的二维数组索引访问
              const answer = (answers as any)[sectionIdx]?.[subIdx]?.[qIdx];
              
              if (q.type === 'single') {
                const score = Number(answer || 0);
                actualSum += score * q.weight * section.weight * sub.weight;
                maxSum += 5 * q.weight * section.weight * sub.weight;
                details.push({
                  section: section.name,
                  sub: sub.name,
                  question: q.text,
                  score,
                  max: 5,
                  weight: q.weight,
                  type: q.type
                });
              } else if (q.type === 'multiple') {
                const arr = Array.isArray(answer) ? answer : [];
                actualSum += arr.length * q.weight * section.weight * sub.weight;
                maxSum += (q.options?.length || 0) * q.weight * section.weight * sub.weight;
                details.push({
                  section: section.name,
                  sub: sub.name,
                  question: q.text,
                  score: arr.length,
                  max: q.options?.length || 0,
                  weight: q.weight,
                  type: q.type
                });
              }
            });
          });
          const actual = maxSum > 0 ? actualSum / maxSum : 0;
          scores.push({
            name: section.name,
            actual,
            recommend: 0.7 // 推荐指数
          });
        });
        setSectionScores(scores);
        setDetail(details);
        setMaturity(result.maturity);
        setPercentage(result.percentage);
        setLoading(false);
      });
  }, [router]);

  if (loading) return <div className="text-center py-20 text-gray-500">正在加载结果...</div>;

  // 缺陷项：实际得分率低于0.7的项目
  const defectItems = sectionScores.filter(s => s.actual < 0.7);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">业务能力成熟度评估结果</h1>
      <div className="mb-8">
        <RadarChart data={sectionScores} />
      </div>
      <div className="mb-8 text-center">
        <span className="text-lg font-semibold">综合得分率：</span>
        <span className="text-2xl text-blue-600 font-bold">{Math.round(percentage)}%</span>
        <span className="ml-6 text-lg font-semibold">成熟度等级：</span>
        <span className="text-2xl text-green-600 font-bold">{maturity}</span>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">详细成绩</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">大板块</th>
                <th className="border px-2 py-1">小板块</th>
                <th className="border px-2 py-1">题目</th>
                <th className="border px-2 py-1">得分</th>
                <th className="border px-2 py-1">满分</th>
                <th className="border px-2 py-1">权重</th>
              </tr>
            </thead>
            <tbody>
              {detail.map((d, i) => (
                <tr key={i} className={d.score / d.max < 0.7 ? "bg-red-50" : ""}>
                  <td className="border px-2 py-1">{d.section}</td>
                  <td className="border px-2 py-1">{d.sub}</td>
                  <td className="border px-2 py-1">{d.question}</td>
                  <td className="border px-2 py-1 text-center">{d.score}</td>
                  <td className="border px-2 py-1 text-center">{d.max}</td>
                  <td className="border px-2 py-1 text-center">{d.weight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2 text-red-600">有缺陷的项目（得分率低于70%）</h2>
        {defectItems.length === 0 ? (
          <div className="text-green-600">暂无明显缺陷，整体表现良好！</div>
        ) : (
          <ul className="list-disc pl-6">
            {defectItems.map((item, idx) => (
              <li key={idx} className="text-red-600 font-semibold">{item.name}（实际指数：{Math.round(item.actual * 100)}%，推荐指数：70%）</li>
            ))}
          </ul>
        )}
      </div>
      <div className="text-center">
        <a href="/" className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">返回主页</a>
      </div>
    </div>
  );
} 