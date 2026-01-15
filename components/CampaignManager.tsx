import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Campaign } from '../types';
import { EMAIL_TEMPLATES, renderEmailTemplate } from './EmailTemplates';
import { 
  Megaphone, 
  Mail, 
  MessageSquare, 
  Share2, 
  Plus, 
  Send, 
  Clock, 
  CheckCircle2, 
  BarChart3, 
  MoreHorizontal, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Loader2,
  Users,
  Calendar,
  X,
  Layout
} from 'lucide-react';

interface CampaignManagerProps {
  storeId: string | null;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ storeId }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor State
  const [editorState, setEditorState] = useState<Partial<Campaign>>({
    name: '',
    type: 'email',
    audience: 'All Users',
    subject: '',
    content: '',
    templateId: '',
    templateVariables: {}
  });
  
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  useEffect(() => {
    if (storeId) {
      fetchCampaigns();
    }
  }, [storeId]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCampaign(null);
    setEditorState({
      name: 'New Campaign',
      type: 'email',
      audience: 'All Users',
      subject: '',
      content: '',
      templateId: '',
      templateVariables: {}
    });
    setScheduledDate('');
    setScheduledTime('');
    setShowScheduler(false);
    setIsEditorOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditorState(campaign);
    
    // Set scheduled date/time if exists
    if (campaign.scheduledFor) {
      const date = new Date(campaign.scheduledFor);
      setScheduledDate(date.toISOString().split('T')[0]);
      setScheduledTime(date.toTimeString().slice(0, 5));
      setShowScheduler(true);
    } else {
      setScheduledDate('');
      setScheduledTime('');
      setShowScheduler(false);
    }
    
    setIsEditorOpen(true);
  };

  const handleSave = async () => {
    if (!storeId || !editorState.name) return;

    try {
      // Prepare scheduled_for timestamp
      let scheduledFor = null;
      if (showScheduler && scheduledDate && scheduledTime) {
        scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      }
      
      const campaignData = {
        name: editorState.name,
        type: editorState.type,
        audience: editorState.audience,
        subject: editorState.subject,
        content: editorState.content,
        template_id: editorState.templateId || null,
        template_variables: editorState.templateVariables || {},
        scheduled_for: scheduledFor,
        status: scheduledFor ? 'scheduled' : 'draft'
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('campaigns')
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        
        setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, ...campaignData, scheduledFor } : c));
      } else {
        const { data, error } = await supabase
          .from('campaigns')
          .insert({
            store_id: storeId,
            ...campaignData,
            stats: { sent: 0, opened: 0, clicked: 0 }
          })
          .select()
          .single();

        if (error) throw error;
        setCampaigns([data, ...campaigns]);
      }
      setIsEditorOpen(false);
    } catch (error: any) {
      alert('Error saving campaign: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCampaigns(campaigns.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting campaign:', error);
    }
  };

  const handleGenerateContent = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const generatedSubject = "Exclusive Access: The Future of Streetwear is Here";
      const generatedContent = "Hey [Name],\n\nWe noticed you've been checking out our latest drops. We want to give you early access to our upcoming collection.\n\nUse code EVOLV_VIP for 20% off your next order.\n\nDon't miss out.\n\n- The Evolv Team";
      
      setEditorState(prev => ({
        ...prev,
        subject: generatedSubject,
        content: generatedContent
      }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSend = async (id: string) => {
    if (!confirm('Send this campaign now?')) return;
    
    try {
      const updates = { 
        status: 'sent', 
        sent_at: new Date().toISOString(),
        scheduled_for: null,
        stats: {
          sent: Math.floor(Math.random() * 1000) + 500, // Mock stats
          opened: 0,
          clicked: 0
        }
      };

      const { error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, ...updates, sentAt: updates.sent_at, scheduledFor: null } : c));
    } catch (error) {
      console.error('Error sending campaign:', error);
    }
  };
  
  const handleCancelScheduled = async (id: string) => {
    if (!confirm('Cancel this scheduled campaign?')) return;
    
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({ status: 'draft', scheduled_for: null })
        .eq('id', id);

      if (error) throw error;

      setCampaigns(prev => prev.map(c => c.id === id ? { ...c, status: 'draft', scheduledFor: null } : c));
    } catch (error) {
      console.error('Error canceling campaign:', error);
    }
  };
  
  const handleSelectTemplate = (templateId: string) => {
    const template = EMAIL_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setEditorState(prev => ({
        ...prev,
        templateId: templateId,
        subject: prev.subject || `${template.name} - ${prev.name}`,
        content: 'Using template: ' + template.name,
        templateVariables: prev.templateVariables || {}
      }));
      setShowTemplateSelector(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-neutral-500" /></div>;

  return (
    <div className="p-8 w-full max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Campaigns</h2>
          <p className="text-neutral-500">Manage email, SMS, and social marketing</p>
        </div>
        <button 
          onClick={handleCreate}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign List */}
        <div className="lg:col-span-2 space-y-4">
          {campaigns.length === 0 ? (
            <div className="p-12 bg-neutral-900 border border-dashed border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-500">
              <Megaphone size={48} className="mb-4 opacity-50" />
              <p className="font-bold">No campaigns yet</p>
              <p className="text-sm">Create your first campaign to reach your audience</p>
            </div>
          ) : (
            campaigns.map(campaign => (
              <div key={campaign.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 hover:border-neutral-600 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${
                      campaign.type === 'email' ? 'bg-blue-900/20 text-blue-500' :
                      campaign.type === 'sms' ? 'bg-green-900/20 text-green-500' :
                      'bg-purple-900/20 text-purple-500'
                    }`}>
                      {campaign.type === 'email' ? <Mail size={24} /> :
                       campaign.type === 'sms' ? <MessageSquare size={24} /> :
                       <Share2 size={24} />}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{campaign.name}</h3>
                      <div className="flex items-center gap-2 text-xs text-neutral-500">
                        <span className="capitalize">{campaign.type}</span>
                        <span>•</span>
                        <span>{campaign.audience}</span>
                        {campaign.templateId && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Layout size={12} /> Template</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      campaign.status === 'sent' ? 'bg-green-900/30 text-green-400 border border-green-500/20' :
                      campaign.status === 'scheduled' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' :
                      'bg-neutral-800 text-neutral-400 border border-neutral-700'
                    }`}>
                      {campaign.status}
                    </div>
                    {campaign.status === 'scheduled' && campaign.scheduledFor && (
                      <div className="text-xs text-neutral-500 flex items-center gap-1">
                        <Clock size={12} />
                        {new Date(campaign.scheduledFor).toLocaleString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          hour: 'numeric', 
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>

                {campaign.status === 'sent' && campaign.stats && (
                  <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-black/30 rounded-lg border border-neutral-800">
                    <div>
                      <div className="text-xs text-neutral-500 uppercase font-bold">Sent</div>
                      <div className="text-lg font-bold text-white">{campaign.stats.sent}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase font-bold">Opened</div>
                      <div className="text-lg font-bold text-white">{campaign.stats.opened}</div>
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase font-bold">Clicked</div>
                      <div className="text-lg font-bold text-white">{campaign.stats.clicked}</div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t border-neutral-800">
                  {campaign.status === 'draft' && (
                    <button 
                      onClick={() => handleSend(campaign.id)}
                      className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-neutral-200 flex items-center gap-2"
                    >
                      <Send size={14} /> Send Now
                    </button>
                  )}
                  {campaign.status === 'scheduled' && (
                    <>
                      <button 
                        onClick={() => handleSend(campaign.id)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Send size={14} /> Send Now
                      </button>
                      <button 
                        onClick={() => handleCancelScheduled(campaign.id)}
                        className="px-4 py-2 bg-neutral-800 text-neutral-300 text-sm font-bold rounded-lg hover:bg-neutral-700 flex items-center gap-2"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleEdit(campaign)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(campaign.id)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats / Sidebar */}
        <div className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-blue-500" /> Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Total Sent</span>
                  <span className="text-white font-bold">12,450</span>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[75%] bg-blue-600"></div></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-neutral-500">Avg. Open Rate</span>
                  <span className="text-white font-bold">24.8%</span>
                </div>
                <div className="h-2 bg-neutral-800 rounded-full overflow-hidden"><div className="h-full w-[24%] bg-green-500"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign Editor Modal */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-neutral-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">{editingCampaign ? 'Edit Campaign' : 'New Campaign'}</h3>
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Campaign Name</label>
                  <input 
                    value={editorState.name}
                    onChange={(e) => setEditorState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    style={{ color: '#000000' }}
                    placeholder="e.g. Summer Sale"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Type</label>
                  <select 
                    value={editorState.type}
                    onChange={(e) => setEditorState(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    style={{ color: '#000000' }}
                  >
                    <option value="email">Email Blast</option>
                    <option value="sms">SMS Notification</option>
                    <option value="social">Social Post</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Target Audience</label>
                <select 
                  value={editorState.audience}
                  onChange={(e) => setEditorState(prev => ({ ...prev, audience: e.target.value }))}
                  className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                  style={{ color: '#000000' }}
                >
                  <option value="All Users">All Users</option>
                  <option value="VIPs">VIP Customers (Spent $500+)</option>
                  <option value="Cart Abandoners">Cart Abandoners (Last 24h)</option>
                  <option value="New Signups">New Signups (Last 7 days)</option>
                </select>
              </div>

              {editorState.type === 'email' && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Subject Line</label>
                    <input 
                      value={editorState.subject}
                      onChange={(e) => setEditorState(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                      style={{ color: '#000000' }}
                      placeholder="Subject..."
                    />
                  </div>

                  {/* Email Template Selector */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-xs font-bold text-neutral-500 uppercase">Email Template</label>
                      <button 
                        onClick={() => setShowTemplateSelector(!showTemplateSelector)}
                        className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        <Layout size={12} />
                        {editorState.templateId ? 'Change Template' : 'Use Template'}
                      </button>
                    </div>
                    
                    {editorState.templateId && (
                      <div className="bg-black border border-neutral-800 rounded-lg p-3 text-sm text-neutral-400 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <span className="text-2xl">{EMAIL_TEMPLATES.find(t => t.id === editorState.templateId)?.thumbnail}</span>
                          <span className="text-white">{EMAIL_TEMPLATES.find(t => t.id === editorState.templateId)?.name}</span>
                        </span>
                        <button 
                          onClick={() => setEditorState(prev => ({ ...prev, templateId: '', templateVariables: {} }))}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    
                    {showTemplateSelector && (
                      <div className="mt-2 grid grid-cols-2 gap-2 bg-black border border-neutral-800 rounded-lg p-3 max-h-64 overflow-y-auto">
                        {EMAIL_TEMPLATES.map(template => (
                          <button
                            key={template.id}
                            onClick={() => handleSelectTemplate(template.id)}
                            className={`p-3 rounded-lg border text-left hover:border-blue-500 transition-all ${
                              editorState.templateId === template.id 
                                ? 'bg-blue-600/20 border-blue-500' 
                                : 'bg-neutral-900 border-neutral-800'
                            }`}
                          >
                            <div className="text-2xl mb-1">{template.thumbnail}</div>
                            <div className="font-bold text-white text-sm">{template.name}</div>
                            <div className="text-xs text-neutral-500">{template.description}</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase">Content</label>
                  <button 
                    onClick={handleGenerateContent}
                    disabled={isGenerating}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Generate with AI
                  </button>
                </div>
                <textarea 
                  value={editorState.content}
                  onChange={(e) => setEditorState(prev => ({ ...prev, content: e.target.value }))}
                  className="w-full h-48 bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none resize-none font-mono text-sm"
                  style={{ color: '#000000' }}
                  placeholder="Write your message here..."
                />
              </div>

              {/* Scheduler Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-neutral-500 uppercase">Schedule Send</label>
                  <button 
                    onClick={() => setShowScheduler(!showScheduler)}
                    className={`text-xs font-bold flex items-center gap-1 ${showScheduler ? 'text-yellow-400' : 'text-neutral-500 hover:text-neutral-300'}`}
                  >
                    <Clock size={12} />
                    {showScheduler ? 'Scheduled' : 'Send Later'}
                  </button>
                </div>
                
                {showScheduler && (
                  <div className="grid grid-cols-2 gap-3 bg-black border border-neutral-800 rounded-lg p-4">
                    <div>
                      <label className="block text-xs text-neutral-500 mb-2">Date</label>
                      <input 
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none text-sm"
                        style={{ color: '#000000' }}
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-neutral-500 mb-2">Time</label>
                      <input 
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:border-blue-500 outline-none text-sm"
                        style={{ color: '#000000' }}
                      />
                    </div>
                    <div className="col-span-2 text-xs text-neutral-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {scheduledDate && scheduledTime ? (
                        <span>Will send on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString('en-US', { 
                          month: 'long', 
                          day: 'numeric', 
                          year: 'numeric',
                          hour: 'numeric', 
                          minute: '2-digit'
                        })}</span>
                      ) : (
                        <span>Select date and time to schedule</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-neutral-800 bg-neutral-900/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsEditorOpen(false)}
                className="px-6 py-2 text-neutral-400 hover:text-white font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className={`px-6 py-2 rounded-lg font-bold flex items-center gap-2 ${
                  showScheduler && scheduledDate && scheduledTime
                    ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {showScheduler && scheduledDate && scheduledTime ? (
                  <><Clock size={16} /> Schedule Campaign</>
                ) : (
                  <>Save Campaign</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
