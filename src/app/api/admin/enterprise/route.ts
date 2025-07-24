import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET: 查询所有企业或单个企业
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  let rows;
  if (id) {
    [rows] = await pool.query('SELECT * FROM enterprise WHERE id=?', [id]);
  } else {
    [rows] = await pool.query('SELECT * FROM enterprise');
  }
  let data = rows;
  if (Array.isArray(rows)) {
    data = rows.map((row: any) => ({
      ...row,
      info: row.info ? JSON.parse(row.info) : {},
      result: row.result ? JSON.parse(row.result) : null,
    }));
  }
  return NextResponse.json(data);
}

// POST: 新增企业
export async function POST(req: NextRequest) {
  const data = await req.json();
  const { name, info, result } = data;
  const [res]: any = await pool.query(
    'INSERT INTO enterprise (name, info, result) VALUES (?, ?, ?)',
    [name, JSON.stringify(info), JSON.stringify(result)]
  );
  // 获取插入id
  const insertId = res.insertId;
  return NextResponse.json({ success: true, id: insertId });
}

// PUT: 更新企业
export async function PUT(req: NextRequest) {
  const data = await req.json();
  const { id, name, info, result } = data;
  await pool.query(
    'UPDATE enterprise SET name=?, info=?, result=? WHERE id=?',
    [name, JSON.stringify(info), JSON.stringify(result), id]
  );
  return NextResponse.json({ success: true });
}

// DELETE: 删除企业
export async function DELETE(req: NextRequest) {
  const data = await req.json();
  const { id } = data;
  await pool.query('DELETE FROM enterprise WHERE id=?', [id]);
  return NextResponse.json({ success: true });
} 