import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { description, pageUrl, email, timestamp, userAgent } = body;

    // Validate required fields
    if (!description) {
      return NextResponse.json(
        { error: 'Bug description is required' },
        { status: 400 }
      );
    }

    // Format email content
    const emailContent = `
Bug Report Submission
====================

Description:
${description}

Page URL: ${pageUrl}
User Email: ${email || 'anonymous@cadence.app'}
Submitted: ${timestamp}
User Agent: ${userAgent}
    `.trim();

    // TODO: Integrate with EmailJS or sendgrid
    // For now, just log and return success
    console.log('Bug Report:', {
      description,
      pageUrl,
      email,
      timestamp,
      userAgent
    });

    // In production, send email via EmailJS or similar
    // Example with EmailJS:
    // const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     service_id: process.env.EMAILJS_SERVICE_ID,
    //     template_id: process.env.EMAILJS_TEMPLATE_ID,
    //     user_id: process.env.EMAILJS_PUBLIC_KEY,
    //     template_params: {
    //       to_email: 'admin@cadence.com',
    //       from_email: email,
    //       message: emailContent,
    //       subject: `Bug Report - ${pageUrl}`
    //     }
    //   })
    // });

    return NextResponse.json(
      { success: true, message: 'Bug report submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing bug report:', error);
    return NextResponse.json(
      { error: 'Failed to process bug report' },
      { status: 500 }
    );
  }
}
