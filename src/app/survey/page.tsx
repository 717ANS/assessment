"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveSurveyResult, SurveyResult } from "@/lib/storage";

interface Question {
  text: string;
  type: 'single' | 'multiple';
  options: string[];
  weight: number;
}

interface Dimension {
  name: string;
  questions: Question[];
  weight: number;
}

const DIMENSIONS: Dimension[] = [
  {
    name: "战略与领导力",
    weight: 1.2,
    questions: [
      {
        text: "企业是否有清晰的战略规划？",
        type: 'single',
        options: ['完全没有', '有初步规划', '有详细规划', '有完整规划并定期更新', '有完整规划且有执行跟踪'],
        weight: 1.0
      },
      {
        text: "高层是否积极推动业务创新？",
        type: 'single',
        options: ['不重视', '偶尔关注', '有一定重视', '积极推动', '非常重视且有具体措施'],
        weight: 1.0
      },
      {
        text: "企业是否建立了有效的决策机制？",
        type: 'multiple',
        options: ['有明确的决策流程', '有风险评估机制', '有快速响应机制', '有跨部门协调机制', '有决策效果评估'],
        weight: 1.2
      }
    ],
  },
  {
    name: "生产与运营管理",
    weight: 1.0,
    questions: [
      {
        text: "生产流程是否标准化、数字化？",
        type: 'single',
        options: ['完全手工操作', '部分标准化', '基本标准化', '高度标准化', '完全数字化和智能化'],
        weight: 1.0
      },
      {
        text: "是否有持续改进机制？",
        type: 'single',
        options: ['没有', '偶尔改进', '定期改进', '系统化改进', '持续优化且有创新'],
        weight: 1.0
      },
      {
        text: "质量管理体系如何？",
        type: 'multiple',
        options: ['有基本质量标准', '有质量检测流程', '有质量改进机制', '有质量文化', '有质量创新'],
        weight: 1.1
      }
    ],
  },
  {
    name: "市场与客户",
    weight: 1.1,
    questions: [
      {
        text: "是否定期收集客户反馈？",
        type: 'single',
        options: ['从不收集', '偶尔收集', '定期收集', '系统化收集', '主动收集并有分析'],
        weight: 1.0
      },
      {
        text: "市场拓展能力如何？",
        type: 'single',
        options: ['没有拓展', '被动拓展', '主动拓展', '有计划拓展', '战略性拓展'],
        weight: 1.0
      },
      {
        text: "客户关系管理方面有哪些措施？",
        type: 'multiple',
        options: ['有客户档案', '有客户服务流程', '有客户满意度调查', '有客户忠诚度计划', '有客户价值分析'],
        weight: 1.1
      }
    ],
  },
  {
    name: "技术与创新",
    weight: 1.3,
    questions: [
      {
        text: "企业是否有研发投入？",
        type: 'single',
        options: ['没有投入', '少量投入', '有一定投入', '较大投入', '大量投入且有成果'],
        weight: 1.0
      },
      {
        text: "新技术应用能力如何？",
        type: 'single',
        options: ['不应用新技术', '偶尔应用', '积极应用', '领先应用', '创新应用'],
        weight: 1.0
      },
      {
        text: "创新机制包括哪些方面？",
        type: 'multiple',
        options: ['有创新激励机制', '有创新项目管理', '有创新人才培养', '有创新成果转化', '有创新文化建设'],
        weight: 1.2
      }
    ],
  },
  {
    name: "组织与人才",
    weight: 1.0,
    questions: [
      {
        text: "员工培训是否体系化？",
        type: 'single',
        options: ['没有培训', '偶尔培训', '有基本培训', '有体系化培训', '有完整的培训发展体系'],
        weight: 1.0
      },
      {
        text: "人才激励机制是否完善？",
        type: 'single',
        options: ['没有激励', '基本激励', '有一定激励', '较完善激励', '完善的激励体系'],
        weight: 1.0
      },
      {
        text: "组织文化建设包括哪些方面？",
        type: 'multiple',
        options: ['有企业价值观', '有团队协作文化', '有学习型组织建设', '有员工关怀机制', '有社会责任意识'],
        weight: 1.1
      }
    ],
  },
];

