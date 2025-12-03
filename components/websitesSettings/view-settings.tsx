// components/settings/SettingsView.tsx
'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Link as LinkIcon, 
//   Redirect, 
  FileText, 
  Code, 
  Image as ImageIcon, 
  FileCode,
  FileType,
  Settings as SettingsIcon
} from 'lucide-react';
import { usePages } from '@/contexts/PageContext';
import { updatePageMetaAction } from '@/app/actions/websitesActions';

interface SettingsViewProps {
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const { currentPage, pages } = usePages();
  const [activeTab, setActiveTab] = useState('page-settings');
  const [selectedPage, setSelectedPage] = useState(currentPage?.id || '');

  // Page settings state
  const [pageSettings, setPageSettings] = useState({
    title: currentPage?.name || '',
    url: currentPage?.slug || '',
    description: currentPage?.meta_description || '',
  
  });

  // Update settings when selected page changes
  React.useEffect(() => {
    const page = pages.find(p => p.id === selectedPage);
    if (page) {
      setPageSettings({
        title: page.name || '',
        url: page.slug || '',
        description: page.meta_description || ''
  
      });
    }
  }, [selectedPage, pages]);

  const handleSave = async () => {
    console.log('Saving settings:', pageSettings);
    // TODO: Implement save to database
    await updatePageMetaAction(selectedPage,{name:pageSettings.title,slug:pageSettings.url, meta_description:pageSettings.description})
    onClose();
  };

  const siteSettingsMenu = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'domains', label: 'Domains', icon: LinkIcon },

  ];

  return (
    <div className="-0 bg-white bg-opacity-50 z-[100000] flex items-center justify-center">
      <div className="bg-white w-full max-w-7xl h-[90vh] rounded-lg shadow-2xl flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white text-white p-4 overflow-y-auto">
          {/* Site Settings */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">
              Site Settings
            </h3>
            <ul className="space-y-1">
              {siteSettingsMenu.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      disabled={true}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm text-gray-500 cursor-not-allowed opacity-50"
                    >
                      <Icon size={16} />
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Page Settings */}
          <div>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 px-2">
              Page Settings
            </h3>
            <ul className="space-y-1">
              {pages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => {
                      setActiveTab('page-settings');
                      setSelectedPage(page.id);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded text-sm transition ${
                      activeTab === 'page-settings' && selectedPage === page.id
                        ? 'bg-gray-800 text-white'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <FileText size={16} />
                    <span className="truncate">{page.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Page Settings</h2>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm font-medium"
            >
              Save
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={pageSettings.title}
                  onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Cole — Minimal Portfolio Template"
                />
              </div>

              {/* URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <div className="flex items-center gap-2">
                  {/* <span className="text-gray-500 text-sm">/</span> */}
                  <input
                    type="text"
                    value={pageSettings.url}
                    onChange={(e) => setPageSettings({ ...pageSettings, url: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="test"
                  />
                </div>
              </div>

              {/* Page Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Description
                </label>
                <textarea
                  value={pageSettings.description}
                  onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="A clean, modern portfolio template crafted for designers to showcase their work professionally."
                />
              </div>

            </div>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};