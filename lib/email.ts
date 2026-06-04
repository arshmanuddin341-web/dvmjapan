import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInquiryConfirmation(email: string, name: string, stockId?: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DVM Japan <csd@dvmjapan.com>',
      to: [email],
      subject: `Inquiry Received - ${stockId || 'DVM Japan'}`,
      html: `
        <div style="font-family: sans-serif; color: #1a1f3c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a1f3c; padding: 20px; text-align: center;">
            <h1 style="color: #00d1c1; margin: 0; font-size: 24px;">DVM JAPAN</h1>
            <p style="color: white; margin: 5px 0 0; font-size: 12px; letter-spacing: 2px;">Japan Export Specialists</p>
          </div>
          <div style="padding: 30px;">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for reaching out to us. We have received your inquiry regarding <strong>${stockId || 'our services'}</strong>.</p>
            <p>Our team is currently reviewing your request and will get back to you with the details as soon as possible.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #f8fafc; border-radius: 4px; border-left: 4px solid #1a1f3c;">
              <p style="margin: 0; font-size: 14px;"><strong>Stock ID:</strong> ${stockId || 'General Inquiry'}</p>
              <p style="margin: 5px 0 0; font-size: 14px;"><strong>Status:</strong> Processing</p>
            </div>
            <p>In the meantime, feel free to browse our <a href="https://dvmjapan.com/inventory" style="color: #1a1f3c; text-decoration: underline;">online inventory</a> for more options.</p>
            <p>Best Regards,<br><strong>The DVM Japan Team</strong></p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">Toyama-ken, Imizu-shi, Japan</p>
            <p style="margin: 5px 0 0;">© 2024 DVM Japan. All Rights Reserved.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Email Send Error:', err);
    return { success: false, error: err };
  }
}

export async function sendWelcomeNewsletter(email: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'DVM Japan <csd@dvmjapan.com>',
      to: [email],
      subject: 'Welcome to DVM Japan Newsletter',
      html: `
        <div style="font-family: sans-serif; color: #1a1f3c; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #1a1f3c; padding: 20px; text-align: center;">
            <h1 style="color: #00d1c1; margin: 0; font-size: 24px;">DVM JAPAN</h1>
          </div>
          <div style="padding: 30px; text-align: center;">
            <h2>Thanks for Subscribing!</h2>
            <p>Welcome to our community. You'll now be the first to know about:</p>
            <ul style="text-align: left; display: inline-block; list-style: none; padding: 0;">
              <li>✅ New Arrivals from Japan</li>
              <li>✅ Exclusive Auction Insights</li>
              <li>✅ Shipping Updates & Port Info</li>
              <li>✅ Special Trade Prices</li>
            </ul>
            <p style="margin-top: 30px;">
              <a href="https://dvmjapan.com/inventory" style="background-color: #1a1f3c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Browse Latest Stock</a>
            </p>
          </div>
        </div>
      `,
    });

    if (error) return { success: false, error };
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendInquiryToAdmin(details: { name: string; email: string; phone?: string; subject?: string; message: string; vehicleId?: string }) {
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@dvmjapan.com';
    const { data, error } = await resend.emails.send({
      from: 'System <csd@dvmjapan.com>',
      to: [adminEmail],
      replyTo: details.email,
      subject: `NEW INQUIRY: ${details.name} - ${details.subject || 'General'}`,
      html: `
          <div style="font-family: sans-serif; color: #1a1f3c; max-width: 600px; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #1a1f3c; border-bottom: 2px solid #00d1c1; padding-bottom: 10px;">New Website Inquiry</h2>
            <p><strong>Name:</strong> ${details.name}</p>
            <p><strong>Email:</strong> ${details.email}</p>
            <p><strong>Phone:</strong> ${details.phone || 'N/A'}</p>
            <p><strong>Vehicle Stock ID:</strong> ${details.vehicleId || 'General Inquiry'}</p>
            <p><strong>Subject:</strong> ${details.subject || 'N/A'}</p>
            <div style="margin-top: 20px; padding: 15px; background: #f8fafc; border-radius: 5px;">
                <strong>Message:</strong><br/>
                <p style="white-space: pre-wrap;">${details.message}</p>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">This inquiry was submitted via the contact form on dvmjapan.com</p>
          </div>
        `,
    });
    return { success: !error, data, error };
  } catch (err) {
    return { success: false, error: err };
  }
}

export async function sendNewsletterToAdmin(email: string) {
  try {
    const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@dvmjapan.com';
    await resend.emails.send({
      from: 'System <csd@dvmjapan.com>',
      to: [adminEmail],
      subject: `NEW NEWSLETTER SUBSCRIBER: ${email}`,
      html: `
          <div style="font-family: sans-serif; color: #1a1f3c; max-width: 600px; padding: 20px;">
            <p>A new user has subscribed to the newsletter:</p>
            <p style="font-size: 18px; font-weight: bold; color: #00d1c1;">${email}</p>
            <p style="font-size: 12px; color: #666;">Date: ${new Date().toLocaleString()}</p>
          </div>
        `,
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}