export default function SurveyPage() {
  const [answers, setAnswers] = useState<(number | number[])[][]>(
    DIMENSIONS.map(d => d.questions.map(() => d.questions[0].type === 'multiple' ? [] : 0))
  );
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  const handleSingleChange = (dimIdx: number, qIdx: number, value: number) => {
    setAnswers(prev => {
      const copy = prev.map(arr => [...arr]);
      copy[dimIdx][qIdx] = value;
      return copy;
    });
  };

  const handleMultipleChange = (dimIdx: number, qIdx: number, value: number) => {
    setAnswers(prev => {
      const copy = prev.map(arr => [...arr]);
      const currentAnswers = Array.isArray(copy[dimIdx][qIdx]) ? copy[dimIdx][qIdx] as number[] : [];
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value];
      copy[dimIdx][qIdx] = newAnswers;
      return copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    
    // 保存问卷结果
    const result: SurveyResult = {
      type: 'business',
      answers: answers,
      score: totalScore,
      maxScore: maxPossibleScore,
      percentage: percentage,
      maturity: maturity,
      timestamp: Date.now()
    };
    
    saveSurveyResult(result);
  };

  const calculateScore = () => {
    let totalScore = 0;
    let maxPossibleScore = 0;

    DIMENSIONS.forEach((dim, dimIdx) => {
      dim.questions.forEach((question, qIdx) => {
        const answer = answers[dimIdx][qIdx];
        const questionWeight = question.weight;
        const dimensionWeight = dim.weight;

        if (question.type === 'single') {
          const score = answer as number;
          totalScore += score * questionWeight * dimensionWeight;
          maxPossibleScore += 5 * questionWeight * dimensionWeight;
        } else {
          const selectedOptions = answer as number[];
          const score = selectedOptions.length;
          totalScore += score * questionWeight * dimensionWeight;
          maxPossibleScore += question.options.length * questionWeight * dimensionWeight;
        }
      });
    });

    return { totalScore, maxPossibleScore };
  };

  const { totalScore, maxPossibleScore } = calculateScore();
  const percentage = (totalScore / maxPossibleScore) * 100;
  const maturity = percentage > 80 ? "高" : percentage > 60 ? "中" : "低";

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">制造业企业业务能力成熟度问卷</h1>
      <p className="mb-8 text-gray-600 text-center">本问卷用于评估企业在战略、运营、市场、技术、组织等方面的成熟度。请根据实际情况选择最符合的选项。</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {DIMENSIONS.map((dim, dimIdx) => (
          <div key={dim.name} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-blue-800">{dim.name}</h2>
            {dim.questions.map((question, qIdx) => (
              <div key={`${dimIdx}-${qIdx}`} className="mb-6 p-4 border-l-4 border-blue-200 bg-gray-50">
                <label className="block mb-3 font-medium text-gray-800">
                  {question.text}
                  <span className="text-sm text-gray-500 ml-2">
                    {question.type === 'multiple' ? '(可多选)' : '(单选)'}
                  </span>
                </label>
                
                {question.type === 'single' ? (
                  <div className="space-y-2">
                    {question.options.map((option, optionIdx) => (
                      <label key={optionIdx} className="flex items-center gap-3 p-2 hover:bg-blue-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name={`q-${dimIdx}-${qIdx}`}
                          value={optionIdx + 1}
                          checked={answers[dimIdx][qIdx] === optionIdx + 1}
                          onChange={() => handleSingleChange(dimIdx, qIdx, optionIdx + 1)}
                          required
                          className="text-blue-600"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {question.options.map((option, optionIdx) => (
                      <label key={optionIdx} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          value={optionIdx + 1}
                          checked={Array.isArray(answers[dimIdx][qIdx]) && (answers[dimIdx][qIdx] as number[]).includes(optionIdx + 1)}
                          onChange={() => handleMultipleChange(dimIdx, qIdx, optionIdx + 1)}
                          className="text-green-600"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                )}
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
          <a
            href="/"
            className="inline-block bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-lg"
          >
            返回主页
          </a>
        </div>
      </form>

      {submitted && (
        <div className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <h3 className="text-2xl font-bold mb-4 text-center">评估结果</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{Math.round(percentage)}%</div>
              <div className="text-lg text-gray-600">综合得分率</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{maturity}</div>
              <div className="text-lg text-gray-600">成熟度等级</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">详细得分：</h4>
            <p>加权总分：{totalScore.toFixed(1)} / {maxPossibleScore.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-2">（仅供参考，具体以企业实际情况为准）</p>
            <div className="mt-4 text-center">
              <a
                href="/"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                返回主页查看完整结果
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 