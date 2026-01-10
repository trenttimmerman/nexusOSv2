import { supabase } from './supabaseClient';

export interface EmailSubscriber {
  id: string;
  site_id: string;
  customer_id?: string;
  email: string;
  subscribed_at: string;
  unsubscribed_at?: string;
  source_page?: string;
  source_block_id?: string;
  form_variant?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  metadata?: any;
  ip_address?: string;
  user_agent?: string;
  accepted_terms: boolean;
  terms_accepted_at?: string;
  double_opt_in_confirmed: boolean;
  confirmation_token?: string;
  confirmed_at?: string;
}

export interface EmailSettings {
  id: string;
  site_id: string;
  enabled: boolean;
  require_double_opt_in: boolean;
  auto_create_customer: boolean;
  thank_you_enabled: boolean;
  thank_you_heading: string;
  thank_you_message: string;
  thank_you_button_text: string;
  thank_you_button_link: string;
  thank_you_auto_close: boolean;
  thank_you_auto_close_delay: number;
  thank_you_bg_color: string;
  thank_you_text_color: string;
  thank_you_button_bg_color: string;
  thank_you_button_text_color: string;
  terms_enabled: boolean;
  terms_heading: string;
  terms_content?: string;
  terms_page_slug: string;
  require_terms_acceptance: boolean;
  terms_checkbox_text: string;
  confirmation_subject?: string;
  confirmation_body?: string;
  confirmation_from_name?: string;
  confirmation_from_email?: string;
  integrations?: any;
}

export interface SubscribeParams {
  email: string;
  site_id: string;
  page_slug?: string;
  block_id?: string;
  variant?: string;
  utm_params?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  accepted_terms?: boolean;
  metadata?: any;
}

/**
 * Subscribe an email to a site's mailing list
 * Auto-creates customer account if enabled
 */
