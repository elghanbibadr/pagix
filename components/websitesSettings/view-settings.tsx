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
import { updatePageMetaAction, updateWebsiteAction } from '@/app/actions/websitesActions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { usePathname, useSearchParams } from 'next/navigation';

interface SettingsViewProps {
  onClose: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onClose }) => {
  const { currentPage, pages, setHasUnsavedChanges, website ,setPages} = usePages();
  const [activeTab, setActiveTab] = useState('general'); // ✅ Start with general
  const [selectedPage, setSelectedPage] = useState(currentPage?.id || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // ✅ Website settings state
  const [websiteSettings, setWebsiteSettings] = useState({
    name: website?.name || '',
    description: website?.description || '',
  });

  // ✅ Website validation errors
  const [websiteErrors, setWebsiteErrors] = useState({
    name: '',
  });

  // Page validation errors
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

  // Update page settings when selected page changes
  React.useEffect(() => {
    const page = pages.find(p => p.id === selectedPage);
    if (page) {
      setPageSettings({
        title: page.name || '',
        url: page.slug || '',
        description: page.meta_description || ''
      });
      setErrors({ title: '', url: '' });
    }
  }, [selectedPage, pages]);

  // ✅ Validate website inputs
  const validateWebsiteInputs = () => {
    const newErrors = { name: '' };

    if (!websiteSettings.name.trim()) {
      newErrors.name = 'Website name is required';
    }

    setWebsiteErrors(newErrors);
    return !newErrors.name;
  };

  // ✅ Validate page inputs
  const validatePageInputs = () => {
    const newErrors = {
      title: '',
      url: '',
    };

    if (!pageSettings.title.trim()) {
      newErrors.title = 'Page name is required';
    }

    if (!pageSettings.url.trim()) {
      newErrors.url = 'URL slug is required';
    } else if (!/^[a-z0-9-]+$/.test(pageSettings.url)) {
      newErrors.url = 'URL slug can only contain lowercase letters, numbers, and hyphens';
    }

    setErrors(newErrors);
    return !newErrors.title && !newErrors.url;
  };

  // ✅ Handle website settings save
  const handleSaveWebsite = async () => {
    if (!validateWebsiteInputs()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setIsUpdating(true);
    
    try {
      console.log('Saving website settings:', websiteSettings);
      
      await updateWebsiteAction(website.id, {
        name: websiteSettings.name.trim(),
        description: websiteSettings.description.trim()
      });

      toast.success("Website settings updated successfully!");

      setTimeout(() => {
        onClose();
      }, 1000);

    } catch (error) {
      console.error('❌ Failed to save website settings:', error);
      toast.error("Failed to update website settings. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };



// ✅ Handle page settings save
const handleSavePage = async () => {
  if (!selectedPage) return;

  if (!validatePageInputs()) {
    toast.error('Please fix the validation errors');
    return;
  }

  setIsUpdating(true);
  
  try {
    console.log('Saving page settings:', pageSettings);
    
    const updatedPage = await updatePageMetaAction(selectedPage, {
      name: pageSettings.title.trim(),
      slug: pageSettings.url.trim(),
      meta_description: pageSettings.description.trim()
    });

    // ✅ Update local state with the new page data
    setPages(prev => 
      prev.map(p => 
        p.id === selectedPage 
          ? { 
              ...p, 
              name: pageSettings.title.trim(),
              slug: pageSettings.url.trim(),
              meta_description: pageSettings.description.trim(),
              updated_at: new Date().toISOString()
            } 
          : p
      )
    );

    toast.success("Page settings updated successfully!");

    setTimeout(() => {
      onClose();
    }, 1000);

  } catch (error) {
    console.error('❌ Failed to save page settings:', error);
    toast.error("Failed to update page settings. Please try again.");
  } finally {
    setIsUpdating(false);
  }
};

  // ✅ Determine which save handler to use
  const handleSave = () => {
    if (activeTab === 'general') {
      handleSaveWebsite();
    } else if (activeTab === 'page-settings') {
      handleSavePage();
    }
  };

  const siteSettingsMenu = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'domains', label: 'Domains', icon: LinkIcon },
  ];

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

  const handleWebsiteNameChange = (value: string) => {
    setWebsiteSettings({ ...websiteSettings, name: value });
    if (value.trim()) {
      setWebsiteErrors(prev => ({ ...prev, name: '' }));
    }
  };

  const handleTitleChange = (value: string) => {
    setPageSettings({ ...pageSettings, title: value });
    if (value.trim()) {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleSlugChange = (value: string) => {
    const formattedSlug = value
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    setPageSettings({ ...pageSettings, url: formattedSlug });
    
    if (formattedSlug.trim() && /^[a-z0-9-]+$/.test(formattedSlug)) {
      setErrors(prev => ({ ...prev, url: '' }));
    }
  };

  // ✅ Determine the header title based on active tab
  const getHeaderTitle = () => {
    if (activeTab === 'general') return 'Website Settings';
    if (activeTab === 'domains') return 'Domain Settings';
    return 'Page Settings';
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
                const isDisabled = item.id === 'domains'; // ✅ Only domains is disabled
                return (
                  <li key={item.id}>
                    <Button
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      disabled={isDisabled}
                      onClick={() => !isDisabled && setActiveTab(item.id)}
                      className={`w-full justify-start gap-3 ${
                        isDisabled ? 'text-gray-500 cursor-not-allowed opacity-50' : ''
                      }`}
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
            <h2 className="text-xl font-semibold text-gray-900">
              {getHeaderTitle()} {/* ✅ Dynamic header */}
            </h2>
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
              {/* ✅ General Tab Content (Website Settings) */}
              {activeTab === 'general' && (
                <>
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Website Information</h3>
                    <p className="text-sm text-gray-500 mb-6">
                      Update your website's basic information
                    </p>
                  </div>

                  {/* Website Name */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={websiteSettings.name}
                      onChange={(e) => handleWebsiteNameChange(e.target.value)}
                      placeholder="My Awesome Website"
                      disabled={isUpdating}
                      className={websiteErrors.name ? 'border-red-500' : ''}
                    />
                    {websiteErrors.name && (
                      <p className="mt-1 text-sm text-red-500">{websiteErrors.name}</p>
                    )}
                  </div>

                  {/* Website Description */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Description
                    </label>
                    <Textarea
                      value={websiteSettings.description}
                      onChange={(e) => setWebsiteSettings({ ...websiteSettings, description: e.target.value })}
                      rows={4}
                      placeholder="Describe your website..."
                      disabled={isUpdating}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      This description is for your reference only
                    </p>
                  </div>
                </>
              )}

              {/* ✅ Page Settings Tab Content */}
              {activeTab === 'page-settings' && (
                <>
                  {/* Title */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      value={pageSettings.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="Page Title"
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
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};