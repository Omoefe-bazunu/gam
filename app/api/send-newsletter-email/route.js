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
      "https://firebasestorage.googleapis.com/v0/b/entcarepat.appspot.com/o/App%20Icon_GPL.webp?alt=media&token=893f7df9-4613-4477-86a4-9cf3a2880ce8"; // replace with your actual logo in the public folder

    // HTML content for admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="${companyName}" style="max-width: 150px; height: auto;" />
          <h2>${companyName}</h2>
        </div>
        <p>New subscriber: ${email}</p>
      </div>
    `;

    // HTML content for user
    const userHtml = `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="${companyName}" style="max-width: 150px; height: auto;" />
          <h2>${companyName}</h2>
        </div>
        <p className="text-center">Thank you for subscribing to our newsletter. Check your inbox regularly for updates as we make sure to keep you updated with tips and guides to scale a successful business.</p>
      </div>
    `;

    // Send email to admin
    await resend.emails.send({
      from: `${companyName} <info@gambrillspartners.com>`,
      to: "info@gambrillspartners.com",
      subject: "New Newsletter Subscription",
      html: adminHtml,
    });

    // Send email to subscriber
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
