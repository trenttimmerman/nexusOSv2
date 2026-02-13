import React, { useRef, useEffect } from 'react';

// Declare gsap to avoid TypeScript errors for the CDN-loaded library
declare const gsap: any;

const navItems = [
    { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>, name: 'Home' },
    { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>, name: 'Search' },
    { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, name: 'Info' },
    { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>, name: 'Stats' },
    { icon: <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, name: 'Contact' },
];

const Header11: React.FC = () => {
    const dockRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!dockRef.current || typeof gsap === 'undefined') return;

        const icons = gsap.utils.toArray('.dock-item', dockRef.current);
        const dock = dockRef.current;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX } = e;
            const { left, width } = dock.getBoundingClientRect();
            const mouseX = clientX - left;

            icons.forEach((icon: any) => {
                const iconCenterX = icon.offsetLeft + icon.offsetWidth / 2;
                const distance = Math.abs(mouseX - iconCenterX);
                
                // Max distance for full effect
                const maxDistance = width / 2;
                const scale = gsap.utils.mapRange(0, maxDistance, 2, 1, Math.min(distance, maxDistance));
                
                gsap.to(icon, {
                    scale: scale,
                    duration: 0.1,
                    ease: 'power1.out'
                });
            });
        };

        const handleMouseLeave = () => {
             gsap.to(icons, {
                scale: 1,
                duration: 0.2,
                ease: 'power1.out'
            });
        };

        dock.addEventListener('mousemove', handleMouseMove);
        dock.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            dock.removeEventListener('mousemove', handleMouseMove);
            dock.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <header className="flex justify-center items-center h-32">
            <div ref={dockRef} className="flex items-end h-16 p-3 bg-white/50 backdrop-blur-md rounded-2xl shadow-lg border border-white/30 space-x-2">
                {navItems.map((item, index) => (
                    <a href="#" key={index} title={item.name} className="dock-item w-12 h-12 flex items-center justify-center text-gray-700 cursor-pointer will-change-transform">
                        {item.icon}
                    </a>
                ))}
            </div>
        </header>
    );
};

export default Header11;