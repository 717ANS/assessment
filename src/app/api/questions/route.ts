import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // 1. 读取 dimension 表
    const [dimensionsRows] = await pool.query('SELECT * FROM dimension');
    // 2. 读取 overall 表（final）
    const [overallRows] = await pool.query('SELECT * FROM overall');
    // 3. 读取 questionnaire 表
    const [questionnaireRows] = await pool.query('SELECT * FROM questionnaire');

    // 组装 dimensions
    const dimensions: any = {};
    for (const row of dimensionsRows as any[]) {
      dimensions[row.dimension] = row;
    }

    // 组装 final（总结）
    const final = { 总结: (overallRows as any[]).map(row => ({
      成熟度: row.grade,
      核心策略: row.coreStrategy ? JSON.parse(row.coreStrategy) : [],
      关键行动: row.keyActions ? JSON.parse(row.keyActions) : [],
    })) };

    // 组装 questionnaire
    // 假设 questionnaire 表结构为：id, dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5
    const questionnaire: any = {};
    for (const row of questionnaireRows as any[]) {
      if (!questionnaire[row.dimension]) questionnaire[row.dimension] = { weight: 1 };
      const qKey = `Q${row.id}`;
      questionnaire[row.dimension][qKey] = {
        question: row.question,
        option: [
          { L1: row.option_L1 },
          { L2: row.option_L2 },
          { L3: row.option_L3 },
          { L4: row.option_L4 },
          { L5: row.option_L5 },
        ],
        weight: row.weight,
      };
    }
    return NextResponse.json({ dimensions, final, questionnaire });
  } catch (error) {
    return NextResponse.json({ error: '读取题库数据失败', detail: String(error) }, { status: 500 });
  }
} 