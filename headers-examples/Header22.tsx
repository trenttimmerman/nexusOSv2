import React, { useEffect, useRef, useState } from 'react';

const Header22: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: -9999, y: -9999 });
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        let particles: any[] = [];
        const particleCount = 70;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 1.5 + 1,
            });
        }
        
        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                // Mouse interaction
                const dx = mousePos.current.x - p.x;
                const dy = mousePos.current.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 100) {
                    p.vx -= dx / 500;
                    p.vy -= dy / 500;
                }
                
                // Physics
                p.x += p.vx;
                p.y += p.vy;
                
                // Friction
                p.vx *= 0.98;
                p.vy *= 0.98;
                
                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.current.x = e.clientX - rect.left;
            mousePos.current.y = e.clientY - rect.top;
        };
        
        const handleMouseOut = () => {
            mousePos.current = { x: -9999, y: -9999 };
        };

        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseout', handleMouseOut);

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isScrolled]);

     const headerClasses = `
        text-white overflow-hidden transition-all duration-500 ease-in-out sticky top-0 z-50
        ${isScrolled 
            ? 'h-20 bg-gray-900 shadow-lg' 
            : 'h-28 bg-gray-900'
        }
    `;

    return (
        <header className={headerClasses}>
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                <div className="flex justify-between items-center h-full">
                    <span className="text-3xl font-bold">PARTICLE</span>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold">
                        <a href="#" className="hover:opacity-80">Flow</a>
                        <a href="#" className="hover:opacity-80">Field</a>
                        <a href="#" className="hover:opacity-80">Form</a>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header22;