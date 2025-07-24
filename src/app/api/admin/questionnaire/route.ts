import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

// GET: 查询所有问卷
export async function GET() {
  const [rows] = await pool.query('SELECT * FROM questionnaire');
  return NextResponse.json(rows);
}

// POST: 新增问卷
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5 } = data;
  // 校验dimension是否存在于能力维度表（dimension表的dimension字段）
  const [dimRows] = await pool.query('SELECT id FROM dimension WHERE dimension=?', [dimension]);
  if (!Array.isArray(dimRows) || dimRows.length === 0) {
    return NextResponse.json({ error: '能力维度不存在，无法添加问卷。' }, { status: 400 });
  }
  const [result] = await pool.query(
    'INSERT INTO questionnaire (dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5]
  );
  const insertId = (result as ResultSetHeader).insertId;
  return NextResponse.json({ id: insertId, ...data });
}

// PUT: 更新问卷
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5 } = data;
  // 校验dimension是否存在于能力维度表（dimension表的dimension字段）
  const [dimRows] = await pool.query('SELECT id FROM dimension WHERE dimension=?', [dimension]);
  if (!Array.isArray(dimRows) || dimRows.length === 0) {
    return NextResponse.json({ error: '能力维度不存在，无法更新问卷。' }, { status: 400 });
  }
  await pool.query(
    'UPDATE questionnaire SET dimension=?, question=?, weight=?, option_L1=?, option_L2=?, option_L3=?, option_L4=?, option_L5=? WHERE id=?',
    [dimension, question, weight, option_L1, option_L2, option_L3, option_L4, option_L5, id]
  );
  return NextResponse.json({ success: true });
}

// DELETE: 删除问卷
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  await pool.query('DELETE FROM questionnaire WHERE id=?', [id]);
  return NextResponse.json({ success: true });
} 