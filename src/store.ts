
import { create } from 'zustand';

interface NVR {
  NVRID: string;
  NVRName: string;
  NVRIP: string;
  NVRPort: number;
  NVRUsername: string;
  NVRPassword: string;
  NVRUse: string;
}

interface IPC {
  IPCID: string;
  NVRID: string;
  IPCName: string;
  IPCIP: string;
  IPCRtspAddrMain: string;
  IPCRtspAddrSub: string;
  IPCUse: string;
}

interface Alarm {
  AlarmID: string;
  IPCID: string;
  AlarmType: string;
  AlarmTime: string;
  AlarmDesc: string;
  AlarmLevel: string;
  VideoPath: string;
  ImagePath: string;
  HandleStatus: string;
  HandleDesc?: string;
  HandleTime?: string;
}

interface AlarmImage {
  ImageID: string;
  AlarmID: string;
  ImagePath: string;
  CreateTime: string;
}

interface AlarmVideo {
  VideoID: string;
  AlarmID: string;
  VideoPath: string;
  VideoDuration: number;
  CreateTime: string;
}

interface AppState {
  nvrs: NVR[];
  ipcs: IPC[];
  config: Record<string, string>;
  rtspAddrs: string[];
  videoType: string;
  selectedChannel: number | null;
  isFullscreen: boolean;
  isPolling: boolean;
  alarms: Alarm[];
  currentAlarm: {
    alarm?: Alarm;
    images: AlarmImage[];
    videos: AlarmVideo[];
  } | null;

  setNvrs: (nvrs: NVR[]) => void;
  setIpcs: (ipcs: IPC[]) => void;
  setConfig: (config: Record<string, string>) => void;
  setRtspAddrs: (addrs: string[]) => void;
  setVideoType: (type: string) => void;
  setSelectedChannel: (channel: number | null) => void;
  setIsFullscreen: (isFull: boolean) => void;
  setIsPolling: (isPolling: boolean) => void;
  updateRtspAddr: (index: number, addr: string) => void;
  setAlarms: (alarms: Alarm[]) => void;
  setCurrentAlarm: (alarm: any) => void;
  addAlarm: (alarm: Alarm) => void;
  updateAlarm: (alarmId: string, update: Partial<Alarm>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  nvrs: [],
  ipcs: [],
  config: {},
  rtspAddrs: Array(16).fill(''),
  videoType: '16',
  selectedChannel: null,
  isFullscreen: false,
  isPolling: false,
  alarms: [],
  currentAlarm: null,

  setNvrs: (nvrs) => set({ nvrs }),
  setIpcs: (ipcs) => set({ ipcs }),
  setConfig: (config) => set({ config }),
  setRtspAddrs: (addrs) => set({ rtspAddrs: addrs }),
  setVideoType: (type) => set({ videoType: type }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setIsFullscreen: (isFull) => set({ isFullscreen: isFull }),
  setIsPolling: (isPolling) => set({ isPolling }),
  updateRtspAddr: (index, addr) =>
    set((state) => {
      const newAddrs = [...state.rtspAddrs];
      newAddrs[index] = addr;
      return { rtspAddrs: newAddrs };
    }),
  setAlarms: (alarms) => set({ alarms }),
  setCurrentAlarm: (alarmData) => set({ currentAlarm: alarmData }),
  addAlarm: (alarm) =>
    set((state) => ({
      alarms: [alarm, ...state.alarms]
    })),
  updateAlarm: (alarmId, update) =>
    set((state) => ({
      alarms: state.alarms.map(alarm =>
        alarm.AlarmID === alarmId ? { ...alarm, ...update } : alarm
      )
    }))
}));
