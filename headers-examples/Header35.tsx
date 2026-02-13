import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const Header35: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        
        let animationFrameId: number;

        const scene = new THREE.Scene();
        // FIX: Use false for alpha channel since we have a solid bg
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
        renderer.setSize(currentMount.offsetWidth, currentMount.offsetHeight);
        currentMount.appendChild(renderer.domElement);
        
        const camera = new THREE.PerspectiveCamera(75, currentMount.offsetWidth / currentMount.offsetHeight, 0.1, 1000);
        
        // FIX: Create a group to act as a camera pivot for smoother rotation
        const cameraGroup = new THREE.Group();
        scene.add(cameraGroup);
        cameraGroup.add(camera);
        camera.position.set(0, 3, 6);
        camera.lookAt(scene.position);

        const planeSize = 20;
        const segments = 100;
        const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
        
        const vertices = [];
        const colors = [];
        // FIX: Use brighter colors for visibility on black background
        const baseColor = new THREE.Color('#06b6d4'); // cyan-500
        const peakColor = new THREE.Color('#ecfeff'); // cyan-50
        
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);
            const z = (Math.sin(x * 0.5) * Math.cos(y * 0.5)) + (Math.sin(x * 1.5) * 0.2);
            vertices.push(x, z, -y);

            const color = new THREE.Color();
            const alpha = (z + 1.2) / 2.4;
            color.lerpColors(baseColor, peakColor, alpha);
            colors.push(color.r, color.g, color.b);
        }

        const newGeo = new THREE.BufferGeometry();
        newGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        newGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({ size: 0.05, vertexColors: true });
        const points = new THREE.Points(newGeo, material);
        scene.add(points);

        let clock = 0;
        const animate = () => {
            clock += 0.002;
            points.rotation.y = clock;

            // FIX: Smoothly rotate the camera group instead of translating camera position
            cameraGroup.rotation.y += (mousePos.current.x * 0.3 - cameraGroup.rotation.y) * 0.05;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };
        animate();
        
        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.offsetWidth / currentMount.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.offsetWidth, currentMount.offsetHeight);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mousePos.current.x = (e.clientX / window.innerWidth) * 2 - 1;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (currentMount && renderer.domElement.parentElement === currentMount) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            newGeo.dispose();
            material.dispose();
            renderer.dispose();
        };

    }, []);
    
    const headerClasses = `
        sticky top-0 z-50 transition-all duration-500 ease-in-out bg-black
        ${isScrolled ? 'h-24' : 'h-80'}
    `;

    return (
        <header className={headerClasses}>
            {/* FIX: Removed opacity-70 for better visibility */}
            <div ref={mountRef} className="absolute inset-0 z-0"></div>
             <div className="relative z-10 max-w-7xl mx-auto w-full h-full px-4 sm:px-6 lg:px-8 flex justify-between items-center text-white">
                <a href="#" className="text-3xl font-bold" style={{textShadow: '1px 1px 8px rgba(0,0,0,0.8)'}}>DATASCAPE</a>
                 <nav className="flex space-x-6 text-sm font-semibold">
                    <a href="#" className="hover:opacity-80" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>API</a>
                    <a href="#" className="hover:opacity-80" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>Status</a>
                    <a href="#" className="hover:opacity-80" style={{textShadow: '1px 1px 4px rgba(0,0,0,0.8)'}}>Docs</a>
                </nav>
            </div>
        </header>
    );
};

export default Header35;