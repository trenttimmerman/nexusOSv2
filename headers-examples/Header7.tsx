import React, { useRef, useEffect } from 'react';

// Declare gsap to avoid TypeScript errors for the CDN-loaded library
declare const gsap: any;

interface Header7Props {
    isSticky?: boolean;
}

const MagneticLink: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const ref = useRef<HTMLAnchorElement>(null);

    useEffect(() => {
        if (!ref.current || typeof gsap === 'undefined') return;
        const xTo = gsap.quickTo(ref.current, "x", { duration: 0.8, ease: "power4.out" });
        const yTo = gsap.quickTo(ref.current, "y", { duration: 0.8, ease: "power4.out" });

        const mouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { height, width, left, top } = ref.current!.getBoundingClientRect();
            const x = clientX - (left + width / 2);
            const y = clientY - (top + height / 2);
            xTo(x * 0.4);
            yTo(y * 0.4);
        };

        const mouseLeave = () => {
            xTo(0);
            yTo(0);
        };
        
        const currentRef = ref.current;
        currentRef.addEventListener("mousemove", mouseMove);
        currentRef.addEventListener("mouseleave", mouseLeave);

        return () => {
            currentRef.removeEventListener("mousemove", mouseMove);
            currentRef.removeEventListener("mouseleave", mouseLeave);
        };
    }, []);

    return (
        <a href="#" ref={ref} className="px-4 py-2 text-gray-700 hover:text-black transition-colors duration-300">
            {children}
        </a>
    );
};


const Header7: React.FC<Header7Props> = ({ isSticky = false }) => {
    const headerClasses = `
        bg-white
        ${isSticky ? 'sticky top-0 z-50 w-full shadow-sm' : 'relative'}
    `;

    return (
        <header className={headerClasses}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="font-bold text-xl tracking-wider">MAGNETIC</div>
                    <nav className="hidden md:flex items-center">
                        <MagneticLink>Work</MagneticLink>
                        <MagneticLink>Studio</MagneticLink>
                        <MagneticLink>Contact</MagneticLink>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header7;