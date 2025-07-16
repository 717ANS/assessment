const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Section: 中小企业出海能力评估
  const section = await prisma.section.create({
    data: {
      name: '中小企业出海能力评估',
      weight: 1.0,
      subSections: {
        create: [
          // 1. 国际市场认知
          {
            name: '国际市场认知',
            weight: 1.1,
            questions: {
              create: [
                {
                  text: '企业对目标市场的了解程度如何？',
                  type: 'single',
                  options: JSON.stringify(['完全不了解', '有基本了解', '有较深了解', '有深入了解', '有专业研究']),
                  weight: 1.0
                },
                {
                  text: '是否有国际市场调研和分析能力？',
                  type: 'single',
                  options: JSON.stringify(['没有调研', '偶尔调研', '定期调研', '系统化调研', '专业调研分析']),
                  weight: 1.0
                },
                {
                  text: '国际市场信息收集渠道包括哪些？',
                  type: 'multiple',
                  options: JSON.stringify(['行业报告', '客户反馈', '竞争对手分析', '当地合作伙伴', '专业咨询机构']),
                  weight: 1.2
                }
              ]
            }
          },
          // 2. 产品国际化
          {
            name: '产品国际化',
            weight: 1.3,
            questions: {
              create: [
                {
                  text: '产品是否符合国际标准和认证要求？',
                  type: 'single',
                  options: JSON.stringify(['不符合', '部分符合', '基本符合', '完全符合', '超越标准']),
                  weight: 1.0
                },
                {
                  text: '是否有针对不同市场的产品本地化能力？',
                  type: 'single',
                  options: JSON.stringify(['没有本地化', '简单本地化', '部分本地化', '深度本地化', '完全本地化']),
                  weight: 1.0
                },
                {
                  text: '产品国际化策略包括哪些方面？',
                  type: 'multiple',
                  options: JSON.stringify(['技术标准适配', '文化习俗考虑', '法律法规遵循', '用户习惯优化', '品牌本土化']),
                  weight: 1.1
                }
              ]
            }
          },
          // 3. 供应链国际化
          {
            name: '供应链国际化',
            weight: 1.2,
            questions: {
              create: [
                {
                  text: '供应链是否具备国际化布局能力？',
                  type: 'single',
                  options: JSON.stringify(['没有布局', '初步布局', '部分布局', '较完善布局', '全球化布局']),
                  weight: 1.0
                },
                {
                  text: '是否有稳定的国际合作伙伴网络？',
                  type: 'single',
                  options: JSON.stringify(['没有伙伴', '少量伙伴', '一定数量伙伴', '较多伙伴', '广泛伙伴网络']),
                  weight: 1.0
                },
                {
                  text: '供应链国际化管理包括哪些要素？',
                  type: 'multiple',
                  options: JSON.stringify(['供应商评估', '物流优化', '库存管理', '质量控制', '成本控制']),
                  weight: 1.1
                }
              ]
            }
          },
          // 4. 人才国际化
          {
            name: '人才国际化',
            weight: 1.0,
            questions: {
              create: [
                {
                  text: '团队是否具备跨文化交流能力？',
                  type: 'single',
                  options: JSON.stringify(['不具备', '基本具备', '较好具备', '很好具备', '专业具备']),
                  weight: 1.0
                },
                {
                  text: '是否有国际化人才招聘和培养机制？',
                  type: 'single',
                  options: JSON.stringify(['没有机制', '简单机制', '基本机制', '完善机制', '先进机制']),
                  weight: 1.0
                },
                {
                  text: '国际化人才培养包括哪些方面？',
                  type: 'multiple',
                  options: JSON.stringify(['语言培训', '文化培训', '专业技能培训', '管理能力培训', '国际商务培训']),
                  weight: 1.2
                }
              ]
            }
          },
          // 5. 风险管控
          {
            name: '风险管控',
            weight: 1.4,
            questions: {
              create: [
                {
                  text: '是否建立了海外业务风险识别机制？',
                  type: 'single',
                  options: JSON.stringify(['没有机制', '简单识别', '基本识别', '系统识别', '全面识别']),
                  weight: 1.0
                },
                {
                  text: '是否有应对汇率、政治等风险的预案？',
                  type: 'single',
                  options: JSON.stringify(['没有预案', '简单预案', '基本预案', '完善预案', '全面预案']),
                  weight: 1.0
                },
                {
                  text: '海外风险管控体系包括哪些方面？',
                  type: 'multiple',
                  options: JSON.stringify(['政治风险', '汇率风险', '法律风险', '文化风险', '技术风险']),
                  weight: 1.3
                }
              ]
            }
          }
        ]
      }
    }
  });
  console.log('中小企业出海能力评估问卷已写入数据库');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 