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
    // Admin notification
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div className="flex gap-2" style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="${companyName}" style="max-width: 100px; height: auto;" />
          <h2>${companyName}</h2>
        </div>
        <p>New user signed up: ${email}</p>
      </div>
    `;

    // User welcome message
    const userHtml = `
      <div style="background-color: #f7f7f7; padding: 30px 0; font-family: Arial, sans-serif; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

    <!-- Header -->
    <div style="text-align: center; padding: 30px 20px; background-color: #007bff; color: #ffffff;">
      <img src="${logoUrl}" alt="${companyName}" style="max-width: 80px; height: auto; margin-bottom: 12px;" />
      <h2 style="margin: 0; font-size: 22px; font-weight: 600;">Welcome to ${companyName}!</h2>
    </div>

    <!-- Body -->
    <div style="padding: 35px 25px; text-align: center;">
      <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 20px;">
        Hi there,
      </p>
      <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 20px;">
        Thank you for signing up! 🎉
      </p>
      <p style="font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 30px;">
        We’re excited to have you onboard. Free to <a href="https://www.gambrillspartners.com/consultation" style="color: #007bff; text-decoration: none;" target='_blank'>book a consultation</a> with us today!
      </p>

      <p style="font-size: 14px; line-height: 1.6; color: #444; margin: 0;">
        Best regards,<br>
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

    `;

    // Send email to admin
    await resend.emails.send({
      from: `${companyName} <info@gambrillspartners.com>`,
      to: "info@gambrillspartners.com",
      subject: "New User Signup",
      html: adminHtml,
    });

    // Send welcome email to user
    await resend.emails.send({
      from: `${companyName} <info@gambrillspartners.com>`,
      to: email,
      subject: "Welcome to Gambrills Partners LLC!",
      html: userHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}
