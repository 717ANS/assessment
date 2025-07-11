# 制造业企业能力成熟度评估系统

基于Next.js、TypeScript和Tailwind CSS构建的现代化企业能力评估平台，提供业务能力成熟度评估和出海能力成熟度评估功能。

## 🚀 功能特色

### 📊 评估功能
- **业务能力成熟度评估**：评估企业在战略、运营、市场、技术、组织等五大维度的成熟度
- **出海能力成熟度评估**：专门针对中小企业国际化发展需求的能力评估
- **科学权重系统**：不同维度和问题具有差异化权重，确保评估结果更准确
- **多种题型**：支持单选题和多选题，提供更全面的评估维度

### 🤖 AI智能助手
- **DeepSeek AI对话**：基于DeepSeek大模型的专业企业管理咨询服务
- **智能化出海解决方案**：根据评估结果提供个性化的出海建议
- **实时对话**：支持多轮对话，提供持续咨询服务

### 💾 数据管理
- **临时保存功能**：问卷结果自动保存到本地存储
- **结果分析**：详细的得分分析和成熟度等级判定
- **个性化建议**：基于评估结果提供针对性发展建议

## 🛠️ 技术栈

- **前端框架**：Next.js 14 (App Router)
- **开发语言**：TypeScript
- **样式框架**：Tailwind CSS
- **AI服务**：DeepSeek API
- **数据存储**：LocalStorage

## 📦 安装和运行

### 1. 克隆项目
```bash
git clone <repository-url>
cd nextjs
```

### 2. 安装依赖
```bash
npm install
```

### 3. 配置环境变量
创建 `.env.local` 文件并添加以下配置：
```env
# DeepSeek API配置
DEEPSEEK_API_KEY=your_actual_api_key_here
```

### 4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔧 API配置

### DeepSeek API设置
1. 访问 [DeepSeek平台](https://platform.deepseek.com/)
2. 注册账号并获取API密钥
3. 将API密钥添加到 `.env.local` 文件中
4. 重启开发服务器

### API密钥获取步骤
1. 登录DeepSeek平台
2. 进入API管理页面
3. 创建新的API密钥
4. 复制密钥并配置到环境变量中

## 📱 页面结构

- `/` - 首页，展示系统介绍和功能入口
- `/survey` - 业务能力成熟度评估问卷
- `/globalization-survey` - 出海能力成熟度评估问卷

## 🎯 使用流程

1. **完成评估问卷**：选择相应的评估类型，填写问卷
2. **查看评估结果**：获得详细的得分分析和成熟度等级
3. **获取AI建议**：使用DeepSeek AI助手获取专业建议
4. **个性化解决方案**：基于评估结果获取出海解决方案

## 🔒 数据安全

- 所有问卷数据仅保存在用户本地浏览器中
- 不会向第三方服务器传输个人数据
- AI对话内容仅用于提供咨询服务

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📞 支持

如有问题或建议，请通过以下方式联系：
- 提交GitHub Issue
- 发送邮件至项目维护者

---

**注意**：本项目仅供学习和研究使用，实际部署时请确保符合相关法律法规要求。
