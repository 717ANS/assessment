"use client";
import { useState, useEffect, useRef } from "react";
import ChatDialog from "@/components/ChatDialog";
import { getSurveyResults, SurveyResult, clearSurveyResults } from "@/lib/storage";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState(false);
  const [solutionMessage, setSolutionMessage] = useState("");
  const [surveyResults, setSurveyResults] = useState<SurveyResult[]>([]);
  // 新增：导航栏隐藏逻辑
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  // 优化建议锚点
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 获取保存的问卷结果
    const results = getSurveyResults();
    setSurveyResults(results);
  }, []);

  // 新增：监听滚动实现导航栏隐藏
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY < 10) {
        setShowNav(true);
      } else if (currentY > lastScrollY.current) {
        setShowNav(false); // 下滑隐藏
      } else {
        setShowNav(true); // 上滑显示
      }
      lastScrollY.current = currentY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-0 px-4">
      {/* 顶部导航栏 */}
      <nav
        ref={navRef}
        className={`w-full fixed top-0 left-0 z-50 transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'} bg-white/60 backdrop-blur-md shadow-sm`}
        style={{ WebkitBackdropFilter: 'blur(12px)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between h-16 px-4">
          <a href="/" className="text-xl font-bold text-blue-700">能力成熟度评估</a>
          <div className="flex space-x-6 items-center">
            <a href="/" className="text-gray-700 hover:text-blue-600 font-medium">首页</a>
            <a href="/survey" className="text-gray-700 hover:text-blue-600 font-medium">业务能力评估</a>
            <a href="/globalization-survey" className="text-gray-700 hover:text-green-600 font-medium">出海能力评估</a>
            {/* 新增：优化建议按钮 */}
            <button
              onClick={() => suggestionRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="text-gray-700 hover:text-orange-600 font-medium px-2 py-1 rounded transition-colors"
            >
              优化建议
            </button>
            <button onClick={() => setIsChatOpen(true)} className="text-gray-700 hover:text-purple-600 font-medium">AI助手</button>
          </div>
        </div>
      </nav>
      <div className="max-w-4xl mx-auto pt-24">
        {/* 系统特点与流程介绍 */}
        <section className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">制造业企业能力成熟度评估系统</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-center mb-8">基于科学的评估模型，帮助企业全面了解自身能力水平，为战略决策提供数据支撑</p>
          
          {/* 评估流程介绍 */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">评估流程</h3>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-blue-600 font-bold">A</span>
                </div>
                <span className="text-sm text-gray-600 text-center">业务能力<br/>成熟度评估</span>
              </div>
              <div className="hidden md:block">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 text-center">查看<br/>评估结果</span>
              </div>
              <div className="hidden md:block">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-green-600 font-bold">B</span>
                </div>
                <span className="text-sm text-gray-600 text-center">出海能力<br/>成熟度评估</span>
              </div>
              <div className="hidden md:block">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 text-center">查看<br/>评估结果</span>
              </div>
              <div className="hidden md:block">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600 text-center">获取<br/>优化建议</span>
              </div>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">科学评估</h4>
              <p className="text-gray-600 text-sm">基于成熟的评估模型，确保评估结果的科学性和可靠性</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">快速评估</h4>
              <p className="text-gray-600 text-sm">简洁的问卷设计，10分钟内即可完成评估，获得即时结果</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">智能建议</h4>
              <p className="text-gray-600 text-sm">根据评估结果提供个性化的发展建议和改进方向</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-8 mb-4">
            <a href="/survey" className="flex-1 bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-center text-lg">业务能力成熟度评估</a>
            <a href="/globalization-survey" className="flex-1 bg-green-600 text-white px-6 py-4 rounded-lg hover:bg-green-700 transition-colors font-medium text-center text-lg">出海能力成熟度评估</a>
          </div>
        </section>

        {/* 优化建议模块 */}
        <div ref={suggestionRef} className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">优化建议</h3>
          
          {/* 评估记录结果 */}
          {surveyResults.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">评估记录结果</h4>
              <div className="grid md:grid-cols-2 gap-6">
                {surveyResults.map((result, index) => (
                  <div key={index} className="border rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="text-lg font-semibold text-gray-900">
                        {result.type === 'business' ? '业务能力成熟度评估' : '出海能力成熟度评估'}
                      </h5>
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
                      <a
                        href={result.type === 'business' ? '/survey/result' : '/globalization-survey/result'}
                        className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm text-center"
                      >
                        查看详细结果
                      </a>
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
                        获取AI建议
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* 能力可视化展示 */}
              {surveyResults.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">能力可视化展示</h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    {surveyResults.map((result, index) => {
                      // 取维度名和得分
                      let dimensions: { name: string; score: number }[] = [];
                      if (result.type === 'business') {
                        // 业务能力：从本地数据库结构推断维度名
                        // 假设每个section为一个维度，得分为每个section的得分率
                        // 这里只能用综合得分率做占位，实际应从详细分数中获取
                        dimensions = [
                          { name: '战略与领导力', score: result.percentage },
                          { name: '生产与运营管理', score: result.percentage },
                          { name: '市场与客户', score: result.percentage },
                          { name: '技术与创新', score: result.percentage },
                          { name: '组织与人才', score: result.percentage },
                        ];
                      } else {
                        // 出海能力：五大维度
                        dimensions = [
                          { name: '国际市场认知', score: result.percentage },
                          { name: '产品国际化', score: result.percentage },
                          { name: '供应链国际化', score: result.percentage },
                          { name: '人才国际化', score: result.percentage },
                          { name: '风险管控', score: result.percentage },
                        ];
                      }
                      return (
                        <div key={index} className="border rounded-lg p-4 bg-white">
                          <h5 className="font-semibold text-gray-900 mb-3 text-center">
                            {result.type === 'business' ? '业务能力分析' : '出海能力分析'}
                          </h5>
                          {/* 圆形进度图 */}
                          <div className="flex justify-center mb-4">
                            <div className="relative w-32 h-32">
                              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                {/* 背景圆环 */}
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  stroke="#e5e7eb"
                                  strokeWidth="8"
                                  fill="none"
                                />
                                {/* 进度圆环 */}
                                <circle
                                  cx="60"
                                  cy="60"
                                  r="50"
                                  stroke={result.percentage >= 80 ? "#10b981" : result.percentage >= 60 ? "#f59e0b" : "#ef4444"}
                                  strokeWidth="8"
                                  fill="none"
                                  strokeDasharray={`${2 * Math.PI * 50}`}
                                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - result.percentage / 100)}`}
                                  strokeLinecap="round"
                                  className="transition-all duration-1000"
                                />
                              </svg>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-gray-900">{Math.round(result.percentage)}%</div>
                                  <div className="text-xs text-gray-600">得分率</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* 能力等级指示器 */}
                          <div className="text-center mb-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMaturityColor(result.maturity)}`}>
                              {result.maturity}等级
                            </span>
                          </div>
                          
                          {/* 能力维度条形图 */}
                          <div className="space-y-2">
                            {dimensions.map((dim, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs">
                                <span>{dim.name}</span>
                                <div className="flex-1 mx-2">
                                  <div className="bg-gray-200 rounded-full h-2">
                                    <div
                                      className={result.type === 'business' ? 'bg-blue-500 h-2 rounded-full transition-all duration-1000' : 'bg-green-500 h-2 rounded-full transition-all duration-1000'}
                                      style={{ width: `${Math.round(dim.score)}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <span>{Math.round(dim.score)}%</span>
                              </div>
                            ))}
                          </div>
                          
                          {/* 快速建议 */}
                          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <div className="text-xs text-gray-600">
                              {result.maturity === '高' ? '💪 表现优秀，建议保持优势并探索新机会' :
                               result.maturity === '中' ? '📈 有提升空间，建议重点突破关键领域' :
                               '🚀 需要加强，建议系统化提升基础能力'}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 固定建议 */}
          <div className="mb-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">基础优化建议</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h5 className="font-semibold text-blue-700 mb-2">业务能力提升建议</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 建立标准化管理流程</li>
                  <li>• 加强人才培养和团队建设</li>
                  <li>• 推进数字化转型</li>
                  <li>• 优化供应链管理</li>
                  <li>• 提升客户服务质量</li>
                </ul>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h5 className="font-semibold text-green-700 mb-2">出海能力提升建议</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 加强国际市场调研</li>
                  <li>• 提升产品国际化水平</li>
                  <li>• 建立国际合作伙伴网络</li>
                  <li>• 培养国际化人才</li>
                  <li>• 完善风险管控体系</li>
                </ul>
              </div>
            </div>
          </div>

          {/* AI功能跳转 */}
          <div className="text-center">
            <p className="text-gray-600 mb-4">需要更个性化的建议？我们的AI助手可以为您提供专业的定制化建议</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => setIsChatOpen(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                咨询AI助手
              </button>
              <button
                onClick={handleSolutionClick}
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                获取出海解决方案
              </button>
            </div>
          </div>
        </div>

        {/* AI助手和出海解决方案 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI智能助手</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
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
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
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
