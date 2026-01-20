import React, { useState } from 'react';

const Settings: React.FC = () => {
    const [profile, setProfile] = useState({
        name: 'Alex Morgan',
        email: 'alex@webpilot.com',
        title: 'Founder & CEO',
        avatar: 'https://placehold.co/40x40/a78bfa/ffffff?text=A',
    });

    const [notifications, setNotifications] = useState({
        newOrders: true,
        lowStock: true,
        promotions: false,
        weeklySummary: true,
    });

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleNotificationToggle = (key: keyof typeof notifications) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const ToggleSwitch: React.FC<{ checked: boolean, onChange: () => void }> = ({ checked, onChange }) => (
        <button
            type="button"
            onClick={onChange}
            className={`${
                checked ? 'bg-cyan-500' : 'bg-gray-700'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
            role="switch"
            aria-checked={checked}
        >
            <span
                aria-hidden="true"
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );

    return (
        <div className="fade-in-widget">
            <h1 className="text-3xl font-bold text-white mb-8">Settings</h1>

            <div className="space-y-10">
                {/* Profile Section */}
                <div className="dash-glass-card rounded-2xl">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Profile</h3>
                        <p className="text-sm text-gray-400 mt-1">Update your personal information and profile picture.</p>
                    </div>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-4">
                            <img src={profile.avatar} alt="Avatar" className="w-16 h-16 rounded-full"/>
                            <div>
                                <button className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">Change Avatar</button>
                                <p className="text-xs text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                            </div>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                                <input type="text" id="name" name="name" value={profile.name} onChange={handleProfileChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"/>
                            </div>
                             <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                                <input type="text" id="title" name="title" value={profile.title} onChange={handleProfileChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"/>
                            </div>
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                            <input type="email" id="email" name="email" value={profile.email} onChange={handleProfileChange} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"/>
                        </div>
                    </div>
                     <div className="p-6 bg-gray-900/50 rounded-b-2xl text-right">
                        <button className="bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg text-sm">Save Changes</button>
                    </div>
                </div>

                {/* Notifications Section */}
                <div className="dash-glass-card rounded-2xl">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Notifications</h3>
                        <p className="text-sm text-gray-400 mt-1">Manage how you receive notifications from WebPilot.</p>
                    </div>
                    <div className="p-6 space-y-4 divide-y divide-gray-800">
                        <div className="flex justify-between items-center pt-4 first:pt-0">
                            <div>
                                <p className="font-medium text-white">New Orders</p>
                                <p className="text-sm text-gray-400">Receive an email for every new order placed in your store.</p>
                            </div>
                            <ToggleSwitch checked={notifications.newOrders} onChange={() => handleNotificationToggle('newOrders')} />
                        </div>
                         <div className="flex justify-between items-center pt-4">
                            <div>
                                <p className="font-medium text-white">Low Stock Alerts</p>
                                <p className="text-sm text-gray-400">Get notified when a product's inventory is running low.</p>
                            </div>
                            <ToggleSwitch checked={notifications.lowStock} onChange={() => handleNotificationToggle('lowStock')} />
                        </div>
                         <div className="flex justify-between items-center pt-4">
                            <div>
                                <p className="font-medium text-white">Promotions & Updates</p>
                                <p className="text-sm text-gray-400">Receive updates on new features and promotional offers from WebPilot.</p>
                            </div>
                            <ToggleSwitch checked={notifications.promotions} onChange={() => handleNotificationToggle('promotions')} />
                        </div>
                         <div className="flex justify-between items-center pt-4">
                            <div>
                                <p className="font-medium text-white">Weekly Summary</p>
                                <p className="text-sm text-gray-400">Get a weekly performance report delivered to your inbox.</p>
                            </div>
                            <ToggleSwitch checked={notifications.weeklySummary} onChange={() => handleNotificationToggle('weeklySummary')} />
                        </div>
                    </div>
                </div>

                 {/* Billing Section */}
                <div className="dash-glass-card rounded-2xl">
                    <div className="p-6 border-b border-gray-800">
                        <h3 className="text-lg font-semibold text-white">Billing</h3>
                        <p className="text-sm text-gray-400 mt-1">Manage your subscription and payment methods.</p>
                    </div>
                    <div className="p-6">
                        <div className="bg-gray-900/50 rounded-lg p-4 flex justify-between items-center">
                            <div>
                                <p className="text-sm text-purple-300 font-semibold">WebPilot Pro Plan</p>
                                <p className="text-gray-400 text-sm">Next payment of $99 on July 31, 2025.</p>
                            </div>
                            <button className="bg-gray-700 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">Manage Plan</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
