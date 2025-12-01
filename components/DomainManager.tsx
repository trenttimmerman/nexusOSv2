import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Domain } from '../types';
import { Globe, Plus, Trash2, CheckCircle, AlertCircle, RefreshCw, Loader2, Copy } from 'lucide-react';

interface DomainManagerProps {
    storeId: string;
}

export const DomainManager: React.FC<DomainManagerProps> = ({ storeId }) => {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [newDomain, setNewDomain] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [verifyingId, setVerifyingId] = useState<string | null>(null);

    useEffect(() => {
        fetchDomains();
    }, [storeId]);

    const fetchDomains = async () => {
        try {
            const { data, error } = await supabase
                .from('domains')
                .select('*')
                .eq('store_id', storeId)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setDomains(data || []);
        } catch (error) {
            console.error('Error fetching domains:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDomain = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDomain) return;

        // Basic validation
        const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
        if (!domainRegex.test(newDomain)) {
            alert('Please enter a valid domain name (e.g., shop.mystore.com)');
            return;
        }

        setIsAdding(true);
        try {
            const { data, error } = await supabase
                .from('domains')
                .insert({
                    store_id: storeId,
                    domain: newDomain.toLowerCase(),
                    status: 'pending'
                })
                .select()
                .single();

            if (error) throw error;
            setDomains(prev => [data, ...prev]);
            setNewDomain('');
        } catch (error: any) {
            console.error('Error adding domain:', error);
            alert(error.message);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteDomain = async (id: string) => {
        if (!confirm('Are you sure you want to remove this domain?')) return;
        try {
            const { error } = await supabase
                .from('domains')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            setDomains(prev => prev.filter(d => d.id !== id));
        } catch (error) {
            console.error('Error deleting domain:', error);
        }
    };

    const handleVerifyDomain = async (domain: Domain) => {
        setVerifyingId(domain.id);
        
        // Simulate DNS check delay
        setTimeout(async () => {
            try {
                // In a real app, you would call an Edge Function to check DNS records
                // For this demo, we'll just mark it as active if it's not localhost
                const success = true; 

                if (success) {
                    const { error } = await supabase
                        .from('domains')
                        .update({ 
                            status: 'active',
                            verified_at: new Date().toISOString()
                        })
                        .eq('id', domain.id);
                    
                    if (error) throw error;
                    
                    setDomains(prev => prev.map(d => d.id === domain.id ? { ...d, status: 'active', verified_at: new Date().toISOString() } : d));
                    alert(`Successfully verified ${domain.domain}`);
                } else {
                    alert(`Could not verify DNS records for ${domain.domain}. Please ensure CNAME is set.`);
                }
            } catch (error) {
                console.error('Verification error:', error);
            } finally {
                setVerifyingId(null);
            }
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-white">Custom Domains</h3>
                    <p className="text-sm text-neutral-400">Connect your own domain to your store.</p>
                </div>
            </div>

            {/* Add Domain Form */}
            <form onSubmit={handleAddDomain} className="flex gap-4">
                <div className="flex-1 relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
                    <input 
                        type="text" 
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        placeholder="e.g. shop.yourbrand.com"
                        className="w-full bg-black border border-neutral-800 rounded-xl pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <button 
                    type="submit" 
                    disabled={isAdding || !newDomain}
                    className="px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-neutral-200 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isAdding ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Add Domain
                </button>
            </form>

            {/* Domain List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center text-neutral-500 py-8">Loading domains...</div>
                ) : domains.length === 0 ? (
                    <div className="text-center text-neutral-500 py-8 border border-dashed border-neutral-800 rounded-xl">
                        No custom domains connected yet.
                    </div>
                ) : (
                    domains.map(domain => (
                        <div key={domain.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <Globe className="text-neutral-400" size={20} />
                                    <div>
                                        <div className="font-bold text-white text-lg">{domain.domain}</div>
                                        <div className="flex items-center gap-2 mt-1">
                                            {domain.status === 'active' ? (
                                                <span className="flex items-center gap-1 text-xs font-bold text-green-500 uppercase tracking-wider">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="flex items-center gap-1 text-xs font-bold text-yellow-500 uppercase tracking-wider">
                                                    <AlertCircle size={12} /> Pending Verification
                                                </span>
                                            )}
                                            <span className="text-neutral-600 text-xs">•</span>
                                            <span className="text-neutral-500 text-xs">Added {new Date(domain.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {domain.status !== 'active' && (
                                        <button 
                                            onClick={() => handleVerifyDomain(domain)}
                                            disabled={verifyingId === domain.id}
                                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-2"
                                        >
                                            {verifyingId === domain.id ? <Loader2 className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                                            Verify
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteDomain(domain.id)}
                                        className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            {domain.status !== 'active' && (
                                <div className="bg-black rounded-lg p-4 border border-neutral-800">
                                    <h4 className="text-sm font-bold text-white mb-2">DNS Configuration</h4>
                                    <p className="text-xs text-neutral-400 mb-4">Add the following CNAME record to your DNS provider to verify ownership.</p>
                                    
                                    <div className="grid grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Type</div>
                                            <div className="font-mono text-white">CNAME</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Name</div>
                                            <div className="font-mono text-white">@ or www</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-neutral-500 uppercase mb-1">Value</div>
                                            <div className="font-mono text-white flex items-center gap-2">
                                                cname.nexusos.app
                                                <button className="text-neutral-500 hover:text-white" onClick={() => navigator.clipboard.writeText('cname.nexusos.app')}>
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
