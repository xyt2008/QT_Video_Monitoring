
import express from 'express';
import db from '../db.js';

const router = express.Router();

// NVR 设备 API

// 获取所有 NVR
router.get('/nvrs', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM NVRInfo');
    const nvrs = stmt.all();
    res.json(nvrs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch NVRs' });
  }
});

// 创建 NVR
router.post('/nvrs', (req, res) => {
  try {
    const { NVRID, NVRName, NVRIP, NVRPort, NVRUsername, NVRPassword, NVRUse } = req.body;
    const stmt = db.prepare(
      'INSERT INTO NVRInfo (NVRID, NVRName, NVRIP, NVRPort, NVRUsername, NVRPassword, NVRUse) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(NVRID, NVRName, NVRIP, NVRPort, NVRUsername, NVRPassword, NVRUse || '启用');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create NVR' });
  }
});

// 更新 NVR
router.put('/nvrs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { NVRName, NVRIP, NVRPort, NVRUsername, NVRPassword, NVRUse } = req.body;
    const stmt = db.prepare(
      'UPDATE NVRInfo SET NVRName=?, NVRIP=?, NVRPort=?, NVRUsername=?, NVRPassword=?, NVRUse=? WHERE NVRID=?'
    );
    stmt.run(NVRName, NVRIP, NVRPort, NVRUsername, NVRPassword, NVRUse, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update NVR' });
  }
});

// 删除 NVR
router.delete('/nvrs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM NVRInfo WHERE NVRID=?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete NVR' });
  }
});

// IPC 设备 API

// 获取所有 IPC
router.get('/ipcs', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM IPCInfo');
    const ipcs = stmt.all();
    res.json(ipcs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch IPCs' });
  }
});

// 创建 IPC
router.post('/ipcs', (req, res) => {
  try {
    const { IPCID, NVRID, IPCName, IPCIP, IPCRtspAddrMain, IPCRtspAddrSub, IPCUse } = req.body;
    const stmt = db.prepare(
      'INSERT INTO IPCInfo (IPCID, NVRID, IPCName, IPCIP, IPCRtspAddrMain, IPCRtspAddrSub, IPCUse) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(IPCID, NVRID, IPCName, IPCIP, IPCRtspAddrMain, IPCRtspAddrSub, IPCUse || '启用');
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create IPC' });
  }
});

// 更新 IPC
router.put('/ipcs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { NVRID, IPCName, IPCIP, IPCRtspAddrMain, IPCRtspAddrSub, IPCUse } = req.body;
    const stmt = db.prepare(
      'UPDATE IPCInfo SET NVRID=?, IPCName=?, IPCIP=?, IPCRtspAddrMain=?, IPCRtspAddrSub=?, IPCUse=? WHERE IPCID=?'
    );
    stmt.run(NVRID, IPCName, IPCIP, IPCRtspAddrMain, IPCRtspAddrSub, IPCUse, id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update IPC' });
  }
});

// 删除 IPC
router.delete('/ipcs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM IPCInfo WHERE IPCID=?');
    stmt.run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete IPC' });
  }
});

export default router;
