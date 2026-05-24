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

interface AppState {
  nvrs: NVR[];
  ipcs: IPC[];
  config: Record<string, string>;
  rtspAddrs: string[];
  videoType: string;
  selectedChannel: number | null;
  isFullscreen: boolean;
  isPolling: boolean;

  setNvrs: (nvrs: NVR[]) => void;
  setIpcs: (ipcs: IPC[]) => void;
  setConfig: (config: Record<string, string>) => void;
  setRtspAddrs: (addrs: string[]) => void;
  setVideoType: (type: string) => void;
  setSelectedChannel: (channel: number | null) => void;
  setIsFullscreen: (isFull: boolean) => void;
  setIsPolling: (isPolling: boolean) => void;
  updateRtspAddr: (index: number, addr: string) => void;
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
}));
