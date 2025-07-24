import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET: 查询所有总结
export async function GET() {
  const [rows] = await pool.query('SELECT * FROM overall');
  return NextResponse.json(rows);
}

// POST: 新增总结
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { grade, coreStrategy, keyActions } = data;
  const [result] = await pool.query(
    'INSERT INTO overall (grade, coreStrategy, keyActions) VALUES (?, ?, ?)',
    [grade, JSON.stringify(coreStrategy), JSON.stringify(keyActions)]
  );
  return NextResponse.json({ success: true });
}

// PUT: 更新总结
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, grade, coreStrategy, keyActions } = data;
  await pool.query(
    'UPDATE overall SET grade=?, coreStrategy=?, keyActions=? WHERE id=?',
    [grade, JSON.stringify(coreStrategy), JSON.stringify(keyActions), id]
  );
  return NextResponse.json({ success: true });
}

// DELETE: 删除总结
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  await pool.query('DELETE FROM overall WHERE id=?', [id]);
  return NextResponse.json({ success: true });
} 