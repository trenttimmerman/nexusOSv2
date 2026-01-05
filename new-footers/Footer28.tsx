import React, { useEffect, useRef } from 'react';

const Footer28: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        let width = canvas.offsetWidth;
        let height = canvas.offsetHeight;
        canvas.width = width;
        canvas.height = height;

        let buffer1: number[] = new Array(width * height).fill(0);
        let buffer2: number[] = new Array(width * height).fill(0);
        let temp: number[];
        
        let isRunning = true;

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80';
        imageRef.current = img;

        const disturb = (x: number, y: number, pressure: number) => {
            if (x > 2 && x < width - 2 && y > 2 && y < height - 2) {
                const index = x + y * width;
                buffer1[index] += pressure;
            }
        };

        const process = () => {
            const imgData = ctx.getImageData(0, 0, width, height);
            const data = imgData.data;

            for (let i = 1; i < width - 1; i++) {
                for (let j = 1; j < height - 1; j++) {
                    const index = i + j * width;
                    const shock = ((buffer1[index - 1] + buffer1[index + 1] + buffer1[index - width] + buffer1[index + width]) / 2) - buffer2[index];
                    buffer2[index] = shock * 0.98; // Damping
                }
            }
            
            for (let i = 0; i < width * height; i++) {
                const x = i % width;
                const y = Math.floor(i / width);
                
                const xOffset = Math.floor((buffer2[(x - 1) + y * width] - buffer2[(x + 1) + y * width]));
                const yOffset = Math.floor((buffer2[x + (y - 1) * width] - buffer2[x + (y + 1) * width]));

                const originalIndex = (i) * 4;
                const targetIndex = (i + xOffset + yOffset * width) * 4;

                data[originalIndex] = data[targetIndex];
                data[originalIndex+1] = data[targetIndex+1];
                data[originalIndex+2] = data[targetIndex+2];
            }
            ctx.putImageData(imgData, 0, 0);

            temp = buffer1;
            buffer1 = buffer2;
            buffer2 = temp;
        };

        const drawBg = () => {
            if (imageRef.current?.complete) {
                ctx.drawImage(imageRef.current, 0, 0, width, height);
            }
        }

        const loop = () => {
            if (!isRunning) return;
            drawBg();
            process();
            requestAnimationFrame(loop);
        };
        
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            disturb(Math.floor(e.clientX - rect.left), Math.floor(e.clientY - rect.top), 1500);
        };
        
        canvas.addEventListener('mousemove', handleMouseMove);
        
        img.onload = () => {
             drawBg();
             loop();
        }

        return () => {
            isRunning = false;
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <footer className="relative bg-gray-900 text-gray-300 h-80 flex items-center justify-center">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 text-center text-white p-4">
                 <h2 className="text-4xl font-bold backdrop-blur-sm p-2 rounded">Ripple Effect</h2>
                <p className="backdrop-blur-sm p-1 rounded">Move your mouse to interact.</p>
            </div>
        </footer>
    );
};

export default Footer28;