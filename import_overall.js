const fs = require('fs');
const mysql = require('mysql2/promise');

async function main() {
  const data = require('./src/data/final.json').总结;
  const pool = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'db_config',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
  for (const item of data) {
    await pool.query(
      'INSERT INTO overall (grade, coreStrategy, keyActions) VALUES (?, ?, ?)',
      [
        item.成熟度,
        JSON.stringify(item.核心策略),
        JSON.stringify(item.关键行动),
      ]
    );
  }
  await pool.end();
  console.log('导入完成');
}

main().catch(e => { console.error(e); process.exit(1); }); 