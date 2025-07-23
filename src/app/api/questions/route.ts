import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    const dataDir = path.join(process.cwd(), 'src', 'data');
    const [dimensionRaw, finalRaw, questionnaireRaw] = await Promise.all([
      fs.readFile(path.join(dataDir, 'dimension.json'), 'utf-8'),
      fs.readFile(path.join(dataDir, 'final.json'), 'utf-8'),
      fs.readFile(path.join(dataDir, 'questionnaire.json'), 'utf-8'),
    ]);
    const dimensions = JSON.parse(dimensionRaw);
    const final = JSON.parse(finalRaw);
    const questionnaire = JSON.parse(questionnaireRaw);
    return NextResponse.json({ dimensions, final, questionnaire });
  } catch (error) {
    return NextResponse.json({ error: '读取题库数据失败', detail: String(error) }, { status: 500 });
  }
} 