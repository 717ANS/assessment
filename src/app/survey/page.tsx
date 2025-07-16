"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { saveSurveyResult, SurveyResult } from "@/lib/storage";
import { useRouter } from "next/navigation";

interface Question {
  id: number;
  text: string;
  type: 'single' | 'multiple' | 'text';
  options?: string[];
  weight: number;
}

interface SubSection {
  id: number;
  name: string;
  weight: number;
  questions: Question[];
}

interface Section {
  id: number;
  name: string;
  weight: number;
  subSections: SubSection[];
}

export default function SurveyPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/questions")
      .then(res => res.json())
      .then(data => {
        setSections(data.sections);
        setLoading(false);
      });
  }, []);

  // 生成唯一key
  const getKey = (sectionId: number, subId: number, qId: number) => `${sectionId}_${subId}_${qId}`;

  const handleChange = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const handleMultiChange = (key: string, value: string) => {
    setAnswers(prev => {
      const arr = Array.isArray(prev[key]) ? prev[key] : [];
      return {
        ...prev,
        [key]: arr.includes(value) ? arr.filter((v: string) => v !== value) : [...arr, value]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // 计算分数
    let totalScore = 0;
    let maxScore = 0;
    // 构造 answersMatrix: (number | number[])[][]
    const answersMatrix: (number | number[])[][] = sections.map(section =>
      section.subSections.map(sub =>
        sub.questions.map(q => {
          const key = getKey(section.id, sub.id, q.id);
          if (q.type === 'single') {
            return Number(answers[key] || 0);
          } else if (q.type === 'multiple') {
            return Array.isArray(answers[key]) ? answers[key].map((v: string) => v) : [];
          } else {
            return answers[key] || '';
          }
        })
      )
    );
    sections.forEach(section => {
      section.subSections.forEach(sub => {
        sub.questions.forEach(q => {
          const key = getKey(section.id, sub.id, q.id);
          if (q.type === 'single') {
            const score = Number(answers[key] || 0);
            totalScore += score * q.weight * section.weight * sub.weight;
            maxScore += 5 * q.weight * section.weight * sub.weight;
          } else if (q.type === 'multiple') {
            const arr = Array.isArray(answers[key]) ? answers[key] : [];
            totalScore += arr.length * q.weight * section.weight * sub.weight;
            maxScore += (q.options?.length || 0) * q.weight * section.weight * sub.weight;
          } else if (q.type === 'text') {
            // 填空题不计分
          }
        });
      });
    });
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
    const maturity = percentage > 80 ? "高" : percentage > 60 ? "中" : "低";
    const result: SurveyResult = {
      type: 'business',
      answers: answersMatrix,
      score: totalScore,
      maxScore,
      percentage,
      maturity,
      timestamp: Date.now()
    };
    saveSurveyResult(result);
    router.push("/survey/result");
  };

  if (loading) {
    return <div className="text-center py-20 text-gray-500">正在加载题库...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">制造业企业业务能力成熟度问卷</h1>
      <p className="mb-8 text-gray-600 text-center">本问卷用于评估企业在战略、运营、市场、技术、组织等方面的成熟度。请根据实际情况选择最符合的选项。</p>
      <form onSubmit={handleSubmit} className="space-y-8">
        {sections.map(section => (
          <div key={section.id} className="border rounded-lg p-6 bg-white shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">{section.name} <span className="text-xs text-gray-400 ml-2">(权重 {section.weight})</span></h2>
            {section.subSections.map(sub => (
              <div key={sub.id} className="mb-6">
                <h3 className="font-semibold mb-2 text-blue-600">{sub.name} <span className="text-xs text-gray-400">(权重 {sub.weight})</span></h3>
                {sub.questions.map(q => {
                  const key = getKey(section.id, sub.id, q.id);
                  return (
                    <div key={q.id} className="mb-4 p-4 border-l-4 border-blue-200 bg-gray-50">
                      <label className="block mb-2 font-medium text-gray-800">
                        {q.text}
                        <span className="text-sm text-gray-500 ml-2">
                          {q.type === 'multiple' ? '(可多选)' : q.type === 'single' ? '(单选)' : '(填空)'}
                        </span>
                        <span className="ml-2 text-xs text-gray-400">权重 {q.weight}</span>
                      </label>
                      {q.type === 'single' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                              <input
                                type="radio"
                                name={key}
                                value={idx + 1}
                                checked={answers[key] === String(idx + 1) || answers[key] === idx + 1}
                                onChange={() => handleChange(key, idx + 1)}
                                required
                                className="text-blue-600"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === 'multiple' && q.options && (
                        <div className="space-y-2">
                          {q.options.map((option, idx) => (
                            <label key={idx} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded cursor-pointer">
                              <input
                                type="checkbox"
                                value={option}
                                checked={Array.isArray(answers[key]) && answers[key].includes(option)}
                                onChange={() => handleMultiChange(key, option)}
                                className="text-green-600"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {q.type === 'text' && (
                        <textarea
                          className="w-full border rounded p-2 mt-1"
                          rows={2}
                          value={answers[key] || ''}
                          onChange={e => handleChange(key, e.target.value)}
                          placeholder="请输入您的答案..."
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        ))}
        <div className="text-center space-x-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
          >
            提交评估
          </button>
          <Link
            href="/"
            className="inline-block bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-lg"
          >
            返回主页
          </Link>
        </div>
      </form>
    </div>
  );
} 