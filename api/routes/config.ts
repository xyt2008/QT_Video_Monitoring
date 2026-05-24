
import express from 'express';
import db from '../db.js';

const router = express.Router();

// 获取所有配置
router.get('/', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM Config');
    const configs = stmt.all();
    const config = {} as Record<string, string>;
    configs.forEach((item: any) => {
      config[item.Key] = item.Value;
    });
    res.json(config);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

// 更新配置
router.put('/', (req, res) => {
  try {
    const configs = req.body;
    const updateStmt = db.prepare('UPDATE Config SET Value = ? WHERE Key = ?');
    const insertStmt = db.prepare('INSERT INTO Config (Key, Value) VALUES (?, ?)');

    Object.entries(configs).forEach(([key, value]) => {
      const result = updateStmt.run(value, key);
      if (result.changes === 0) {
        insertStmt.run(key, value);
      }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

export default router;