export async function subscribeEmail(params: SubscribeParams): Promise<{
  success: boolean;
  message: string;
  subscriber?: EmailSubscriber;
  settings?: EmailSettings;
}> {
  try {
    const { email, site_id, page_slug, block_id, variant, utm_params, accepted_terms, metadata } = params;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Please enter a valid email address',
      };
    }

    // Get site email settings
    const { data: settings, error: settingsError } = await supabase
      .from('email_settings')
      .select('*')
      .eq('site_id', site_id)
      .single();

    if (settingsError) {
      console.error('Error fetching email settings:', settingsError);
      return {
        success: false,
        message: 'Email signups are currently unavailable',
      };
    }

    // Check if email signups are enabled
    if (!settings.enabled) {
      return {
        success: false,
        message: 'Email signups are currently disabled',
      };
    }

    // Check if terms acceptance is required
    if (settings.require_terms_acceptance && !accepted_terms) {
      return {
        success: false,
        message: 'You must accept the Terms & Conditions to subscribe',
      };
    }

    // Check if email already exists for this site
    const { data: existingSubscriber } = await supabase
      .from('email_subscribers')
      .select('*')
      .eq('site_id', site_id)
      .eq('email', email)
      .maybeSingle();

    if (existingSubscriber) {
      // If unsubscribed, resubscribe
      if (existingSubscriber.unsubscribed_at) {
        const { data: resubscribed, error: resubError } = await supabase
          .from('email_subscribers')
          .update({
            unsubscribed_at: null,
            subscribed_at: new Date().toISOString(),
            source_page: page_slug,
            source_block_id: block_id,
            form_variant: variant,
            accepted_terms: accepted_terms || false,
            terms_accepted_at: accepted_terms ? new Date().toISOString() : null,
          })
          .eq('id', existingSubscriber.id)
          .select()
          .single();

        if (resubError) {
          console.error('Error resubscribing:', resubError);
          return {
            success: false,
            message: 'Failed to resubscribe. Please try again.',
          };
        }

        return {
          success: true,
          message: 'Welcome back! You\'ve been resubscribed.',
          subscriber: resubscribed,
          settings,
        };
      }

      return {
        success: true,
        message: 'You\'re already subscribed!',
        subscriber: existingSubscriber,
        settings,
      };
    }

    // Auto-create customer if enabled
    let customer_id: string | undefined;
    
    if (settings.auto_create_customer) {
      // Check if customer already exists
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('site_id', site_id)
        .eq('email', email)
        .maybeSingle();

      if (existingCustomer) {
        customer_id = existingCustomer.id;
        
        // Update customer to enable email marketing
        await supabase
          .from('customers')
          .update({ email_marketing: true })
          .eq('id', customer_id);
      } else {
        // Create new customer
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            site_id,
            email,
            email_marketing: true,
            created_via: 'email_signup',
          })
          .select('id')
          .single();

        if (customerError) {
          console.error('Error creating customer:', customerError);
          // Continue anyway - subscriber can exist without customer
        } else {
          customer_id = newCustomer.id;
        }
      }
    }

    // Generate confirmation token if double opt-in is required
    const confirmation_token = settings.require_double_opt_in 
      ? generateConfirmationToken() 
      : undefined;

    // Create subscriber record
    const subscriberData: any = {
      site_id,
      customer_id,
      email,
      source_page: page_slug,
      source_block_id: block_id,
      form_variant: variant,
      utm_source: utm_params?.source,
      utm_medium: utm_params?.medium,
      utm_campaign: utm_params?.campaign,
      utm_term: utm_params?.term,
      utm_content: utm_params?.content,
      metadata: metadata || {},
      accepted_terms: accepted_terms || false,
      terms_accepted_at: accepted_terms ? new Date().toISOString() : null,
      double_opt_in_confirmed: !settings.require_double_opt_in,
      confirmation_token,
      confirmed_at: settings.require_double_opt_in ? null : new Date().toISOString(),
    };

    const { data: subscriber, error: subscribeError } = await supabase
      .from('email_subscribers')
      .insert(subscriberData)
      .select()
      .single();

    if (subscribeError) {
      console.error('Error creating subscriber:', subscribeError);
      return {
        success: false,
        message: 'Failed to subscribe. Please try again.',
      };
    }

    // TODO: Send confirmation email if double opt-in is required
    if (settings.require_double_opt_in) {
      // This will be implemented when we add email sending functionality
      console.log('TODO: Send confirmation email to:', email, 'Token:', confirmation_token);
    }

    return {
      success: true,
      message: settings.require_double_opt_in 
        ? 'Please check your email to confirm your subscription' 
        : 'Successfully subscribed!',
      subscriber,
      settings,
    };
  } catch (error) {
    console.error('Subscribe error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Get email settings for a site
 */
export async function getEmailSettings(site_id: string): Promise<EmailSettings | null> {
  try {
    const { data, error } = await supabase
      .from('email_settings')
      .select('*')
      .eq('site_id', site_id)
      .single();

    if (error) {
      console.error('Error fetching email settings:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Get email settings error:', error);
    return null;
  }
}

/**
 * Update email settings for a site
 */
export async function updateEmailSettings(
  site_id: string, 
  updates: Partial<EmailSettings>
): Promise<{ success: boolean; message: string; settings?: EmailSettings }> {
  try {
    const { data, error } = await supabase
      .from('email_settings')
      .update(updates)
      .eq('site_id', site_id)
      .select()
      .single();

    if (error) {
      console.error('Error updating email settings:', error);
      return {
        success: false,
        message: 'Failed to update settings',
      };
    }

    return {
      success: true,
      message: 'Settings updated successfully',
      settings: data,
    };
  } catch (error) {
    console.error('Update email settings error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Get subscribers for a site
 */
export async function getSubscribers(
  site_id: string,
  options?: {
    limit?: number;
    offset?: number;
    search?: string;
    status?: 'active' | 'unsubscribed' | 'pending';
  }
): Promise<{ subscribers: EmailSubscriber[]; total: number }> {
  try {
    let query = supabase
      .from('email_subscribers')
      .select('*', { count: 'exact' })
      .eq('site_id', site_id)
      .order('subscribed_at', { ascending: false });

    // Filter by status
    if (options?.status === 'active') {
      query = query.is('unsubscribed_at', null).eq('double_opt_in_confirmed', true);
    } else if (options?.status === 'unsubscribed') {
      query = query.not('unsubscribed_at', 'is', null);
    } else if (options?.status === 'pending') {
      query = query.eq('double_opt_in_confirmed', false);
    }

    // Search by email
    if (options?.search) {
      query = query.ilike('email', `%${options.search}%`);
    }

    // Pagination
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    if (options?.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error fetching subscribers:', error);
      return { subscribers: [], total: 0 };
    }

    return {
      subscribers: data || [],
      total: count || 0,
    };
  } catch (error) {
    console.error('Get subscribers error:', error);
    return { subscribers: [], total: 0 };
  }
}

/**
 * Unsubscribe an email
 */
export async function unsubscribeEmail(
  site_id: string,
  email: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { error } = await supabase
      .from('email_subscribers')
      .update({ unsubscribed_at: new Date().toISOString() })
      .eq('site_id', site_id)
      .eq('email', email);

    if (error) {
      console.error('Error unsubscribing:', error);
      return {
        success: false,
        message: 'Failed to unsubscribe',
      };
    }

    return {
      success: true,
      message: 'Successfully unsubscribed',
    };
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Confirm email subscription (for double opt-in)
 */
export async function confirmSubscription(
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const { data: subscriber, error: findError } = await supabase
      .from('email_subscribers')
      .select('*')
      .eq('confirmation_token', token)
      .single();

    if (findError || !subscriber) {
      return {
        success: false,
        message: 'Invalid or expired confirmation link',
      };
    }

    if (subscriber.double_opt_in_confirmed) {
      return {
        success: true,
        message: 'Your subscription is already confirmed',
      };
    }

    const { error: updateError } = await supabase
      .from('email_subscribers')
      .update({
        double_opt_in_confirmed: true,
        confirmed_at: new Date().toISOString(),
      })
      .eq('id', subscriber.id);

    if (updateError) {
      console.error('Error confirming subscription:', updateError);
      return {
        success: false,
        message: 'Failed to confirm subscription',
      };
    }

    return {
      success: true,
      message: 'Subscription confirmed successfully!',
    };
  } catch (error) {
    console.error('Confirm subscription error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred',
    };
  }
}

/**
 * Generate a random confirmation token
 */
function generateConfirmationToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): {
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
} {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  
  return {
    source: params.get('utm_source') || undefined,
    medium: params.get('utm_medium') || undefined,
    campaign: params.get('utm_campaign') || undefined,
    term: params.get('utm_term') || undefined,
    content: params.get('utm_content') || undefined,
  };
}
