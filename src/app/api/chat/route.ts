import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    // DeepSeek免费API配置
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
    const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'sk-1234567890abcdef'; // 请替换为实际的API密钥

    const messages = [
      {
        role: 'system',
        content: `你是一个专业的企业管理咨询顾问，专门为制造业企业提供业务能力成熟度评估和出海解决方案建议。请根据用户的问题提供专业、实用的建议。`
      },
      ...history,
      {
        role: 'user',
        content: message
      }
    ];

    const response = await fetch(DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
        stream: false
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content || '抱歉，我暂时无法回答您的问题。';

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Chat API error:', error);
    
    // 如果API调用失败，返回模拟响应
    const fallbackResponse = `您好！我是DeepSeek AI助手，专门为企业提供管理咨询服务。

由于当前API连接问题，我暂时无法提供实时回答。不过我可以为您提供一些通用的企业出海建议：

1. **市场调研先行**：深入了解目标市场的文化、法规、竞争环境
2. **产品本地化**：根据当地需求调整产品设计和功能
3. **建立本地团队**：招聘熟悉当地市场的专业人才
4. **合规管理**：确保符合当地法律法规要求
5. **风险控制**：建立完善的风险识别和应对机制

如需更详细的个性化建议，请稍后再试或联系我们的专业顾问团队。`;

    return NextResponse.json({ response: fallbackResponse });
  }
} 