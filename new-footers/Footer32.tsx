import React, { useEffect, useRef } from 'react';

interface Star {
    x: number;
    y: number;
    radius: number;
    vx: number;
    vy: number;
}

const Footer32: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mousePos = useRef({ x: -9999, y: -9999 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        let stars: Star[] = [];
        for (let i = 0; i < 150; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1 + 0.5,
                vx: (Math.random() - 0.5) / 4,
                vy: (Math.random() - 0.5) / 4,
            });
        }
        
        let animationFrameId: number;

        const draw = () => {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#030712'; // gray-950
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = 'white';
            stars.forEach(star => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fill();

                star.x += star.vx;
                star.y += star.vy;
                if (star.x < 0 || star.x > width) star.vx = -star.vx;
                if (star.y < 0 || star.y > height) star.vy = -star.vy;
            });
            
            // Draw constellations
            const connectRadius = 100;
            const mouseConnectRadius = 150;

            for (let i = 0; i < stars.length; i++) {
                // Connect to mouse
                let dMouse = Math.sqrt(Math.pow(mousePos.current.x - stars[i].x, 2) + Math.pow(mousePos.current.y - stars[i].y, 2));
                if (dMouse < mouseConnectRadius) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(mousePos.current.x, mousePos.current.y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dMouse / mouseConnectRadius})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }

                // Connect to other stars
                for (let j = i; j < stars.length; j++) {
                    let d = Math.sqrt(Math.pow(stars[i].x - stars[j].x, 2) + Math.pow(stars[i].y - stars[j].y, 2));
                    if (d < connectRadius) {
                        ctx.beginPath();
                        ctx.moveTo(stars[i].x, stars[i].y);
                        ctx.lineTo(stars[j].x, stars[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 - d / (connectRadius * 10)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            
            animationFrameId = requestAnimationFrame(draw);
        };
        
        draw();
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mousePos.current.x = e.clientX - rect.left;
            mousePos.current.y = e.clientY - rect.top;
        };

        const handleMouseOut = () => {
             mousePos.current.x = -9999;
             mousePos.current.y = -9999;
        }
        
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseout', handleMouseOut);

        return () => {
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener('mousemove', handleMouseMove);
            canvas.removeEventListener('mouseout', handleMouseOut);
        };
    }, []);

    return (
         <footer className="relative bg-gray-950 text-gray-300 h-80 flex flex-col items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
             <div className="relative z-10 text-center text-white p-4">
                 <h2 className="text-4xl font-bold">Connect the Dots</h2>
                <p>Interactive constellation map. Move your mouse.</p>
                <div className="mt-6 flex justify-center gap-6 text-sm">
                    <a href="#" className="hover:underline">Home</a>
                    <a href="#" className="hover:underline">About</a>
                    <a href="#" className="hover:underline">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer32;