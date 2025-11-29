import React, { useState } from 'react';
import { Campaign } from '../types';
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
  Calendar
} from 'lucide-react';

interface CampaignManagerProps {
  campaigns: Campaign[];
  onAddCampaign: (campaign: Campaign) => void;
  onUpdateCampaign: (id: string, updates: Partial<Campaign>) => void;
  onDeleteCampaign: (id: string) => void;
}

export const CampaignManager: React.FC<CampaignManagerProps> = ({ 
  campaigns, 
  onAddCampaign, 
  onUpdateCampaign, 
  onDeleteCampaign 
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Editor State
  const [editorState, setEditorState] = useState<Partial<Campaign>>({
    name: '',
    type: 'email',
    audience: 'All Users',
    subject: '',
    content: ''
  });

  const handleCreate = () => {
    setEditingCampaign(null);
    setEditorState({
      name: 'New Campaign',
      type: 'email',
      audience: 'All Users',
      subject: '',
      content: ''
    });
    setIsEditorOpen(true);
  };

  const handleEdit = (campaign: Campaign) => {
    setEditingCampaign(campaign);
    setEditorState(campaign);
    setIsEditorOpen(true);
  };

  const handleSave = () => {
    if (editingCampaign) {
      onUpdateCampaign(editingCampaign.id, editorState);
    } else {
      const newCampaign: Campaign = {
        id: Math.random().toString(36).substr(2, 9),
        status: 'draft',
        ...editorState as any
      };
      onAddCampaign(newCampaign);
    }
    setIsEditorOpen(false);
  };

  const handleGenerateContent = () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const generatedSubject = "Exclusive Access: The Future of Streetwear is Here";
      const generatedContent = "Hey [Name],\n\nWe noticed you've been checking out our latest drops. We want to give you early access to our upcoming collection.\n\nUse code NEXUS_VIP for 20% off your next order.\n\nDon't miss out.\n\n- The Nexus Team";
      
      setEditorState(prev => ({
        ...prev,
        subject: generatedSubject,
        content: generatedContent
      }));
      setIsGenerating(false);
    }, 1500);
  };

  const handleSend = (id: string) => {
    onUpdateCampaign(id, { 
      status: 'sent', 
      sentAt: new Date().toISOString(),
      stats: {
        sent: 1250,
        opened: 0,
        clicked: 0
      }
    });
  };

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
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    campaign.status === 'sent' ? 'bg-green-900/30 text-green-400 border border-green-500/20' :
                    campaign.status === 'scheduled' ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/20' :
                    'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}>
                    {campaign.status}
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
                  <button 
                    onClick={() => handleEdit(campaign)}
                    className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => onDeleteCampaign(campaign.id)}
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
              <button onClick={() => setIsEditorOpen(false)} className="text-neutral-500 hover:text-white"><Users size={20} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Campaign Name</label>
                  <input 
                    value={editorState.name}
                    onChange={(e) => setEditorState(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="e.g. Summer Sale"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Type</label>
                  <select 
                    value={editorState.type}
                    onChange={(e) => setEditorState(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
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
                >
                  <option value="All Users">All Users</option>
                  <option value="VIPs">VIP Customers (Spent $500+)</option>
                  <option value="Cart Abandoners">Cart Abandoners (Last 24h)</option>
                  <option value="New Signups">New Signups (Last 7 days)</option>
                </select>
              </div>

              {editorState.type === 'email' && (
                <div>
                  <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Subject Line</label>
                  <input 
                    value={editorState.subject}
                    onChange={(e) => setEditorState(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full bg-black border border-neutral-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    placeholder="Subject..."
                  />
                </div>
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
                  placeholder="Write your message here..."
                />
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
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold"
              >
                Save Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
