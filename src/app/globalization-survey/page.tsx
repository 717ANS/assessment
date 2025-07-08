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

const GLOBALIZATION_DIMENSIONS: Dimension[] = [
  {
    name: "国际市场认知",
    weight: 1.1,
    questions: [
      {
        text: "企业对目标市场的了解程度如何？",
        type: 'single',
        options: ['完全不了解', '有基本了解', '有较深了解', '有深入了解', '有专业研究'],
        weight: 1.0
      },
      {
        text: "是否有国际市场调研和分析能力？",
        type: 'single',
        options: ['没有调研', '偶尔调研', '定期调研', '系统化调研', '专业调研分析'],
        weight: 1.0
      },
      {
        text: "国际市场信息收集渠道包括哪些？",
        type: 'multiple',
        options: ['行业报告', '客户反馈', '竞争对手分析', '当地合作伙伴', '专业咨询机构'],
        weight: 1.2
      }
    ],
  },
  {
    name: "产品国际化",
    weight: 1.3,
    questions: [
      {
        text: "产品是否符合国际标准和认证要求？",
        type: 'single',
        options: ['不符合', '部分符合', '基本符合', '完全符合', '超越标准'],
        weight: 1.0
      },
      {
        text: "是否有针对不同市场的产品本地化能力？",
        type: 'single',
        options: ['没有本地化', '简单本地化', '部分本地化', '深度本地化', '完全本地化'],
        weight: 1.0
      },
      {
        text: "产品国际化策略包括哪些方面？",
        type: 'multiple',
        options: ['技术标准适配', '文化习俗考虑', '法律法规遵循', '用户习惯优化', '品牌本土化'],
        weight: 1.1
      }
    ],
  },
  {
    name: "供应链国际化",
    weight: 1.2,
    questions: [
      {
        text: "供应链是否具备国际化布局能力？",
        type: 'single',
        options: ['没有布局', '初步布局', '部分布局', '较完善布局', '全球化布局'],
        weight: 1.0
      },
      {
        text: "是否有稳定的国际合作伙伴网络？",
        type: 'single',
        options: ['没有伙伴', '少量伙伴', '一定数量伙伴', '较多伙伴', '广泛伙伴网络'],
        weight: 1.0
      },
      {
        text: "供应链国际化管理包括哪些要素？",
        type: 'multiple',
        options: ['供应商评估', '物流优化', '库存管理', '质量控制', '成本控制'],
        weight: 1.1
      }
    ],
  },
  {
    name: "人才国际化",
    weight: 1.0,
    questions: [
      {
        text: "团队是否具备跨文化交流能力？",
        type: 'single',
        options: ['不具备', '基本具备', '较好具备', '很好具备', '专业具备'],
        weight: 1.0
      },
      {
        text: "是否有国际化人才招聘和培养机制？",
        type: 'single',
        options: ['没有机制', '简单机制', '基本机制', '完善机制', '先进机制'],
        weight: 1.0
      },
      {
        text: "国际化人才培养包括哪些方面？",
        type: 'multiple',
        options: ['语言培训', '文化培训', '专业技能培训', '管理能力培训', '国际商务培训'],
        weight: 1.2
      }
    ],
  },
  {
    name: "风险管控",
    weight: 1.4,
    questions: [
      {
        text: "是否建立了海外业务风险识别机制？",
        type: 'single',
        options: ['没有机制', '简单识别', '基本识别', '系统识别', '全面识别'],
        weight: 1.0
      },
      {
        text: "是否有应对汇率、政治等风险的预案？",
        type: 'single',
        options: ['没有预案', '简单预案', '基本预案', '完善预案', '全面预案'],
        weight: 1.0
      },
      {
        text: "海外风险管控体系包括哪些方面？",
        type: 'multiple',
        options: ['政治风险', '汇率风险', '法律风险', '文化风险', '技术风险'],
        weight: 1.3
      }
    ],
  },
];

export default function GlobalizationSurveyPage() {
  const [answers, setAnswers] = useState<(number | number[])[][]>(
    GLOBALIZATION_DIMENSIONS.map(d => d.questions.map(() => d.questions[0].type === 'multiple' ? [] : 0))
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
      type: 'globalization',
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

    GLOBALIZATION_DIMENSIONS.forEach((dim, dimIdx) => {
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

  const getRecommendations = () => {
    if (maturity === "低") {
      return "建议先加强国际市场调研，提升产品国际化水平，建立基础的国际合作网络。";
    } else if (maturity === "中") {
      return "建议深化供应链国际化布局，加强人才培养，完善风险管控体系。";
    } else {
      return "企业出海能力较强，建议进一步优化全球资源配置，提升品牌国际影响力。";
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-4 text-center">中小企业出海能力成熟度评估</h1>
      <p className="mb-8 text-gray-600 text-center">本问卷专门评估中小企业在国际化发展方面的能力成熟度，涵盖市场认知、产品国际化、供应链、人才、风险管控等维度。请根据实际情况选择最符合的选项。</p>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {GLOBALIZATION_DIMENSIONS.map((dim, dimIdx) => (
          <div key={dim.name} className="border rounded-lg p-6 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-green-800">{dim.name}</h2>
            {dim.questions.map((question, qIdx) => (
              <div key={`${dimIdx}-${qIdx}`} className="mb-6 p-4 border-l-4 border-green-200 bg-gray-50">
                <label className="block mb-3 font-medium text-gray-800">
                  {question.text}
                  <span className="text-sm text-gray-500 ml-2">
                    {question.type === 'multiple' ? '(可多选)' : '(单选)'}
                  </span>
                </label>
                
                {question.type === 'single' ? (
                  <div className="space-y-2">
                    {question.options.map((option, optionIdx) => (
                      <label key={optionIdx} className="flex items-center gap-3 p-2 hover:bg-green-50 rounded cursor-pointer">
                        <input
                          type="radio"
                          name={`gq-${dimIdx}-${qIdx}`}
                          value={optionIdx + 1}
                          checked={answers[dimIdx][qIdx] === optionIdx + 1}
                          onChange={() => handleSingleChange(dimIdx, qIdx, optionIdx + 1)}
                          required
                          className="text-green-600"
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
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium text-lg"
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
        <div className="mt-8 p-6 border rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <h3 className="text-2xl font-bold mb-4 text-center">出海能力评估结果</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{Math.round(percentage)}%</div>
              <div className="text-lg text-gray-600">综合得分率</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">{maturity}</div>
              <div className="text-lg text-gray-600">出海能力等级</div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-white rounded-lg">
            <h4 className="font-semibold mb-2">详细得分：</h4>
            <p>加权总分：{totalScore.toFixed(1)} / {maxPossibleScore.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-2">（仅供参考，具体以企业实际情况为准）</p>
          </div>
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">发展建议：</h4>
            <p className="text-sm">{getRecommendations()}</p>
            <div className="mt-4 text-center">
              <a
                href="/"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
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