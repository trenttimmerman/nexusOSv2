import React, { useEffect, useState } from 'react';
import { getEmailSettings, updateEmailSettings, type EmailSettings as EmailSettingsType } from '../lib/emailService';

interface EmailSettingsProps {
  siteId: string;
}

export default function EmailSettings({ siteId }: EmailSettingsProps) {
  const [settings, setSettings] = useState<EmailSettingsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'thank-you' | 'terms'>('general');

  useEffect(() => {
    loadSettings();
  }, [siteId]);

  async function loadSettings() {
    setLoading(true);
    const data = await getEmailSettings(siteId);
    setSettings(data);
    setLoading(false);
  }

  async function handleSave() {
    if (!settings) return;

    setSaving(true);
    const result = await updateEmailSettings(siteId, settings);
    
    if (result.success) {
      alert('Settings saved successfully!');
      if (result.settings) {
        setSettings(result.settings);
      }
    } else {
      alert('Error saving settings: ' + result.message);
    }
    
    setSaving(false);
  }

  function updateSetting<K extends keyof EmailSettingsType>(
    key: K,
    value: EmailSettingsType[K]
  ) {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  }

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-12 text-gray-500">Loading settings...</div>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="text-center py-12 text-red-500">Failed to load email settings</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Settings</h2>
        <p className="text-gray-600">Configure email signup behavior and appearance</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab('thank-you')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'thank-you'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thank You Popup
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`pb-3 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'terms'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Terms & Conditions
          </button>
        </nav>
      </div>

      {/* General Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Enabled */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Email Signups Enabled</h3>
              <p className="text-sm text-gray-600">Allow visitors to subscribe to your email list</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enabled}
                onChange={(e) => updateSetting('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Auto Create Customer */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Auto-Create Customer Accounts</h3>
              <p className="text-sm text-gray-600">Automatically create customer accounts for new subscribers</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_create_customer}
                onChange={(e) => updateSetting('auto_create_customer', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Double Opt-In */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Require Double Opt-In</h3>
              <p className="text-sm text-gray-600">Send confirmation email before activating subscription</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.require_double_opt_in}
                onChange={(e) => updateSetting('require_double_opt_in', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* Thank You Tab */}
      {activeTab === 'thank-you' && (
        <div className="space-y-6">
          {/* Enabled */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Show Thank You Popup</h3>
              <p className="text-sm text-gray-600">Display a popup after successful subscription</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.thank_you_enabled}
                onChange={(e) => updateSetting('thank_you_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.thank_you_enabled && (
            <>
              {/* Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heading</label>
                <input
                  type="text"
                  value={settings.thank_you_heading}
                  onChange={(e) => updateSetting('thank_you_heading', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  value={settings.thank_you_message}
                  onChange={(e) => updateSetting('thank_you_message', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Button Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
                <input
                  type="text"
                  value={settings.thank_you_button_text}
                  onChange={(e) => updateSetting('thank_you_button_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Button Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Button Link (optional)
                </label>
                <input
                  type="text"
                  value={settings.thank_you_button_link}
                  onChange={(e) => updateSetting('thank_you_button_link', e.target.value)}
                  placeholder="/products"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Leave empty to just close the popup</p>
              </div>

              {/* Auto Close */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Auto-Close Popup</h3>
                  <p className="text-sm text-gray-600">Automatically close after a delay</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.thank_you_auto_close}
                    onChange={(e) => updateSetting('thank_you_auto_close', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {settings.thank_you_auto_close && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Auto-Close Delay (seconds)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={settings.thank_you_auto_close_delay}
                    onChange={(e) => updateSetting('thank_you_auto_close_delay', parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              )}

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                  <input
                    type="color"
                    value={settings.thank_you_bg_color}
                    onChange={(e) => updateSetting('thank_you_bg_color', e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={settings.thank_you_text_color}
                    onChange={(e) => updateSetting('thank_you_text_color', e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Background</label>
                  <input
                    type="color"
                    value={settings.thank_you_button_bg_color}
                    onChange={(e) => updateSetting('thank_you_button_bg_color', e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Button Text Color</label>
                  <input
                    type="color"
                    value={settings.thank_you_button_text_color}
                    onChange={(e) => updateSetting('thank_you_button_text_color', e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Terms Tab */}
      {activeTab === 'terms' && (
        <div className="space-y-6">
          {/* Enabled */}
          <div className="flex items-center justify-between py-4 border-b border-gray-200">
            <div>
              <h3 className="font-semibold text-gray-900">Show Terms & Conditions</h3>
              <p className="text-sm text-gray-600">Display T&C link below email forms</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.terms_enabled}
                onChange={(e) => updateSetting('terms_enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {settings.terms_enabled && (
            <>
              {/* Require Acceptance */}
              <div className="flex items-center justify-between py-4 border-b border-gray-200">
                <div>
                  <h3 className="font-semibold text-gray-900">Require Acceptance</h3>
                  <p className="text-sm text-gray-600">Users must check a box to accept terms</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.require_terms_acceptance}
                    onChange={(e) => updateSetting('require_terms_acceptance', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Checkbox Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Checkbox Text</label>
                <input
                  type="text"
                  value={settings.terms_checkbox_text}
                  onChange={(e) => updateSetting('terms_checkbox_text', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Terms Heading */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms Heading</label>
                <input
                  type="text"
                  value={settings.terms_heading}
                  onChange={(e) => updateSetting('terms_heading', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Terms Page Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Terms Page Slug</label>
                <input
                  type="text"
                  value={settings.terms_page_slug}
                  onChange={(e) => updateSetting('terms_page_slug', e.target.value)}
                  placeholder="email-terms"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">Link to dedicated terms page</p>
              </div>

              {/* Terms Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Terms Content (for modal display)
                </label>
                <textarea
                  value={settings.terms_content || ''}
                  onChange={(e) => updateSetting('terms_content', e.target.value)}
                  rows={12}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Full terms text for modal popup (supports HTML)
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Save Button */}
      <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
