import React, { useState, useEffect, useRef } from 'react';

const commands = [
    { name: 'Home', action: () => alert('Navigating to Home...'), category: 'Navigation' },
    { name: 'About Us', action: () => alert('Navigating to About Us...'), category: 'Navigation' },
    { name: 'Pricing', action: () => alert('Navigating to Pricing...'), category: 'Navigation' },
    { name: 'Documentation', action: () => alert('Navigating to Docs...'), category: 'Navigation' },
    { name: 'Copy Current URL', action: () => navigator.clipboard.writeText(window.location.href), category: 'Actions' },
    { name: 'Toggle Dark Mode', action: () => document.documentElement.classList.toggle('dark'), category: 'Actions' },
    { name: 'Contact Support', action: () => alert('Opening support...'), category: 'Contact' },
    { name: 'Follow on Twitter', action: () => window.open('https://twitter.com', '_blank'), category: 'Social' },
];

const CommandPalette: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const filteredCommands = commands.filter(command =>
        command.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        command.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-black/5" onClick={e => e.stopPropagation()}>
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search commands or pages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-4 bg-transparent text-gray-800 dark:text-white outline-none border-b border-gray-200 dark:border-gray-700"
                />
                <ul className="max-h-80 overflow-y-auto">
                    {filteredCommands.map((command, index) => (
                        <li key={index}>
                            <button
                                onClick={() => { command.action(); onClose(); }}
                                className="w-full text-left p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-600 dark:text-gray-300 flex justify-between items-center"
                            >
                                <span>{command.name}</span>
                                <span className="text-xs text-gray-400 dark:text-gray-500">{command.category}</span>
                            </button>
                        </li>
                    ))}
                    {filteredCommands.length === 0 && (
                         <li className="p-4 text-gray-500">No results found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

interface Header9Props {
    isSticky?: boolean;
}

const Header9: React.FC<Header9Props> = ({ isSticky = false }) => {
    const [isPaletteOpen, setPaletteOpen] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey))) {
                e.preventDefault();
                setPaletteOpen(open => !open);
            }
             if (e.key === 'Escape') {
                setPaletteOpen(false);
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);
    
     const headerClasses = `
        bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800
        ${isSticky ? 'sticky top-0 z-40 w-full' : ''}
    `;

    return (
        <>
            <header className={headerClasses}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <a href="#" className="font-bold text-gray-800 dark:text-white">CMD.NAV</a>
                        <button onClick={() => setPaletteOpen(true)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2 border border-gray-300 dark:border-gray-700 rounded-md px-3 py-1.5">
                            <span>Search...</span>
                            <kbd className="px-2 py-1 text-xs font-sans font-semibold text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md">⌘K</kbd>
                        </button>
                    </div>
                </div>
            </header>
            {isPaletteOpen && <CommandPalette onClose={() => setPaletteOpen(false)} />}
        </>
    );
};

export default Header9;