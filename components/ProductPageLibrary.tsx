import React, { useRef, useEffect, useState } from 'react';
import { Product } from '../types';
import { ShoppingBag, Star, ChevronRight, Share2, Heart, ShieldCheck, Truck, RefreshCw, ArrowRight, Sparkles } from 'lucide-react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ProductCustomizer } from './ProductCustomizer';

interface ProductPageProps {
    product: Product;
    onAddToCart?: (product: Product, variantId?: string, variantTitle?: string) => void;
}

const VariantSelector: React.FC<{
    product: Product;
    selectedOptions: Record<string, string>;
    onChange: (optionName: string, value: string) => void;
}> = ({ product, selectedOptions, onChange }) => {
    if (!product.hasVariants || !product.variantOptions) return null;

    return (
        <div className="space-y-4 mb-6">
            {product.variantOptions.map((option) => (
                <div key={option.id}>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                        {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => (
                            <button
                                key={value}
                                onClick={() => onChange(option.name, value)}
                                className={`px-4 py-2 rounded-full text-sm border transition-all ${
                                    selectedOptions[option.name] === value
                                        ? 'border-black bg-black text-white'
                                        : 'border-neutral-200 hover:border-neutral-400 text-neutral-900'
                                }`}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

// 1. Standard (Classic E-commerce)
export const ProductPageStandard: React.FC<ProductPageProps> = ({ product, onAddToCart }) => {
    const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null); // Use ProductVariant type if available

    const mainImage = selectedVariant?.imageId 
        ? product.images.find(img => img.id === selectedVariant.imageId)?.url || product.image 
        : (product.image || product.images[0]?.url);

    useEffect(() => {
        if (product.hasVariants && product.variantOptions?.length > 0) {
            const defaults: Record<string, string> = {};
            product.variantOptions.forEach(opt => {
                defaults[opt.name] = opt.values[0];
            });
            setSelectedOptions(defaults);
        }
    }, [product]);

    useEffect(() => {
        if (product.hasVariants && product.variants) {
            const variant = product.variants.find(v => 
                Object.entries(v.options).every(([key, val]) => selectedOptions[key] === val)
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedOptions, product]);

    const handleAddToCart = () => {
        if (product.hasVariants) {
            if (selectedVariant && onAddToCart) {
                onAddToCart(product, selectedVariant.id, selectedVariant.title);
            }
        } else {
            onAddToCart?.(product);
        }
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const isOutOfStock = product.hasVariants ? (selectedVariant?.stock === 0) : (product.stock === 0);

    return (
    <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="space-y-4">
                <div className="aspect-[3/4] bg-neutral-100 rounded-2xl overflow-hidden">
                    {mainImage && <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />}
                </div>
                {product.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-4">
                        {product.images.map((img) => (
                            <div 
                                key={img.id} 
                                className="aspect-square bg-neutral-100 rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-black transition-all"
                                onClick={() => {
                                    // Optional: Select variant associated with image if any
                                }}
                            >
                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col justify-center">
                <div className="mb-6">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                        <span>Home</span>
                        <ChevronRight size={14} />
                        <span>{product.category || 'Shop'}</span>
                    </div>
                    <h1 className="text-4xl font-bold text-neutral-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-4 mb-6">
                        <span className="text-2xl font-medium text-neutral-900">${(currentPrice / 100).toFixed(2)}</span>
                        {product.compareAtPrice && (
                            <span className="text-lg text-neutral-400 line-through">${product.compareAtPrice.toFixed(2)}</span>
                        )}
                    </div>
                </div>

                <div className="prose prose-neutral mb-8" dangerouslySetInnerHTML={{ __html: product.description }} />

                <VariantSelector 
                    product={product} 
                    selectedOptions={selectedOptions} 
                    onChange={(name, value) => setSelectedOptions(prev => ({ ...prev, [name]: value }))} 
                />

                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={handleAddToCart}
                        disabled={isOutOfStock}
                        className={`flex-1 h-14 rounded-full font-bold text-lg transition-all flex items-center justify-center gap-3 ${
                            isOutOfStock 
                            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                            : 'bg-black text-white hover:bg-neutral-800'
                        }`}
                    >
                        <ShoppingBag size={20} /> 
                        {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    {product.allowCustomization && (
                        <button 
                            onClick={() => setIsCustomizerOpen(true)}
                            className="flex-1 bg-blue-600 text-white h-14 rounded-full font-bold text-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                        >
                            <Sparkles size={20} /> Customize Now
                        </button>
                    )}

                    <button className="w-14 h-14 border border-neutral-200 rounded-full flex items-center justify-center hover:border-black transition-colors">
                        <Heart size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-8">
                    <div className="text-center">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2"><Truck size={18} /></div>
                        <span className="text-xs font-bold text-neutral-500 uppercase">Free Shipping</span>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2"><ShieldCheck size={18} /></div>
                        <span className="text-xs font-bold text-neutral-500 uppercase">Lifetime Warranty</span>
                    </div>
                    <div className="text-center">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-2"><RefreshCw size={18} /></div>
                        <span className="text-xs font-bold text-neutral-500 uppercase">Free Returns</span>
                    </div>
                </div>
            </div>
        </div>

        {isCustomizerOpen && (
            <ProductCustomizer 
                product={product} 
                onClose={() => setIsCustomizerOpen(false)} 
                onAddToCart={(data) => {
                    console.log('Added custom product:', data);
                    setIsCustomizerOpen(false);
                }} 
            />
        )}
    </div>
    );
};

// 2. Split (Modern, Full Height)
export const ProductPageSplit: React.FC<ProductPageProps> = ({ product, onAddToCart }) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const mainImage = selectedVariant?.imageId 
        ? product.images.find(img => img.id === selectedVariant.imageId)?.url || product.image 
        : (product.image || product.images[0]?.url);

    useEffect(() => {
        if (product.hasVariants && product.variantOptions?.length > 0) {
            const defaults: Record<string, string> = {};
            product.variantOptions.forEach(opt => {
                defaults[opt.name] = opt.values[0];
            });
            setSelectedOptions(defaults);
        }
    }, [product]);

    useEffect(() => {
        if (product.hasVariants && product.variants) {
            const variant = product.variants.find(v => 
                Object.entries(v.options).every(([key, val]) => selectedOptions[key] === val)
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedOptions, product]);

    const handleAddToCart = () => {
        if (product.hasVariants) {
            if (selectedVariant && onAddToCart) {
                onAddToCart(product, selectedVariant.id, selectedVariant.title);
            }
        } else {
            onAddToCart?.(product);
        }
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const isOutOfStock = product.hasVariants ? (selectedVariant?.stock === 0) : (product.stock === 0);

    return (
    <div className="flex flex-col lg:flex-row min-h-screen">
        <div className="lg:w-1/2 bg-neutral-100 relative">
            {mainImage && <img src={mainImage} className="w-full h-full object-cover absolute inset-0" alt={product.name} />}
        </div>
        <div className="lg:w-1/2 p-12 lg:p-24 flex flex-col justify-center bg-white">
            <span className="text-sm font-bold tracking-widest uppercase text-neutral-400 mb-4">{product.category}</span>
            <h1 className="text-5xl lg:text-6xl font-black text-neutral-900 mb-6 leading-none">{product.name}</h1>
            <p className="text-3xl font-light text-neutral-600 mb-12">${(currentPrice / 100).toFixed(2)}</p>

            <div className="prose prose-lg prose-neutral mb-12" dangerouslySetInnerHTML={{ __html: product.description }} />

            <VariantSelector 
                product={product} 
                selectedOptions={selectedOptions} 
                onChange={(name, value) => setSelectedOptions(prev => ({ ...prev, [name]: value }))} 
            />

            <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full h-16 text-xl font-bold transition-all flex items-center justify-center gap-3 mb-6 ${
                    isOutOfStock 
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-neutral-900'
                }`}
            >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'} <ArrowRight size={20} />
            </button>

            <p className="text-center text-xs text-neutral-400 uppercase tracking-widest">Free shipping worldwide on all orders</p>
        </div>
    </div>
    );
};

// 3. Minimal (Centered, Clean)
export const ProductPageMinimal: React.FC<ProductPageProps> = ({ product, onAddToCart }) => {
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
    const [selectedVariant, setSelectedVariant] = useState<any>(null);

    const mainImage = selectedVariant?.imageId 
        ? product.images.find(img => img.id === selectedVariant.imageId)?.url || product.image 
        : (product.image || product.images[0]?.url);

    useEffect(() => {
        if (product.hasVariants && product.variantOptions?.length > 0) {
            const defaults: Record<string, string> = {};
            product.variantOptions.forEach(opt => {
                defaults[opt.name] = opt.values[0];
            });
            setSelectedOptions(defaults);
        }
    }, [product]);

    useEffect(() => {
        if (product.hasVariants && product.variants) {
            const variant = product.variants.find(v => 
                Object.entries(v.options).every(([key, val]) => selectedOptions[key] === val)
            );
            setSelectedVariant(variant || null);
        }
    }, [selectedOptions, product]);

    const handleAddToCart = () => {
        if (product.hasVariants) {
            if (selectedVariant && onAddToCart) {
                onAddToCart(product, selectedVariant.id, selectedVariant.title);
            }
        } else {
            onAddToCart?.(product);
        }
    };

    const currentPrice = selectedVariant ? selectedVariant.price : product.price;
    const isOutOfStock = product.hasVariants ? (selectedVariant?.stock === 0) : (product.stock === 0);

    return (
    <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <span className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-6 block">{product.category}</span>
        <h1 className="text-5xl font-serif italic mb-4">{product.name}</h1>
        <p className="text-xl text-neutral-600 mb-12">${(currentPrice / 100).toFixed(2)}</p>

        <div className="aspect-[4/3] bg-neutral-100 mb-12 overflow-hidden">
            {mainImage && <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />}
        </div>

        <div className="max-w-xl mx-auto prose prose-neutral mb-12" dangerouslySetInnerHTML={{ __html: product.description }} />

        <div className="flex justify-center mb-8">
            <VariantSelector 
                product={product} 
                selectedOptions={selectedOptions} 
                onChange={(name, value) => setSelectedOptions(prev => ({ ...prev, [name]: value }))} 
            />
        </div>

        <button 
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`px-12 py-4 border-2 font-bold uppercase tracking-widest transition-colors ${
                isOutOfStock 
                ? 'border-neutral-200 text-neutral-400 cursor-not-allowed' 
                : 'border-black text-black hover:bg-black hover:text-white'
            }`}
        >
            {isOutOfStock ? 'Out of Stock' : 'Add to Bag'}
        </button>
    </div>
    );
};

// 4. Gallery (Grid, Visual Heavy)
export const ProductPageGallery: React.FC<ProductPageProps> = ({ product }) => {
    const imagesToDisplay = (product.images.length > 0 ? product.images : (product.image ? [{ id: '1', url: product.image }] : [])).slice(0, 4);

    return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-1">
            {imagesToDisplay.map((img, i) => (
                <div key={i} className="aspect-[4/5] bg-neutral-100 relative group overflow-hidden">
                    <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="" />
                </div>
            ))}
        </div>

        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <div className="flex items-center justify-center gap-4 mb-8">
                <span className="text-2xl">${(product.price / 100).toFixed(2)}</span>
            </div>
            <button className="w-full md:w-auto px-16 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-colors shadow-xl shadow-blue-600/20">
                Add to Cart
            </button>
        </div>
    </div>
    );
};

// 5. Immersive (Dark Mode, Premium)
export const ProductPageImmersive: React.FC<ProductPageProps> = ({ product }) => {
    const mainImage = product.image || product.images[0]?.url;
    return (
    <div className="min-h-screen bg-neutral-900 text-white flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-40">
            {mainImage && <img src={mainImage} className="w-full h-full object-cover blur-sm scale-110" alt="" />}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
                <div>
                    <span className="text-blue-500 font-mono text-sm mb-2 block">NEW ARRIVAL // 2024</span>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4">{product.name}</h1>
                    <p className="text-2xl text-neutral-400 font-light">${(product.price / 100).toFixed(2)}</p>
                </div>

                <div className="prose prose-invert prose-lg opacity-80" dangerouslySetInnerHTML={{ __html: product.description }} />

                <div className="flex gap-4 pt-8">
                    <button className="px-8 py-4 bg-white text-black font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors">
                        Purchase Now
                    </button>
                    <button className="px-8 py-4 border border-white/20 text-white font-bold uppercase tracking-wider hover:bg-white/10 transition-colors">
                        View Details
                    </button>
                </div>
            </div>

            <div className="hidden lg:block">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                    {mainImage && <img src={mainImage} className="w-full h-full object-cover" alt={product.name} />}
                </div>
            </div>
        </div>
    </div>
    );
};

// 6. Liquid Reveal (WebGL, Interactive)
export const ProductPageLiquidReveal: React.FC<ProductPageProps> = ({ product }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0.5, y: 0.5 });
    const targetMousePos = useRef({ x: 0.5, y: 0.5 });

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        const textureLoader = new THREE.TextureLoader();
        const imageUrl = product.image || product.images[0]?.url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
        const texture = textureLoader.load(imageUrl);
        // Use a noise texture from a reliable source or generate one
        const noiseTexture = textureLoader.load('https://grainy-gradients.vercel.app/noise.svg');
        noiseTexture.wrapS = noiseTexture.wrapT = THREE.RepeatWrapping;

        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D uTexture;
            uniform sampler2D uNoise;
            uniform vec2 uMouse;
            uniform float uTime;

            void main() {
                vec2 uv = vUv;
                // Adjust UV to cover the screen properly (cover fit)
                // This is a simplified approach; for perfect cover, we need aspect ratios
                
                float mouseDist = distance(uv, uMouse);
                
                // Invert the reveal logic: Reveal where mouse IS
                float revealAmount = smoothstep(0.4, 0.0, mouseDist);

                vec4 noise = texture2D(uNoise, uv * 2.0 + uTime * 0.05);
                float displacement = (noise.r - 0.5) * 0.5 * (1.0 - revealAmount);

                vec2 displacedUv = uv + vec2(displacement, displacement);
                vec4 tex = texture2D(uTexture, displacedUv);

                float borderThickness = 0.02;
                float liquidBorder = smoothstep(0.4 - borderThickness, 0.4, mouseDist) - smoothstep(0.4, 0.4 + borderThickness, mouseDist);
                vec3 borderColor = vec3(1.0, 1.0, 1.0);

                // Background color (dark)
                vec3 bgColor = vec3(0.1, 0.1, 0.1);

                vec3 finalColor = mix(bgColor, tex.rgb, revealAmount);
                finalColor = mix(finalColor, borderColor, liquidBorder * 0.5);

                gl_FragColor = vec4(finalColor, 1.0);
            }
        `;

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture: { value: texture },
                uNoise: { value: noiseTexture },
                uMouse: { value: new THREE.Vector2(0.5, 0.5) },
                uTime: { value: 0 },
            },
            vertexShader,
            fragmentShader,
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        const handleMouseMove = (e: MouseEvent) => {
            const rect = currentMount.getBoundingClientRect();
            targetMousePos.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: 1.0 - ((e.clientY - rect.top) / rect.height) // Flip Y for shader
            };
        };
        currentMount.addEventListener('mousemove', handleMouseMove);

        const clock = new THREE.Clock();
        const animate = () => {
            requestAnimationFrame(animate);

            mousePos.current.x = THREE.MathUtils.lerp(mousePos.current.x, targetMousePos.current.x, 0.05);
            mousePos.current.y = THREE.MathUtils.lerp(mousePos.current.y, targetMousePos.current.y, 0.05);

            material.uniforms.uMouse.value.set(mousePos.current.x, mousePos.current.y);
            material.uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (currentMount) {
                renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
            }
        };
        window.addEventListener('resize', handleResize);

        // Touch support for mobile
        const handleTouchMove = (e: TouchEvent) => {
            const rect = currentMount.getBoundingClientRect();
            const touch = e.touches[0];
            targetMousePos.current = {
                x: (touch.clientX - rect.left) / rect.width,
                y: 1.0 - ((touch.clientY - rect.top) / rect.height)
            };
        };
        currentMount.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            currentMount.removeEventListener('mousemove', handleMouseMove);
            currentMount.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('resize', handleResize);
            if (currentMount && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            texture.dispose();
            noiseTexture.dispose();
            renderer.dispose();
        };
    }, [product.image, product.images]);

    return (
        <div className="relative w-full h-[60vh] md:h-[800px] bg-neutral-900 overflow-hidden group">
            <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-none touch-none" />

            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-center p-8 z-10 mix-blend-difference text-white">
                <span className="text-xs md:text-sm font-mono tracking-widest uppercase mb-2 md:mb-4 opacity-80">{product.category || 'Collection'}</span>
                <h1 className="text-4xl md:text-6xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-4 md:mb-6">{product.name}</h1>
                <p className="text-xl md:text-2xl font-light opacity-80 mb-6 md:mb-8">${(product.price / 100).toFixed(2)}</p>
                <div className="flex gap-4 pointer-events-auto">
                    <button className="px-6 py-2 md:px-8 md:py-3 bg-white text-black text-sm md:text-base font-bold uppercase tracking-wider hover:bg-neutral-200 transition-colors">
                        Add to Cart
                    </button>
                </div>
            </div>

            <div className="absolute bottom-8 left-8 text-white/50 text-[10px] md:text-xs font-mono pointer-events-none">
                MOVE CURSOR / TOUCH TO REVEAL
            </div>
        </div>
    );
};

// 7. Scroll 3D (GSAP, Three.js)
export const ProductPageScroll3D: React.FC<ProductPageProps> = ({ product }) => {
    const mountRef = useRef<HTMLDivElement>(null);
    const annotationsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;
        const currentMount = mountRef.current;

        gsap.registerPlugin(ScrollTrigger);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, currentMount.clientWidth / currentMount.clientHeight, 0.1, 1000);
        camera.position.set(0, 0, 2.5);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        currentMount.appendChild(renderer.domElement);

        scene.add(new THREE.AmbientLight(0xffffff, 2));
        const dirLight = new THREE.DirectionalLight(0xffffff, 4);
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        let model: THREE.Group;
        const loader = new GLTFLoader();
        // Use a placeholder model if product doesn't have one
        const modelUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb';

        loader.load(
            modelUrl,
            (gltf) => {
                model = gltf.scene;
                model.scale.set(1, 1, 1);
                model.position.y = -0.5;
                scene.add(model);
                setupAnimation();
            },
            undefined,
            (error) => {
                console.error('An error happened while loading the model.', error);
            }
        );

        const setupAnimation = () => {
            if (!model) return;
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: currentMount,
                    start: "top top",
                    end: "+=3000",
                    scrub: 1.5,
                    pin: true,
                }
            });

            tl.to(model.rotation, {
                y: Math.PI * 2,
                duration: 2,
                ease: 'none'
            });

            // Animate annotations
            tl.fromTo('.annotation-1', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 0.5);
            tl.fromTo('.annotation-2', { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.5);
        };

        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!currentMount) return;
            camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (currentMount && currentMount.contains(renderer.domElement)) {
                currentMount.removeChild(renderer.domElement);
            }
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="bg-gray-100">
            <div ref={mountRef} className="h-[60vh] md:h-screen w-full relative">
                <div ref={annotationsRef} className="absolute inset-0 z-10 pointer-events-none flex flex-col justify-center items-center text-center text-gray-800">
                    <div className="annotation annotation-1 opacity-0 max-w-[200px] md:max-w-sm p-4 mt-24 md:mt-48 bg-white/80 backdrop-blur-sm rounded-xl md:bg-transparent md:backdrop-blur-none">
                        <h2 className="text-xl md:text-3xl font-bold">{product.name}</h2>
                        <p className="text-sm md:text-base">{product.description ? product.description.slice(0, 100) + '...' : 'Product details'}</p>
                    </div>
                    <div className="annotation annotation-2 opacity-0 max-w-[200px] md:max-w-sm p-4 mb-24 md:mb-48 bg-white/80 backdrop-blur-sm rounded-xl md:bg-transparent md:backdrop-blur-none">
                        <h3 className="text-lg md:text-xl font-semibold">Premium Materials</h3>
                        <p className="text-xs md:text-sm">Crafted with the finest attention to detail.</p>
                    </div>
                </div>
            </div>
            <div className="min-h-[50vh] md:h-screen bg-gray-100 flex items-center justify-center py-12 md:py-0">
                <div className="text-center p-8">
                    <h2 className="text-3xl md:text-5xl font-bold">History Forged in Combat</h2>
                    <p className="mt-4 text-base md:text-lg text-gray-600">Analyze the details of this battle-worn relic.</p>
                    <button className="mt-8 px-8 py-3 bg-black text-white font-bold rounded-full w-full md:w-auto">Add to Cart - ${(product.price / 100).toFixed(2)}</button>
                </div>
            </div>
        </div>
    );
};

// 8. Drawing (SVG Animation)
export const ProductPageDrawing: React.FC<ProductPageProps> = ({ product }) => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const svgPathRef = useRef<SVGPathElement>(null);

    useEffect(() => {
        if (!svgPathRef.current || !sectionRef.current) return;

        gsap.registerPlugin(ScrollTrigger);
        const path = svgPathRef.current;
        const pathLength = path.getTotalLength();

        gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

        const ctx = gsap.context(() => {
            gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 2,
                    pin: true,
                }
            })
                .to(path, { strokeDashoffset: 0, ease: 'power1.inOut' })
                .to('.product-info', { autoAlpha: 1, y: 0, ease: 'power2.out' }, '-=0.5');

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-white">
            <div ref={sectionRef} className="h-[60vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
                <div className="relative w-full max-w-4xl p-8">
                    <svg viewBox="0 0 800 600" className="w-full h-auto">
                        <path ref={svgPathRef} d="M150,200 h500 a50,50 0 0 1 50,50 v200 a50,50 0 0 1 -50,50 h-500 a50,50 0 0 1 -50,-50 v-200 a50,50 0 0 1 50,-50 z M400,150 a50,50 0 0 1 0,100 M400,150 h-100 a50,50 0 0 0 -50,50 h200 a50,50 0 0 0 -50,-50 z M400,350 a100,100 0 1 0 0,-200 a100,100 0 1 0 0,200 z M400,320 a70,70 0 1 0 0,-140 a70,70 0 1 0 0,140 z" stroke="black" strokeWidth="2" fill="none" />
                    </svg>
                    <div className="product-info absolute inset-0 flex flex-col justify-center items-center text-center opacity-0 transform translate-y-10 p-4">
                        <h1 className="text-3xl md:text-5xl font-bold">{product.name}</h1>
                        <p className="mt-2 text-base md:text-lg text-gray-600">{product.category}</p>
                        <button className="mt-6 px-6 py-2 bg-black text-white font-semibold rounded-full text-sm md:text-base">
                            Add to Cart - ${(product.price / 100).toFixed(2)}
                        </button>
                    </div>
                </div>
            </div>
            <div className="min-h-[50vh] md:h-screen bg-white flex items-center justify-center py-12 md:py-0">
                <div className="text-center p-8">
                    <h2 className="text-3xl md:text-5xl font-bold">The Art of Creation</h2>
                    <p className="mt-4 text-base md:text-lg text-gray-600 max-w-lg mx-auto">Every line tells a story. Every detail matters.</p>
                </div>
            </div>
        </div>
    );
};

// 9. Builder (Interactive Configurator)
export const ProductPageBuilder: React.FC<ProductPageProps> = ({ product }) => {
    // Demo parts
    const parts = {
        decks: ['bg-red-500', 'bg-blue-500', 'bg-black', 'bg-yellow-500'],
        trucks: ['bg-gray-400', 'bg-black', 'bg-white'],
        wheels: ['bg-white', 'bg-red-500', 'bg-green-500']
    };

    const [config, setConfig] = React.useState({
        deck: parts.decks[0],
        trucks: parts.trucks[0],
        wheels: parts.wheels[0],
    });

    return (
        <div className="bg-gray-100 min-h-screen grid grid-cols-1 lg:grid-cols-3 font-mono">
            <div className="lg:col-span-2 flex items-center justify-center p-8 relative bg-gray-200 min-h-[50vh] lg:min-h-screen overflow-hidden">
                <div className="w-[200px] h-[533px] md:w-[300px] md:h-[800px] relative transform scale-75 md:scale-100 origin-center">
                    {/* Skateboard Deck */}
                    <div className={`w-full h-full rounded-[100px] md:rounded-[150px] transition-colors ${config.deck} shadow-2xl`} />
                    {/* Trucks */}
                    <div className={`absolute top-[120px] md:top-[180px] left-1/2 -translate-x-1/2 w-32 md:w-48 h-4 md:h-6 rounded-sm transition-colors ${config.trucks} shadow-md`} />
                    <div className={`absolute bottom-[120px] md:bottom-[180px] left-1/2 -translate-x-1/2 w-32 md:w-48 h-4 md:h-6 rounded-sm transition-colors ${config.trucks} shadow-md`} />
                    {/* Wheels */}
                    <div className={`absolute top-[115px] md:top-[175px] left-2 md:left-4 w-8 md:w-12 h-8 md:h-12 rounded-full transition-colors ${config.wheels} shadow-lg`} />
                    <div className={`absolute top-[115px] md:top-[175px] right-2 md:right-4 w-8 md:w-12 h-8 md:h-12 rounded-full transition-colors ${config.wheels} shadow-lg`} />
                    <div className={`absolute bottom-[115px] md:bottom-[175px] left-2 md:left-4 w-8 md:w-12 h-8 md:h-12 rounded-full transition-colors ${config.wheels} shadow-lg`} />
                    <div className={`absolute bottom-[115px] md:bottom-[175px] right-2 md:right-4 w-8 md:w-12 h-8 md:h-12 rounded-full transition-colors ${config.wheels} shadow-lg`} />
                </div>
            </div>

            <div className="bg-white p-8 flex flex-col justify-center">
                <h1 className="text-2xl md:text-3xl font-bold uppercase">{product.name}</h1>
                <p className="mt-2 text-sm md:text-base text-gray-600">Drag and drop components to create your custom board.</p>

                <div className="mt-8">
                    <h2 className="font-bold uppercase text-sm md:text-base">Decks</h2>
                    <div className="flex gap-4 mt-2 overflow-x-auto pb-2">
                        {parts.decks.map(color => (
                            <div key={color} className={`w-12 h-16 md:w-16 md:h-24 rounded-lg cursor-pointer shrink-0 ${color} border-2 ${config.deck === color ? 'border-black' : 'border-transparent'}`} onClick={() => setConfig(c => ({ ...c, deck: color }))} />
                        ))}
                    </div>
                </div>
                <div className="mt-6 md:mt-8">
                    <h2 className="font-bold uppercase text-sm md:text-base">Trucks</h2>
                    <div className="flex gap-4 mt-2 overflow-x-auto pb-2">
                        {parts.trucks.map(color => (
                            <div key={color} className={`w-12 h-6 md:w-16 md:h-8 rounded-sm cursor-pointer shrink-0 ${color} border-2 ${config.trucks === color ? 'border-black' : 'border-transparent'}`} onClick={() => setConfig(c => ({ ...c, trucks: color }))} />
                        ))}
                    </div>
                </div>
                <div className="mt-6 md:mt-8">
                    <h2 className="font-bold uppercase text-sm md:text-base">Wheels</h2>
                    <div className="flex gap-4 mt-2 overflow-x-auto pb-2">
                        {parts.wheels.map(color => (
                            <div key={color} className={`w-10 h-10 md:w-12 md:h-12 rounded-full cursor-pointer shrink-0 ${color} border-2 ${config.wheels === color ? 'border-black' : 'border-transparent'}`} onClick={() => setConfig(c => ({ ...c, wheels: color }))} />
                        ))}
                    </div>
                </div>

                <button className="mt-8 md:mt-12 w-full p-4 bg-black text-white font-bold text-base md:text-lg hover:bg-gray-800 uppercase sticky bottom-4 shadow-xl">
                    ADD TO CART // ${(product.price / 100).toFixed(2)}
                </button>
            </div>
        </div>
    );
};

export const PRODUCT_PAGE_COMPONENTS = {
    standard: ProductPageStandard,
    split: ProductPageSplit,
    minimal: ProductPageMinimal,
    gallery: ProductPageGallery,
    immersive: ProductPageImmersive,
    'liquid-reveal': ProductPageLiquidReveal,
    'scroll-3d': ProductPageScroll3D,
    'drawing': ProductPageDrawing,
    'builder': ProductPageBuilder,
};

export const PRODUCT_PAGE_OPTIONS = [
    { id: 'standard', name: 'Standard', description: 'Classic E-commerce Layout' },
    { id: 'split', name: 'Split Screen', description: 'Modern 50/50 Layout' },
    { id: 'minimal', name: 'Minimal', description: 'Centered & Clean' },
    { id: 'gallery', name: 'Gallery', description: 'Image Grid Focus' },
    { id: 'immersive', name: 'Immersive', description: 'Dark Mode Premium' },
    { id: 'liquid-reveal', name: 'Liquid Reveal', description: 'Interactive WebGL Distortion' },
    { id: 'scroll-3d', name: 'Scroll 3D', description: '3D Model Scroll Animation' },
    { id: 'drawing', name: 'Drawing', description: 'SVG Path Animation' },
    { id: 'builder', name: 'Builder', description: 'Interactive Product Configurator' },
];
