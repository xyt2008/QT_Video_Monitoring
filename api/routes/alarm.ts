
import express from 'express';
import db from '../db.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// 获取报警列表
router.get('/list', (req, res) => {
  try {
    const { limit = 20, offset = 0, handled } = req.query;
    let query = 'SELECT * FROM AlarmInfo';
    const params: string[] = [];

    if (handled !== undefined) {
      query += ' WHERE HandleStatus = ?';
      params.push(handled === 'true' ? '已处理' : '未处理');
    }

    query += ' ORDER BY AlarmTime DESC LIMIT ? OFFSET ?';
    params.push(String(limit), String(offset));

    const stmt = db.prepare(query);
    const alarms = stmt.all(...params);
    res.json({ alarms, total: alarms.length });
  } catch (error) {
    console.error('Error fetching alarm list:', error);
    res.status(500).json({ error: 'Failed to fetch alarm list' });
  }
});

// 获取单个报警详情
router.get('/:alarmId', (req, res) => {
  try {
    const { alarmId } = req.params;

    // 获取报警信息
    const alarmStmt = db.prepare('SELECT * FROM AlarmInfo WHERE AlarmID = ?');
    const alarm = alarmStmt.get(alarmId);

    if (!alarm) {
      return res.status(404).json({ error: 'Alarm not found' });
    }

    // 获取报警图片
    const imageStmt = db.prepare('SELECT * FROM AlarmImage WHERE AlarmID = ?');
    const images = imageStmt.all(alarmId);

    // 获取报警视频
    const videoStmt = db.prepare('SELECT * FROM AlarmVideo WHERE AlarmID = ?');
    const videos = videoStmt.all(alarmId);

    res.json({ alarm, images, videos });
  } catch (error) {
    console.error('Error fetching alarm details:', error);
    res.status(500).json({ error: 'Failed to fetch alarm details' });
  }
});

// 新增报警
router.post('/', (req, res) => {
  try {
    const { IPCID, AlarmType, AlarmDesc, AlarmLevel = '普通', VideoPath, ImagePath } = req.body;
    const AlarmID = uuidv4();
    const AlarmTime = new Date().toISOString();

    const stmt = db.prepare(
      'INSERT INTO AlarmInfo (AlarmID, IPCID, AlarmType, AlarmTime, AlarmDesc, AlarmLevel, VideoPath, ImagePath, HandleStatus) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(AlarmID, IPCID, AlarmType, AlarmTime, AlarmDesc, AlarmLevel, VideoPath, ImagePath, '未处理');

    // 如果有图片路径，添加到图片表
    if (ImagePath) {
      const imageStmt = db.prepare(
        'INSERT INTO AlarmImage (ImageID, AlarmID, ImagePath, CreateTime) VALUES (?, ?, ?, ?)'
      );
      imageStmt.run(uuidv4(), AlarmID, ImagePath, AlarmTime);
    }

    // 如果有视频路径，添加到视频表
    if (VideoPath) {
      const videoStmt = db.prepare(
        'INSERT INTO AlarmVideo (VideoID, AlarmID, VideoPath, VideoDuration, CreateTime) VALUES (?, ?, ?, ?, ?)'
      );
      videoStmt.run(uuidv4(), AlarmID, VideoPath, 30, AlarmTime);
    }

    res.json({ success: true, alarmId: AlarmID });
  } catch (error) {
    console.error('Error creating alarm:', error);
    res.status(500).json({ error: 'Failed to create alarm' });
  }
});

// 处理报警
router.put('/:alarmId/handle', (req, res) => {
  try {
    const { alarmId } = req.params;
    const { HandleDesc } = req.body;
    const HandleTime = new Date().toISOString();

    const stmt = db.prepare(
      'UPDATE AlarmInfo SET HandleStatus = ?, HandleDesc = ?, HandleTime = ? WHERE AlarmID = ?'
    );
    stmt.run('已处理', HandleDesc, HandleTime, alarmId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling alarm:', error);
    res.status(500).json({ error: 'Failed to handle alarm' });
  }
});

// 删除报警
router.delete('/:alarmId', (req, res) => {
  try {
    const { alarmId } = req.params;

    // 删除相关的图片和视频
    const deleteImages = db.prepare('DELETE FROM AlarmImage WHERE AlarmID = ?');
    deleteImages.run(alarmId);

    const deleteVideos = db.prepare('DELETE FROM AlarmVideo WHERE AlarmID = ?');
    deleteVideos.run(alarmId);

    // 删除报警记录
    const deleteAlarm = db.prepare('DELETE FROM AlarmInfo WHERE AlarmID = ?');
    deleteAlarm.run(alarmId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting alarm:', error);
    res.status(500).json({ error: 'Failed to delete alarm' });
  }
});

// 搜索报警
router.get('/search/query', (req, res) => {
  try {
    const { startTime, endTime, ipcId, alarmType, handled } = req.query;
    let query = 'SELECT * FROM AlarmInfo WHERE 1=1';
    const params: string[] = [];

    if (startTime) {
      query += ' AND AlarmTime >= ?';
      params.push(String(startTime));
    }

    if (endTime) {
      query += ' AND AlarmTime <= ?';
      params.push(String(endTime));
    }

    if (ipcId) {
      query += ' AND IPCID = ?';
      params.push(String(ipcId));
    }

    if (alarmType) {
      query += ' AND AlarmType = ?';
      params.push(String(alarmType));
    }

    if (handled !== undefined) {
      query += ' AND HandleStatus = ?';
      params.push(handled === 'true' ? '已处理' : '未处理');
    }

    query += ' ORDER BY AlarmTime DESC';

    const stmt = db.prepare(query);
    const alarms = stmt.all(...params);

    res.json({ alarms, total: alarms.length });
  } catch (error) {
    console.error('Error searching alarms:', error);
    res.status(500).json({ error: 'Failed to search alarms' });
  }
});

export default router;
