import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ArrowLeft, Save } from 'lucide-react';

interface SystemConfigProps {
  onNavigate: (page: string) => void;
}

const SystemConfig: React.FC<SystemConfigProps> = ({ onNavigate }) => {
  const { config, setConfig } = useAppStore();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const res = await fetch('/api/config');
        const dataConfig = await res.json();
        setConfig(dataConfig);
        setFormData(dataConfig);
      } catch (error) {
        console.error('Failed to load config:', error);
      }
    };

    loadConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('/api/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      setConfig(formData);
      alert('Saved successfully!');
    } catch (error) {
      console.error('Failed to save config:', error);
      alert('Failed to save!');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('main')}
            className="p-2 hover:bg-gray-700 rounded"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-semibold">System Configuration</h1>
        </div>
      </div>

      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">System Title</label>
            <input
              type="text"
              value={formData.AppTitle || ''}
              onChange={(e) => setFormData({ ...formData, AppTitle: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Theme</label>
            <select
              value={formData.AppStyle || 'blue'}
              onChange={(e) => setFormData({ ...formData, AppStyle: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
            >
              <option value="lightblue">Light Blue</option>
              <option value="blue">Blue</option>
              <option value="gray">Gray</option>
              <option value="black">Black</option>
              <option value="grayblack">Gray Black</option>
              <option value="white">White</option>
              <option value="silver">Silver</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Stream Type</label>
            <select
              value={formData.RtspType || '0'}
              onChange={(e) => setFormData({ ...formData, RtspType: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
            >
              <option value="0">Main Stream</option>
              <option value="1">Sub Stream</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Default Layout</label>
            <select
              value={formData.VideoType || '16'}
              onChange={(e) => setFormData({ ...formData, VideoType: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded px-4 py-2"
            >
              <option value="1">1-Channel</option>
              <option value="1_4">4-Channel</option>
              <option value="1_9">9-Channel</option>
              <option value="16">16-Channel</option>
            </select>
          </div>

          <div className="pt-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 px-6 py-3 rounded flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Configuration'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemConfig;
