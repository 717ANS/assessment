import { PrismaClient, QuestionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Section 1
  const section1 = await prisma.section.create({
    data: {
      name: '战略与领导力',
      weight: 1.2,
      subSections: {
        create: [
          {
            name: '战略规划',
            weight: 1.0,
            questions: {
              create: [
                {
                  text: '企业是否有清晰的战略规划？',
                  type: 'single',
                  options: JSON.stringify(['完全没有', '有初步规划', '有详细规划', '有完整规划并定期更新', '有完整规划且有执行跟踪']),
                  weight: 1.0
                },
                {
                  text: '高层是否积极推动业务创新？',
                  type: 'single',
                  options: JSON.stringify(['不重视', '偶尔关注', '有一定重视', '积极推动', '非常重视且有具体措施']),
                  weight: 1.0
                },
                {
                  text: '请简述企业的核心战略目标。',
                  type: 'text',
                  weight: 1.2
                }
              ]
            }
          },
          {
            name: '决策机制',
            weight: 1.1,
            questions: {
              create: [
                {
                  text: '企业是否建立了有效的决策机制？',
                  type: 'multiple',
                  options: JSON.stringify(['有明确的决策流程', '有风险评估机制', '有快速响应机制', '有跨部门协调机制', '有决策效果评估']),
                  weight: 1.2
                }
              ]
            }
          }
        ]
      }
    }
  });

  // Section 2
  const section2 = await prisma.section.create({
    data: {
      name: '生产与运营管理',
      weight: 1.0,
      subSections: {
        create: [
          {
            name: '流程与改进',
            weight: 1.0,
            questions: {
              create: [
                {
                  text: '生产流程是否标准化、数字化？',
                  type: 'single',
                  options: JSON.stringify(['完全手工操作', '部分标准化', '基本标准化', '高度标准化', '完全数字化和智能化']),
                  weight: 1.0
                },
                {
                  text: '是否有持续改进机制？',
                  type: 'single',
                  options: JSON.stringify(['没有', '偶尔改进', '定期改进', '系统化改进', '持续优化且有创新']),
                  weight: 1.0
                },
                {
                  text: '质量管理体系如何？',
                  type: 'multiple',
                  options: JSON.stringify(['有基本质量标准', '有质量检测流程', '有质量改进机制', '有质量文化', '有质量创新']),
                  weight: 1.1
                }
              ]
            }
          }
        ]
      }
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 