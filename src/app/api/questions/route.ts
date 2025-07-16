import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const sections = await prisma.section.findMany({
      include: {
        subSections: {
          include: {
            questions: true
          }
        }
      }
    });

    // 格式化options为数组
    const formatted = sections.map(section => ({
      id: section.id,
      name: section.name,
      weight: section.weight,
      subSections: section.subSections.map(sub => ({
        id: sub.id,
        name: sub.name,
        weight: sub.weight,
        questions: sub.questions.map(q => ({
          id: q.id,
          text: q.text,
          type: q.type,
          options: q.options ? JSON.parse(q.options) : undefined,
          weight: q.weight
        }))
      }))
    }));

    return NextResponse.json({ sections: formatted });
  } catch (error) {
    return NextResponse.json({ error: '获取题库失败', detail: String(error) }, { status: 500 });
  }
} 