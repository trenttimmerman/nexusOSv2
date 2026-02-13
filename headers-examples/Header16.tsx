
import React, { useEffect, useRef, useState } from 'react';

// Declare GSAP and ScrollTrigger to avoid TypeScript errors for CDN-loaded libraries
declare const gsap: any;
declare const ScrollTrigger: any;

const Header16: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    const frameCount = 100;
    const getFrameUrl = (frame: number) => 
        `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${frame.toString().padStart(4, '0')}.jpg`;

    useEffect(() => {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        const images: HTMLImageElement[] = [];
        let loadedImages = 0;
        
        const imageSequence = { frame: 0 };

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = getFrameUrl(i);
            img.onload = () => {
                loadedImages++;
                setLoadingProgress(Math.round((loadedImages / frameCount) * 100));
                if (loadedImages === frameCount) {
                    setIsLoaded(true);
                }
            };
            images.push(img);
        }

        if (!isLoaded) return;

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        let isFinalState = false;

        gsap.registerPlugin(ScrollTrigger);
        
        const renderFrame = (frameIndex: number) => {
            if (!images[frameIndex]) return;
            const img = images[frameIndex];
            const hRatio = canvas.width / img.width;
            const vRatio = canvas.height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerShift_x = (canvas.width - img.width * ratio) / 2;
            const centerShift_y = (canvas.height - img.height * ratio) / 2;
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        };

        const timeline = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=2000',
                pin: true,
                scrub: 2, // Increased scrub value for a smoother feel
                onUpdate: (self) => {
                    if (self.progress > 0.05) {
                        gsap.to('.nav-content', { opacity: 1, duration: 0.5 });
                    } else {
                         gsap.to('.nav-content', { opacity: 0, duration: 0.5 });
                    }
                },
                onLeave: () => {
                    isFinalState = true;
                    gsap.to(containerRef.current, {
                        height: '6rem',
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                            ScrollTrigger.refresh();
                        }
                    });
                     gsap.to(canvas, {
                        opacity: 0,
                        duration: 0.3
                    });
                },
                 onEnterBack: () => {
                    isFinalState = false;
                    // FIX: Pre-draw the last frame before animating the canvas back in.
                    // This prevents a black flicker by ensuring the canvas has content
                    // the moment it becomes visible again.
                    renderFrame(frameCount - 1);
                     gsap.to(containerRef.current, {
                        height: '100vh',
                        duration: 0.5,
                        ease: 'power2.inOut',
                        onComplete: () => {
                             ScrollTrigger.refresh();
                        }
                    });
                     gsap.to(canvas, {
                        opacity: 1,
                        duration: 0.3
                    });
                }
            }
        });

        timeline.to(imageSequence, {
            frame: frameCount - 1,
            snap: 'frame',
            ease: 'none',
            onUpdate: () => renderFrame(imageSequence.frame),
        });

        images[0].onload = () => renderFrame(0);

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                if (!isFinalState) {
                   renderFrame(imageSequence.frame);
                }
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, [isLoaded]);

    return (
        <>
            <div ref={containerRef} className="h-screen w-full bg-black relative flex items-center justify-center overflow-hidden">
                {!isLoaded && (
                     <div className="absolute z-20 text-white text-center">
                        <div className="text-2xl font-bold">{loadingProgress}%</div>
                        <div className="text-sm text-gray-400">Loading Cinematic Experience...</div>
                    </div>
                )}
                <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
                <div className="nav-content absolute top-0 left-0 w-full z-10 opacity-0 transition-opacity duration-500">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
                        <span className="text-white font-bold text-2xl">AirPods Pro</span>
                        <nav className="hidden md:flex space-x-8 text-sm font-medium text-gray-300">
                            <a href="#" className="hover:text-white">Tech Specs</a>
                            <a href="#" className="hover:text-white">Compare</a>
                            <a href="#" className="bg-white text-black px-4 py-2 rounded-full font-semibold hover:bg-gray-200">Buy</a>
                        </nav>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header16;