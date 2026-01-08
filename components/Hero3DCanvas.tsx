import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const Hero3DCanvas: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current || typeof THREE === 'undefined') {
            return;
        }

        let scene: any, camera: any, renderer: any, crystal: any;
        const container = containerRef.current;
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        let velocity = { x: 0.003, y: 0.003 };
        const damping = 0.98;
        const sensitivity = 0.005;

        const init = () => {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            camera.position.z = 3;

            renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
            renderer.setSize(container.clientWidth, container.clientHeight);
            renderer.setPixelRatio(window.devicePixelRatio);
            container.appendChild(renderer.domElement);

            const geometry = new THREE.IcosahedronGeometry(1.2, 0);
            const material = new THREE.MeshStandardMaterial({
                color: 0x06b6d4,
                emissive: 0x8b5cf6,
                wireframe: true,
                roughness: 0.4,
                metalness: 0.1
            });
            crystal = new THREE.Mesh(geometry, material);
            scene.add(crystal);

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
            scene.add(ambientLight);
            const pointLight1 = new THREE.PointLight(0xa78bfa, 2, 10);
            pointLight1.position.set(5, 5, 5);
            scene.add(pointLight1);
            const pointLight2 = new THREE.PointLight(0x06b6d4, 2, 10);
            pointLight2.position.set(-5, -5, 2);
            scene.add(pointLight2);

            animate();
        };

        const animate = () => {
            if (!renderer) return;
            requestAnimationFrame(animate);

            if (!isDragging) {
                // Apply friction/inertia when not dragging
                velocity.x *= damping;
                velocity.y *= damping;

                // Ensure it keeps moving at a minimum speed
                if (Math.abs(velocity.x) < 0.003 && Math.abs(velocity.y) < 0.003) {
                    velocity.x += (0.003 - velocity.x) * 0.05;
                    velocity.y += (0.003 - velocity.y) * 0.05;
                }
            }

            // Continuous rotation based on velocity
            crystal.rotation.x += velocity.x;
            crystal.rotation.y += velocity.y;

            renderer.render(scene, camera);
        };

        const onWindowResize = () => {
            if (container.clientWidth > 0 && container.clientHeight > 0) {
                camera.aspect = container.clientWidth / container.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        };

        const onMouseDown = (event: MouseEvent) => {
            isDragging = true;
            container.style.cursor = 'grabbing';
            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onMouseUp = () => {
            isDragging = false;
            container.style.cursor = 'grab';
        };

        const onMouseMove = (event: MouseEvent) => {
            if (!isDragging) return;
            
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;

            // Direct rotation while dragging
            crystal.rotation.y += deltaX * sensitivity;
            crystal.rotation.x += deltaY * sensitivity;

            // Store current movement as velocity for release
            velocity.y = deltaX * sensitivity;
            velocity.x = deltaY * sensitivity;

            previousMousePosition = { x: event.clientX, y: event.clientY };
        };

        const onTouchStart = (event: TouchEvent) => {
            if (event.touches.length === 1) {
                isDragging = true;
                previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
            }
        };

        const onTouchEnd = () => {
            isDragging = false;
        };

        const onTouchMove = (event: TouchEvent) => {
            if (!isDragging || event.touches.length !== 1) return;
            event.preventDefault();

            const deltaX = event.touches[0].clientX - previousMousePosition.x;
            const deltaY = event.touches[0].clientY - previousMousePosition.y;

            // Direct rotation while dragging
            crystal.rotation.y += deltaX * sensitivity;
            crystal.rotation.x += deltaY * sensitivity;

            // Store current movement as velocity for release
            velocity.y = deltaX * sensitivity;
            velocity.x = deltaY * sensitivity;

            previousMousePosition = { x: event.touches[0].clientX, y: event.touches[0].clientY };
        };

        init();
        onWindowResize();

        window.addEventListener('resize', onWindowResize);
        container.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousemove', onMouseMove);
        container.addEventListener('touchstart', onTouchStart, { passive: true });
        window.addEventListener('touchend', onTouchEnd);
        window.addEventListener('touchmove', onTouchMove, { passive: false });

        return () => {
            window.removeEventListener('resize', onWindowResize);
            if (container) {
                container.removeEventListener('mousedown', onMouseDown);
                container.removeEventListener('touchstart', onTouchStart);
            }
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchend', onTouchEnd);
            window.removeEventListener('touchmove', onTouchMove);
            if (renderer) {
                renderer.dispose();
                if (container && renderer.domElement) {
                   container.removeChild(renderer.domElement);
                }
            }
            renderer = null;
        };
    }, []);

    return <div id="hero-3d-canvas" ref={containerRef} />;
};

export default Hero3DCanvas;
