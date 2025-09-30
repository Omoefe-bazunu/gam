// app/api/send-newsletter-email/route.js
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const companyName = "Gambrills Partners LLC";
    const logoUrl =
      "https://firebasestorage.googleapis.com/v0/b/entcarepat.appspot.com/o/logow.png?alt=media&token=46141b3f-a853-4401-b49a-4ef6a3d2ca4d";

    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="${companyName}" style="max-width: 80px; height: auto;" />
          <h2 style="margin: 5px 0 0 0; color: #007bff;">${companyName}</h2>
        </div>
        <p style="font-size: 16px;">New subscriber: <strong>${email}</strong></p>
      </div>
    `; // HTML content for user (Updated for a neat, professional layout)

    const userHtml = `
     <div style="background-color: #f7f7f7; padding: 30px 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
    
    <!-- Header -->
    <div style="background-color: #007bff; color: #ffffff; padding: 30px 20px; text-align: center;">
      <img src="${logoUrl}" alt="Logo" style="width: 50px; height: 50px; margin-bottom: 12px;"/>
      <h3 style="margin: 0; font-size: 22px; font-weight: 600;">Hello</h3>
      <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 400;">
        Thank you for signing up with us.
      </p>
    </div>

    <!-- Body -->
    <div style="padding: 35px 25px; text-align: center;">
      <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 25px;">
        Thank you for subscribing to our newsletter.  
        Check your inbox regularly for updates — we’ll keep you posted with tips and guides to help you scale a successful business.
      </p>

      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px auto; width: 85%;">

      <p style="font-size: 13px; line-height: 1.6; color: #777; margin: 0 0 20px;">
        If you have any questions regarding your account, feel free to reach out to us at  
        <a href="mailto:support@gambrillspartners.com" style="color: #007bff; text-decoration: none;">support@gambrillspartners.com</a>.  
        We're here with you every step of the way.
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #444; margin: 0;">
        Thank You,<br>
        <strong>The ${companyName} Team</strong><br>
        <a href="https://www.gambrillspartners.com" style="color: #007bff; text-decoration: none; font-weight: 600;">www.gambrillspartners.com</a>
      </p>
    </div>
  </div>

  <!-- Footer -->
  <div style="max-width: 600px; margin: 20px auto 0 auto; padding: 12px 20px; text-align: center;">
    <p style="font-size: 11px; color: #999; line-height: 1.5; margin: 0;">
      ${companyName}, 30 N Gould St, Ste N, Sheridan, WY 82801, USA<br>
      Tel: +1 (721) 405-2335
    </p>
  </div>
</div>

    `; // Send email to admin

    await resend.emails.send({
      from: `${companyName} <info@gambrillspartners.com>`,
      to: "info@gambrillspartners.com",
      subject: "New Newsletter Subscription",
      html: adminHtml,
    }); // Send email to subscriber

    await resend.emails.send({
      from: `${companyName} <info@gambrillspartners.com>`,
      to: email,
      subject: "Subscription Confirmed",
      html: userHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending newsletter email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
