"use client";
import { useState, useEffect } from "react";
import ChatDialog from "@/components/ChatDialog";
import { getSurveyResults, SurveyResult, clearSurveyResults } from "@/lib/storage";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [solutionMessage, setSolutionMessage] = useState("");
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);

  useEffect(() => {
    // 获取保存的问卷结果
    const results = getSurveyResults();
    setSurveyResults(results);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMaturityColor = (maturity: string) => {
    switch (maturity) {
      case '高': return 'text-green-600 bg-green-100';
      case '中': return 'text-yellow-600 bg-yellow-100';
      case '低': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleSolutionClick = () => {
    const results = getSurveyResults();
    const businessResult = results.find(r => r.type === 'business');
    const globalizationResult = results.find(r => r.type === 'globalization');

    let initialMessage = "您好！我是DeepSeek AI助手，专门为企业提供出海解决方案建议。\n\n";

    if (businessResult && globalizationResult) {
      initialMessage += `根据您的评估结果，我为您提供以下分析：\n\n`;
      initialMessage += `**业务能力成熟度评估结果：**\n`;
      initialMessage += `- 综合得分率：${Math.round(businessResult.percentage)}%\n`;
      initialMessage += `- 成熟度等级：${businessResult.maturity}\n\n`;
      initialMessage += `**出海能力成熟度评估结果：**\n`;
      initialMessage += `- 综合得分率：${Math.round(globalizationResult.percentage)}%\n`;
      initialMessage += `- 成熟度等级：${globalizationResult.maturity}\n\n`;
      initialMessage += `基于您的评估结果，我将为您提供个性化的企业出海解决方案建议。请告诉我您最关心的具体问题或目标市场。`;
    } else if (businessResult) {
      initialMessage += `我看到您已完成业务能力成熟度评估（得分率：${Math.round(businessResult.percentage)}%，等级：${businessResult.maturity}）。\n\n`;
      initialMessage += `为了提供更精准的出海建议，建议您也完成出海能力成熟度评估。或者您可以先告诉我您的出海目标和关注点。`;
    } else if (globalizationResult) {
      initialMessage += `我看到您已完成出海能力成熟度评估（得分率：${Math.round(globalizationResult.percentage)}%，等级：${globalizationResult.maturity}）。\n\n`;
      initialMessage += `为了提供更全面的建议，建议您也完成业务能力成熟度评估。或者您可以先告诉我您的具体需求。`;
    } else {
      initialMessage += `我注意到您还没有完成评估问卷。为了提供更精准的出海解决方案建议，建议您先完成以下评估：\n\n`;
      initialMessage += `1. **业务能力成熟度评估** - 了解企业整体能力水平\n`;
      initialMessage += `2. **出海能力成熟度评估** - 评估国际化发展能力\n\n`;
      initialMessage += `完成评估后，我将基于您的具体情况提供个性化的出海建议。`;
    }

    setSolutionMessage(initialMessage);
    setIsSolutionOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            制造业企业能力成熟度评估系统
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            基于科学的评估模型，帮助企业全面了解自身能力水平，为战略决策提供数据支撑
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">业务能力成熟度评估</h2>
            </div>
            <p className="text-gray-600 mb-6">
              评估企业在战略与领导力、生产与运营管理、市场与客户、技术与创新、组织与人才等五大维度的成熟度水平。
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                战略与领导力评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                生产与运营管理评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                市场与客户评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                技术与创新评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                组织与人才评估
              </div>
            </div>
            <a
              href="/survey"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              开始评估
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">出海能力成熟度评估</h2>
            </div>
            <p className="text-gray-600 mb-6">
              专门针对中小企业国际化发展需求，评估国际市场认知、产品国际化、供应链国际化、人才国际化、风险管控等能力。
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                国际市场认知评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                产品国际化评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                供应链国际化评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                人才国际化评估
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                风险管控评估
              </div>
            </div>
            <a
              href="/globalization-survey"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              开始评估
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">系统特色</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">科学评估</h4>
              <p className="text-gray-600 text-sm">基于成熟的评估模型，确保评估结果的科学性和可靠性</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">快速评估</h4>
              <p className="text-gray-600 text-sm">简洁的问卷设计，10分钟内即可完成评估，获得即时结果</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">智能建议</h4>
              <p className="text-gray-600 text-sm">根据评估结果提供个性化的发展建议和改进方向</p>
            </div>
                  </div>
      </div>

      {/* 已完成的问卷结果 */}
      {surveyResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">评估结果记录</h3>
          <div className="grid md:grid-cols-2 gap-6">
            {surveyResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-900">
                    {result.type === 'business' ? '业务能力成熟度评估' : '出海能力成熟度评估'}
                  </h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMaturityColor(result.maturity)}`}>
                    {result.maturity}等级
                  </span>
                </div>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">综合得分率：</span>
                    <span className="font-semibold text-blue-600">{Math.round(result.percentage)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">加权总分：</span>
                    <span className="font-semibold">{result.score.toFixed(1)} / {result.maxScore.toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">评估时间：</span>
                    <span className="text-sm text-gray-500">{formatDate(result.timestamp)}</span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      if (result.type === 'business') {
                        window.location.href = '/survey';
                      } else {
                        window.location.href = '/globalization-survey';
                      }
                    }}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    重新评估
                  </button>
                  <button
                                       onClick={() => {
                     let message = `基于您的${result.type === 'business' ? '业务能力' : '出海能力'}评估结果（得分率：${Math.round(result.percentage)}%，等级：${result.maturity}），我为您提供以下分析：\n\n`;
                      
                      if (result.type === 'business') {
                        message += `**业务能力成熟度分析：**\n`;
                        message += `- 综合得分率：${Math.round(result.percentage)}%\n`;
                        message += `- 成熟度等级：${result.maturity}\n\n`;
                        message += `**建议：**\n`;
                        if (result.maturity === '低') {
                          message += `建议重点提升基础管理能力，建立标准化流程，加强人才培养。`;
                        } else if (result.maturity === '中') {
                          message += `建议深化数字化转型，优化运营效率，提升创新能力。`;
                        } else {
                          message += `建议进一步优化资源配置，探索新的增长机会，保持竞争优势。`;
                        }
                      } else {
                        message += `**出海能力成熟度分析：**\n`;
                        message += `- 综合得分率：${Math.round(result.percentage)}%\n`;
                        message += `- 成熟度等级：${result.maturity}\n\n`;
                        message += `**建议：**\n`;
                        if (result.maturity === '低') {
                          message += `建议先加强国际市场调研，提升产品国际化水平，建立基础的国际合作网络。`;
                        } else if (result.maturity === '中') {
                          message += `建议深化供应链国际化布局，加强人才培养，完善风险管控体系。`;
                        } else {
                          message += `建议进一步优化全球资源配置，提升品牌国际影响力。`;
                        }
                      }
                      
                      setSolutionMessage(message);
                      setIsSolutionOpen(true);
                    }}
                    className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
                  >
                    获取建议
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {surveyResults.length === 2 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
              <p className="text-blue-800 font-medium">
                🎉 恭喜！您已完成所有评估。点击下方按钮获取综合出海解决方案建议。
              </p>
              <button
                onClick={handleSolutionClick}
                className="mt-3 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                获取综合出海解决方案
              </button>
            </div>
          )}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                if (confirm('确定要清除所有评估结果吗？此操作不可恢复。')) {
                  clearSurveyResults();
                  setSurveyResults([]);
                }
              }}
              className="text-red-600 hover:text-red-800 text-sm underline"
            >
              清除所有评估结果
            </button>
          </div>
        </div>
      )}

      {/* AI助手和出海解决方案 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI智能助手</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">DeepSeek AI助手</h4>
              <p className="text-gray-600 text-sm mb-4">基于DeepSeek大模型，为您提供专业的企业管理咨询服务</p>
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                开始对话
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">智能化出海解决方案</h4>
              <p className="text-gray-600 text-sm mb-4">基于您的评估结果，提供个性化的企业出海解决方案建议</p>
              <button
                onClick={handleSolutionClick}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                获取解决方案
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Dialog */}
      <ChatDialog
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialMessage="您好！我是DeepSeek AI助手，专门为企业提供管理咨询服务。我可以帮助您解答关于企业能力评估、管理优化、出海策略等方面的问题。请告诉我您需要什么帮助？"
      />

      {/* Solution Dialog */}
      <ChatDialog
        isOpen={isSolutionOpen}
        onClose={() => setIsSolutionOpen(false)}
        initialMessage={solutionMessage}
      />
    </div>
  );
}
