import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt } = await req.json()

    if (!prompt) {
      throw new Error('Prompt is required')
    }

    console.log(`Generating image for prompt: ${prompt}`)

    // ------------------------------------------------------------------
    // TODO: Replace this mock logic with a real AI API call (e.g., OpenAI DALL-E)
    // ------------------------------------------------------------------
    
    // Example OpenAI implementation:
    /*
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        prompt: prompt,
        n: 1,
        size: "1024x1024"
      })
    })
    const data = await response.json()
    const imageUrl = data.data[0].url
    */

    // Mock Implementation:
    // We use Unsplash Source with a random ID to simulate a new image based on the prompt (conceptually)
    // In reality, Unsplash Source is deprecated, so we use the standard Unsplash photo URL structure with a random ID
    // to ensure the browser doesn't cache the previous image.
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const randomId = Math.floor(Math.random() * 10000);
    // We append the prompt as a query param just for logging/debugging visibility, 
    // though Unsplash won't actually use it to generate an image.
    const imageUrl = `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop&random=${randomId}&prompt=${encodeURIComponent(prompt)}`;

    // ------------------------------------------------------------------

    return new Response(
      JSON.stringify({ imageUrl }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})
