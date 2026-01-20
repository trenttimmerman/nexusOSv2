import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';

const Products: React.FC = () => {
    const [productName, setProductName] = useState('');
    const [features, setFeatures] = useState('');
    const [audience, setAudience] = useState('');
    const [tone, setTone] = useState('Friendly');
    
    const [generatedDescription, setGeneratedDescription] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const handleGenerate = async () => {
        if (!productName || !features) {
            setError('Please fill in at least the Product Name and Key Features.');
            return;
        }
        setIsGenerating(true);
        setError(null);
        setGeneratedDescription('');

        try {
            if (!process.env.API_KEY) {
                throw new Error("API key not configured.");
            }
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

            const prompt = `You are an expert e-commerce copywriter for a platform called WebPilot. Your task is to write a compelling, high-converting product description.

            Product Name: ${productName}
            Key Features/Keywords: ${features}
            Target Audience: ${audience || 'General audience'}
            Tone of Voice: ${tone}

            Based on this information, generate a product description. It should include a catchy title/headline as a markdown heading (e.g., '### The Ultimate Gadget') and a descriptive paragraph. The entire response should be in markdown.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setGeneratedDescription(response.text);

        } catch (err) {
            console.error("Error generating description:", err);
            const errorMessage = (err instanceof Error && err.message.includes("API key"))
                ? "AI features are unavailable due to a configuration issue."
                : "Failed to generate description. Please try again later.";
            setError(errorMessage);
        } finally {
            setIsGenerating(false);
        }
    };

    const renderDescription = () => {
        if (isGenerating) {
            return (
                <div className="space-y-4 animate-pulse">
                    <div className="h-6 bg-gray-700 rounded w-1/2"></div>
                    <div className="space-y-2">
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            );
        }
        if (error && !generatedDescription) {
            return <p className="text-red-400">{error}</p>;
        }
        if (!generatedDescription) {
            return <p className="text-gray-500">Your generated product description will appear here...</p>;
        }

        const lines = generatedDescription.split('\n').filter(line => line.trim() !== '');
        return (
             <div className="prose prose-invert prose-headings:text-white prose-p:text-gray-300">
                {lines.map((line, index) => {
                    if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-xl font-bold text-white">{line.substring(4)}</h3>;
                    }
                    return <p key={index}>{line}</p>;
                })}
            </div>
        )
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Products</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 mr-2 text-purple-400"><path d="M11.47 1.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1-1.06 1.06l-1.72-1.72V7.5h-1.5V4.06L9.53 5.78a.75.75 0 0 1-1.06-1.06l3-3ZM11.25 7.5V11.25l2.28 2.28a.75.75 0 0 1-1.06 1.06L11.25 13.062V15a.75.75 0 0 1-1.5 0v-3.75l-2.28 2.28a.75.75 0 1 1-1.06-1.06L8.25 11.25V7.5a.75.75 0 0 1 1.5 0Zm-2.822 8.72a.75.75 0 0 1 1.06 0l1.72 1.72V20.25h1.5v-2.25l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 0 1 0-1.06Z" /></svg>
                        AI Description Generator
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="productName" className="block text-sm font-medium text-gray-300 mb-1">Product Name</label>
                            <input type="text" id="productName" value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g., Quantum Smart Watch" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"/>
                        </div>
                        <div>
                            <label htmlFor="features" className="block text-sm font-medium text-gray-300 mb-1">Key Features / Keywords</label>
                            <textarea id="features" value={features} onChange={e => setFeatures(e.target.value)} rows={4} placeholder="e.g., Waterproof, AI health tracking, 7-day battery" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"></textarea>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="audience" className="block text-sm font-medium text-gray-300 mb-1">Target Audience</label>
                                <input type="text" id="audience" value={audience} onChange={e => setAudience(e.target.value)} placeholder="e.g., Tech enthusiasts" className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"/>
                            </div>
                            <div>
                                <label htmlFor="tone" className="block text-sm font-medium text-gray-300 mb-1">Tone of Voice</label>
                                <select id="tone" value={tone} onChange={e => setTone(e.target.value)} className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500">
                                    <option>Friendly</option>
                                    <option>Professional</option>
                                    <option>Witty</option>
                                    <option>Luxury</option>
                                    <option>Adventurous</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold px-4 py-3 rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                                {isGenerating ? 'Generating...' : 'Generate Description'}
                            </button>
                             {error && !isGenerating && <p className="text-red-400 text-sm mt-2">{error}</p>}
                        </div>
                    </div>
                </div>

                <div className="dash-glass-card rounded-2xl p-6 fade-in-widget" style={{animationDelay: '0.2s'}}>
                     <h3 className="text-lg font-semibold text-white mb-4">Generated Description</h3>
                     <div className="bg-gray-900/50 p-4 rounded-lg min-h-[300px]">
                        {renderDescription()}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Products;