import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'jsr:@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      SUPABASE_URL ?? '',
      SUPABASE_SERVICE_ROLE_KEY ?? ''
    )

    const { order_id } = await req.json()

    if (!order_id) {
      throw new Error('Missing order_id')
    }

    // 1. Fetch Order and Customer Details
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers (
          email,
          first_name,
          last_name
        ),
        items:order_items (
          quantity,
          price_at_purchase,
          product_id
        )
      `)
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // 2. Fetch Product Names (Optional, but nice for email)
    const productIds = order.items.map((i: any) => i.product_id)
    const { data: products } = await supabase
      .from('products')
      .select('id, name')
      .in('id', productIds)

    const productMap = new Map(products?.map((p: any) => [p.id, p.name]))

    // 3. Construct Email Content
    const customerName = order.customer.first_name || 'Customer'
    const email = order.customer.email
    
    const itemsList = order.items.map((item: any) => {
      const productName = productMap.get(item.product_id) || 'Product'
      return `- ${productName} x${item.quantity} ($${item.price_at_purchase})`
    }).join('\n')

    const emailContent = `
      <h1>Order Confirmation</h1>
      <p>Hi ${customerName},</p>
      <p>Thank you for your order! We've received it and are getting it ready.</p>
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Total:</strong> $${order.total_amount}</p>
      
      <h3>Items:</h3>
      <pre>${itemsList}</pre>
      
      <p>We'll notify you when it ships!</p>
      <p>The Evolv Team</p>
    `

    console.log(`[Mock Email Service] Sending email to ${email}...`)
    console.log(emailContent)

    // 4. Send Email (Mock or Resend)
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Evolv <orders@evolv.os>', // You would need a verified domain
          to: [email],
          subject: `Order Confirmation #${order.id.slice(0, 8)}`,
          html: emailContent,
        }),
      })

      if (!res.ok) {
        const error = await res.text()
        console.error('Resend API Error:', error)
        // Don't fail the request, just log it.
      } else {
        console.log('Email sent via Resend!')
      }
    } else {
      console.log('RESEND_API_KEY not set. Email mocked.')
    }

    return new Response(
      JSON.stringify({ message: 'Order confirmation processed' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error: any) {
    console.error(error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
