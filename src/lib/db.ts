import mysql from 'mysql2/promise';

// 请根据实际情况修改以下配置
export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'db_config',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}); 