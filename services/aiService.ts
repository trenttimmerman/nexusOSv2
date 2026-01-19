/**
 * AI Service for NexusOS
 * Provides AI-powered content generation for products, categories, and collections
 * 
 * Features:
 * - Text generation (descriptions, titles, SEO content)
 * - Image generation from text descriptions
 * - Context-aware prompts
 */

// OpenAI API configuration
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const OPENAI_API_BASE = 'https://api.openai.com/v1';

interface AITextGenerationOptions {
    productName?: string;
    category?: string;
    existingDescription?: string;
    tone?: 'professional' | 'casual' | 'luxury' | 'technical';
    length?: 'short' | 'medium' | 'long';
    context?: string;
}

interface AIImageGenerationOptions {
    productName: string;
    description: string;
    style?: 'photorealistic' | 'minimalist' | 'artistic' | 'product-shot';
    aspectRatio?: '1:1' | '16:9' | '4:3';
}

export class AIService {
    /**
     * Generate product description using AI
     */
    static async generateProductDescription(options: AITextGenerationOptions): Promise<string> {
        const {
            productName = '',
            category = '',
            existingDescription = '',
            tone = 'professional',
            length = 'medium',
            context = ''
        } = options;

        const lengthGuide = {
            short: '2-3 sentences',
            medium: '2-3 paragraphs',
            long: '4-5 paragraphs with bullet points'
        };

        const toneGuide = {
            professional: 'professional and informative',
            casual: 'friendly and conversational',
            luxury: 'premium and aspirational',
            technical: 'detailed and specification-focused'
        };

        const prompt = existingDescription
            ? `Improve this product description:\n\nProduct: ${productName}\nCategory: ${category}\nCurrent Description: ${existingDescription}\n\nRewrite it to be more ${toneGuide[tone]} with ${lengthGuide[length]}. Format as HTML with <p> tags and <ul><li> for features.`
            : `Write a compelling product description:\n\nProduct Name: ${productName}\nCategory: ${category}\n${context ? `Additional Context: ${context}\n` : ''}\nTone: ${toneGuide[tone]}\nLength: ${lengthGuide[length]}\n\nFormat as HTML with <p> tags and <ul><li> for key features.`;

        try {
            const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert e-commerce copywriter. Generate compelling, SEO-friendly product descriptions in HTML format. Use <p> tags for paragraphs and <ul><li> for feature lists. Be persuasive and highlight benefits.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 500
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI text generation error:', error);
            throw new Error('Failed to generate description. Please check your API key and try again.');
        }
    }

    /**
     * Generate category description using AI
     */
    static async generateCategoryDescription(categoryName: string, existingDescription?: string): Promise<string> {
        const prompt = existingDescription
            ? `Improve this category description:\n\nCategory: ${categoryName}\nCurrent: ${existingDescription}\n\nMake it more engaging and SEO-friendly. 2-3 sentences. Format as HTML with <p> tags.`
            : `Write a compelling category description for "${categoryName}". 2-3 sentences that entice customers to browse this category. Format as HTML with <p> tags.`;

        try {
            const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert e-commerce copywriter. Generate compelling category descriptions in HTML format.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI category description error:', error);
            throw new Error('Failed to generate category description.');
        }
    }

    /**
     * Generate collection description using AI
     */
    static async generateCollectionDescription(collectionName: string, existingDescription?: string, productContext?: string): Promise<string> {
        const prompt = existingDescription
            ? `Improve this collection description:\n\nCollection: ${collectionName}\nCurrent: ${existingDescription}\n${productContext ? `Products: ${productContext}\n` : ''}\nMake it more compelling. 2-3 sentences. Format as HTML with <p> tags.`
            : `Write a compelling collection description for "${collectionName}". ${productContext ? `This collection features: ${productContext}. ` : ''}2-3 sentences that highlight the curation and appeal. Format as HTML with <p> tags.`;

        try {
            const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an expert e-commerce copywriter. Generate compelling collection descriptions in HTML format that highlight curation and exclusivity.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.7,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error('AI collection description error:', error);
            throw new Error('Failed to generate collection description.');
        }
    }

    /**
     * Generate product image using DALL-E
     */
    static async generateProductImage(options: AIImageGenerationOptions): Promise<string> {
        const {
            productName,
            description,
            style = 'photorealistic',
            aspectRatio = '1:1'
        } = options;

        const styleGuide = {
            'photorealistic': 'professional product photography, studio lighting, clean white background',
            'minimalist': 'minimal clean design, pastel colors, soft shadows',
            'artistic': 'artistic illustration, vibrant colors, creative composition',
            'product-shot': 'commercial product shot, professional lighting, e-commerce style'
        };

        const sizeMap = {
            '1:1': '1024x1024',
            '16:9': '1792x1024',
            '4:3': '1024x1024' // DALL-E only supports square and wide
        };

        // Extract plain text from HTML description
        const plainDescription = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200);

        const imagePrompt = `${productName}. ${plainDescription}. ${styleGuide[style]}. High quality, detailed, professional.`;

        try {
            const response = await fetch(`${OPENAI_API_BASE}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'dall-e-3',
                    prompt: imagePrompt.substring(0, 1000), // DALL-E 3 has 1000 char limit
                    n: 1,
                    size: sizeMap[aspectRatio],
                    quality: 'standard',
                    response_format: 'url'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`OpenAI Image API error: ${errorData.error?.message || response.statusText}`);
            }

            const data = await response.json();
            return data.data[0].url;
        } catch (error) {
            console.error('AI image generation error:', error);
            throw new Error('Failed to generate image. Please check your API key and try again.');
        }
    }

    /**
     * Generate SEO metadata using AI
     */
    static async generateSEO(productName: string, description: string, category: string): Promise<{ title: string; description: string; slug: string }> {
        const plainDescription = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        const prompt = `Generate SEO metadata:\n\nProduct: ${productName}\nCategory: ${category}\nDescription: ${plainDescription.substring(0, 300)}\n\nProvide:\n1. SEO Title (max 60 chars, include brand "Nexus")\n2. Meta Description (max 160 chars, compelling, includes CTA)\n3. URL Slug (lowercase, hyphens, SEO-friendly)\n\nFormat as JSON: {"title": "...", "description": "...", "slug": "..."}`;

        try {
            const response = await fetch(`${OPENAI_API_BASE}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${OPENAI_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are an SEO expert. Generate optimized metadata for e-commerce products. Return ONLY valid JSON.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 200
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            
            // Extract JSON from potential markdown code blocks
            const jsonMatch = content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Invalid response format');
            }
            
            return JSON.parse(jsonMatch[0]);
        } catch (error) {
            console.error('AI SEO generation error:', error);
            // Fallback to basic generation
            return {
                title: `${productName} | Nexus`,
                description: plainDescription.substring(0, 160),
                slug: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            };
        }
    }

    /**
     * Check if AI services are configured
     */
    static isConfigured(): boolean {
        return !!OPENAI_API_KEY && OPENAI_API_KEY !== '';
    }

    /**
     * Get configuration status message
     */
    static getConfigMessage(): string {
        if (!this.isConfigured()) {
            return 'AI features require an OpenAI API key. Add VITE_OPENAI_API_KEY to your .env file.';
        }
        return 'AI features are enabled.';
    }
}
