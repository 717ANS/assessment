import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import type { ResultSetHeader } from 'mysql2';

// GET: 查询所有能力维度
export async function GET() {
  const [rows] = await pool.query('SELECT * FROM dimension');
  return NextResponse.json(rows);
}

// POST: 新增能力维度
export async function POST(req: NextRequest) {
  const data = await req.json();
  const keys = [
    'dimension',
    'core_capability', 'weight',
    'definition_L1', 'strategy_and_plan_L1',
    'definition_L2', 'strategy_and_plan_L2',
    'definition_L3', 'strategy_and_plan_L3',
    'definition_L4', 'strategy_and_plan_L4',
    'definition_L5', 'strategy_and_plan_L5',
  ];
  const values = keys.map(k => data[k] || '');
  const [result] = await pool.query(
    `INSERT INTO dimension (${keys.join(',')}) VALUES (${keys.map(() => '?').join(',')})`,
    values
  );
  const insertId = (result as ResultSetHeader).insertId;
  return NextResponse.json({ id: insertId, ...data });
}

// PUT: 更新能力维度
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, ...rest } = data;
  const keys = [
    'core_capability', 'weight',
    'definition_L1', 'strategy_and_plan_L1',
    'definition_L2', 'strategy_and_plan_L2',
    'definition_L3', 'strategy_and_plan_L3',
    'definition_L4', 'strategy_and_plan_L4',
    'definition_L5', 'strategy_and_plan_L5',
  ];
  const values = keys.map(k => rest[k] || '');
  await pool.query(
    `UPDATE dimension SET ${keys.map(k => `${k}=?`).join(',')} WHERE id=?`,
    [...values, id]
  );
  return NextResponse.json({ success: true });
}

// DELETE: 删除能力维度（带问卷级联删除提醒）
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id, confirmCascade } = data;
  // 先查出dimension字段
  const [dimRows] = await pool.query('SELECT dimension FROM dimension WHERE id=?', [id]);
  if (!Array.isArray(dimRows) || dimRows.length === 0) {
    return NextResponse.json({ error: '能力维度不存在' }, { status: 404 });
  }
  const dimensionValue = (dimRows as any)[0].dimension;
  // 查问卷数量
  const [qRows] = await pool.query('SELECT COUNT(*) as cnt FROM questionnaire WHERE dimension=?', [dimensionValue]);
  const qCount = (qRows as any)[0]?.cnt || 0;
  if (!confirmCascade && qCount > 0) {
    return NextResponse.json({
      error: '该能力维度下存在问卷',
      cascadeCount: qCount,
      message: `该能力维度下有${qCount}条问卷，将一并删除，是否确认？`
    }, { status: 400 });
  }
  // 先删问卷
  await pool.query('DELETE FROM questionnaire WHERE dimension=?', [dimensionValue]);
  // 再删维度
  await pool.query('DELETE FROM dimension WHERE id=?', [id]);
  return NextResponse.json({ success: true });
} 