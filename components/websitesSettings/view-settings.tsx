// components/settings/SettingsView.tsx
'use client';

import React, { useState } from 'react';
import { 
  Globe, 
  Link as LinkIcon, 
  FileText, 
  Loader2,
  ArrowLeft
} from 'lucide-react';
import { usePages } from '@/contexts/PageContext';
import { updatePageMetaAction } from '@/app/actions/websitesActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';

interface SettingsViewProps {
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const { currentPage, pages, setHasUnsavedChanges } = usePages();
  const [activeTab, setActiveTab] = useState('page-settings');
  const [selectedPage, setSelectedPage] = useState(currentPage?.id || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ✅ Add validation errors state
  const [errors, setErrors] = useState({
    title: '',
    url: '',
  });

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
      // Clear errors when switching pages
      setErrors({ title: '', url: '' });
    }
  }, [selectedPage, pages]);

  // ✅ Validate inputs
  const validateInputs = () => {
    const newErrors = {
      title: '',
      url: '',
    };

    // Validate title
    if (!pageSettings.title.trim()) {
      newErrors.title = 'Page name is required';
    }

    // Validate slug
    if (!pageSettings.url.trim()) {
      newErrors.url = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(pageSettings.url)) {
      newErrors.url = 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.title && !newErrors.url;
  };

  const handleSave = async () => {
    if (!selectedPage) return;

    // ✅ Validate before saving
    if (!validateInputs()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsUpdating(true);
    
    try {
      console.log('Saving settings:', pageSettings);
      
      await updatePageMetaAction(selectedPage, {
        name: pageSettings.title.trim(),
        slug: pageSettings.url.trim(),
        meta_description: pageSettings.description.trim()
      });

      toast.success("Page updated successfully!");

      // Optional: close after a delay
      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      
      toast.error("Failed to update page settings. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const siteSettingsMenu = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'domains', label: 'Domains', icon: LinkIcon },
  ];

  // ✅ Function to close settings by removing URL params
  const closeSettings = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('view');
    params.delete('pageId');
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  };

  const handleBackToEditor = () => {
    setHasUnsavedChanges(false);
    closeSettings();
  };

  // ✅ Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setPageSettings({ ...pageSettings, title: value });
    
    // Clear title error if value is not empty
    if (value.trim()) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  // ✅ Validate and format slug on change
  const handleSlugChange = (value: string) => {
    // Convert to lowercase and replace spaces with hyphens
    const formattedSlug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    setPageSettings({ ...pageSettings, url: formattedSlug });
    
    // Clear error if valid
    if (formattedSlug.trim() && /^[a-z0-9-]+$/.test(formattedSlug)) {
      setErrors(prev => ({ ...prev, url: '' }));
    }
  };

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white w-full flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r p-4 overflow-y-auto">
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
                    <Button
                      variant="ghost"
                      disabled={true}
                      className="w-full justify-start gap-3 text-gray-500 cursor-not-allowed opacity-50"
                    >
                      <Icon size={16} />
                      {item.label}
                    </Button>
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
                  <Button
                    variant={activeTab === 'page-settings' && selectedPage === page.id ? "secondary" : "ghost"}
                    onClick={() => {
                      setActiveTab('page-settings');
                      setSelectedPage(page.id);
                    }}
                    className="w-full justify-start gap-3"
                  >
                    <FileText size={16} />
                    <span className="truncate">{page.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full">
          {/* Header */}
          <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Page Settings</h2>
            <div className='flex gap-x-3'>
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="min-w-[100px]"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
              <Button 
                variant="outline"
                onClick={handleBackToEditor}
                disabled={isUpdating}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editor
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-3xl">
              {/* Title */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={pageSettings.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Cole — Minimal Portfolio Template"
                  disabled={isUpdating}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                )}
              </div>

              {/* URL */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Slug <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  value={pageSettings.url}
                  onChange={(e) => handleSlugChange(e.target.value)}
                  placeholder="home"
                  disabled={isUpdating}
                  className={errors.url ? 'border-red-500' : ''}
                />
                {errors.url ? (
                  <p className="mt-1 text-sm text-red-500">{errors.url}</p>
                ) : (
                  <p className="mt-1 text-xs text-gray-500">
                    yoursite.com/{pageSettings.url || 'slug'}
                  </p>
                )}
              </div>

              {/* Page Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Description (SEO)
                </label>
                <Textarea
                  value={pageSettings.description}
                  onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                  rows={4}
                  placeholder="page description"
                  disabled={isUpdating}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};