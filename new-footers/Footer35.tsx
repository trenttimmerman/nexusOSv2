import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Footer35: React.FC = () => {
    const mountRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;
        
        let animationFrameId: number;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.offsetWidth / currentMount.offsetHeight, 0.1, 1000);
        camera.position.set(0, 3, 6);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.offsetWidth, currentMount.offsetHeight);
        currentMount.appendChild(renderer.domElement);
        
        const planeSize = 20;
        const segments = 100;
        const geometry = new THREE.PlaneGeometry(planeSize, planeSize, segments, segments);
        
        const vertices = [];
        const colors = [];
        const baseColor = new THREE.Color('#083344'); // cyan-900
        const peakColor = new THREE.Color('#67e8f9'); // cyan-300
        
        for (let i = 0; i < geometry.attributes.position.count; i++) {
            const x = geometry.attributes.position.getX(i);
            const y = geometry.attributes.position.getY(i);
            // Multi-layered noise for more interesting terrain
            const z = (Math.sin(x * 0.5) * Math.cos(y * 0.5)) + (Math.sin(x * 1.5) * 0.2);
            vertices.push(x, z, -y);

            const color = new THREE.Color();
            const alpha = (z + 1.2) / 2.4; // Normalize height to 0-1 range
            color.lerpColors(baseColor, peakColor, alpha);
            colors.push(color.r, color.g, color.b);
        }

        const newGeo = new THREE.BufferGeometry();
        newGeo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        newGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const material = new THREE.PointsMaterial({ 
            size: 0.05, 
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
        });
        const points = new THREE.Points(newGeo, material);
        scene.add(points);

        let clock = 0;
        
        const animate = () => {
            clock += 0.002;
            points.rotation.y = clock;

            // Mouse interaction
            const colorAttribute = points.geometry.attributes.color as THREE.BufferAttribute;
            const positionAttribute = points.geometry.attributes.position as THREE.BufferAttribute;
            
            for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
                const screenPos = vertex.clone().project(camera);
                
                const distance = Math.sqrt(Math.pow(screenPos.x - mousePos.current.x, 2) + Math.pow(screenPos.y - mousePos.current.y, 2));

                const z = positionAttribute.getY(i);
                const alpha = (z + 1.2) / 2.4;
                const base = new THREE.Color().lerpColors(baseColor, peakColor, alpha);

                const highlightIntensity = Math.max(0, 1 - distance * 2);
                const finalColor = base.lerp(new THREE.Color('white'), highlightIntensity);
                
                colorAttribute.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
            }
            colorAttribute.needsUpdate = true;
            
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
            mousePos.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            if (currentMount) {
                 currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };

    }, []);

    return (
        <footer className="relative bg-black text-gray-300 h-96 flex flex-col justify-end">
            <div ref={mountRef} className="absolute inset-0 z-0"></div>
             <div className="relative z-10 max-w-7xl mx-auto w-full py-12 px-4 sm:px-6 lg:px-8 flex justify-between items-end">
                <div>
                    <h3 className="text-2xl font-bold text-white">DataScape</h3>
                    <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} All rights reserved.</p>
                </div>
                 <div className="flex space-x-6 text-sm">
                    <a href="#" className="hover:text-white">API</a>
                    <a href="#" className="hover:text-white">Status</a>
                    <a href="#" className="hover:text-white">Docs</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer35;