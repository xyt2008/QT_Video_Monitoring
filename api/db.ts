
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 使用现有的 VM.db 或创建新的
const dbPath = path.join(__dirname, '../file/VM.db');
const db = new Database(dbPath);

// 初始化数据库表
function initDatabase() {
  // NVR表
  db.exec(`
    CREATE TABLE IF NOT EXISTS NVRInfo (
      NVRID TEXT PRIMARY KEY,
      NVRName TEXT,
      NVRIP TEXT,
      NVRPort INTEGER DEFAULT 8000,
      NVRUsername TEXT,
      NVRPassword TEXT,
      NVRUse TEXT DEFAULT '启用'
    )
  `);

  // IPC表
  db.exec(`
    CREATE TABLE IF NOT EXISTS IPCInfo (
      IPCID TEXT PRIMARY KEY,
      NVRID TEXT,
      IPCName TEXT,
      IPCIP TEXT,
      IPCRtspAddrMain TEXT,
      IPCRtspAddrSub TEXT,
      IPCUse TEXT DEFAULT '启用'
    )
  `);

  // 配置表
  db.exec(`
    CREATE TABLE IF NOT EXISTS Config (
      Key TEXT PRIMARY KEY,
      Value TEXT
    )
  `);

  // 插入默认配置
  const defaultConfigs = [
    { key: 'AppTitle', value: '智能视频监控系统' },
    { key: 'AppStyle', value: '蓝色' },
    { key: 'RtspType', value: '0' },
    { key: 'VideoType', value: '16' },
    { key: 'RtspAddr16', value: '||||||||||||||||' }
  ];

  const insertConfig = db.prepare('INSERT OR IGNORE INTO Config (Key, Value) VALUES (?, ?)');
  defaultConfigs.forEach(config => {
    insertConfig.run(config.key, config.value);
  });
}

initDatabase();

export default db;
