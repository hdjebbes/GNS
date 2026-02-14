import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const NOTIFICATION_EMAIL = 'omanigns@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

function buildEmailHtml(data: {
  name: string;
  email: string;
  message: string;
  language: string;
}): string {
  const date = new Date().toLocaleString('en-GB', { timeZone: 'Asia/Muscat' });
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e3a5f;">
  <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 24px; border-radius: 12px 12px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 20px;">New Contact Form Submission</h1>
    <p style="color: #bfdbfe; margin: 8px 0 0;">GLOBAL NEXUS SOLUTIONS LLC</p>
  </div>
  <div style="border: 1px solid #e2e8f0; border-top: none; padding: 24px; border-radius: 0 0 12px 12px;">
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; width: 120px; color: #1e40af;">Name</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.name)}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e40af;">Email</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e40af;">Language</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${escapeHtml(data.language.toUpperCase())}</td>
      </tr>
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #1e40af;">Date</td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0;">${date} (Oman)</td>
      </tr>
    </table>
    <div style="margin-top: 20px;">
      <p style="font-weight: bold; color: #1e40af; margin-bottom: 8px;">Message</p>
      <div style="background: #f0f9ff; padding: 16px; border-radius: 8px; border-left: 4px solid #2563eb; white-space: pre-wrap;">${escapeHtml(data.message)}</div>
    </div>
    <p style="margin-top: 24px; color: #64748b; font-size: 12px;">
      You can reply directly to this email to respond to ${escapeHtml(data.name)}.
    </p>
  </div>
</body>
</html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { name, email, message, language, user_agent } = body;

    // Server-side validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return new Response(JSON.stringify({ error: 'Invalid name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return new Response(JSON.stringify({ error: 'Invalid email' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 2000) {
      return new Response(JSON.stringify({ error: 'Invalid message' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validLanguages = ['en', 'fr', 'ar'];
    const lang = validLanguages.includes(language) ? language : 'en';

    // 1. Insert into database
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: message.trim(),
        language: lang,
        user_agent: user_agent || null,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(JSON.stringify({ error: 'Failed to save submission' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 2. Send email notification via Resend
    if (RESEND_API_KEY) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: 'GNS Contact <onboarding@resend.dev>',
            to: [NOTIFICATION_EMAIL],
            reply_to: email.trim(),
            subject: `[GNS Contact] New message from ${name.trim()}`,
            html: buildEmailHtml({
              name: name.trim(),
              email: email.trim(),
              message: message.trim(),
              language: lang,
            }),
          }),
        });

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text();
          console.error('Resend API error:', emailError);
          // Don't fail the request - data is already saved
        }
      } catch (emailErr) {
        console.error('Email sending error:', emailErr);
        // Don't fail the request - data is already saved
      }
    } else {
      console.warn('RESEND_API_KEY not set - skipping email notification');
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
