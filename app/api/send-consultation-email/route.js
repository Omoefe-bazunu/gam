// app/api/send-consultation-email/route.js
import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
  try {
    const formData = await request.json();

    // Format the preferred date for display
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Format the time for display
    const formatTime = (timeString) => {
      const [hours, minutes] = timeString.split(":");
      const hour12 = +hours % 12 || 12;
      const ampm = +hours >= 12 ? "PM" : "AM";
      return `${hour12}:${minutes} ${ampm}`;
    };

    const companyName = "Gambrills Partners LLC";
    const logoUrl =
      "https://firebasestorage.googleapis.com/v0/b/entcarepat.appspot.com/o/logow.png?alt=media&token=46141b3f-a853-4401-b49a-4ef6a3d2ca4d";

    // Email content for the user
    const userEmailHtml = `
    <!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consultation Request Received</title>
  </head>
  <body style="background-color: #f7f7f7; margin: 0; padding: 30px 0; font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
      
      <!-- Header -->
      <div style="text-align: center; padding: 30px 20px; background-color: #007bff; color: #ffffff;">
        <img src="${logoUrl}" alt="${companyName}" style="max-width: 90px; height: auto; margin-bottom: 12px;" />
        <h2 style="margin: 0; font-size: 22px; font-weight: 600;">${companyName}</h2>
        <h1 style="margin: 12px 0 0 0; font-size: 20px; font-weight: 500;">Thank You for Your Consultation Request!</h1>
      </div>

      <!-- Body -->
      <div style="padding: 35px 25px; color: #444; line-height: 1.7;">
        <p>Dear ${formData.firstName} ${formData.lastName},</p>

        <p>We have successfully received your consultation request and appreciate your interest in our business consulting services.</p>

        <!-- Highlight Section -->
        <div style="background-color: #f3f4f6; padding: 18px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; font-size: 16px; color: #111;">Your Request Details:</h3>
          <p><strong>Company:</strong> ${formData.companyName}</p>
          <p><strong>Business Type:</strong> ${formData.businessType}</p>
          <p><strong>Consultation Type:</strong> ${
            formData.consultationType
          }</p>
          <p><strong>Preferred Date:</strong> ${formatDate(
            formData.preferredDate
          )}</p>
          <p><strong>Preferred Time:</strong> ${formatTime(
            formData.preferredTime
          )}</p>
          ${
            formData.message
              ? `<p><strong>Additional Information:</strong> ${formData.message}</p>`
              : ""
          }
        </div>

        <h3 style="margin-top: 0; font-size: 16px; color: #111;">What's Next?</h3>
        <ul style="padding-left: 20px; margin: 15px 0;">
          <li>Our team will review your request within 24 hours</li>
          <li>We'll contact you via email or phone to confirm the consultation details</li>
          <li>If needed, we may suggest alternative dates/times based on availability</li>
          <li>A calendar invite will be sent once the consultation is confirmed</li>
        </ul>

        <p>If you have any urgent questions or need to make changes to your request, please don't hesitate to contact us directly.</p>

        <p>We look forward to helping your business achieve its goals!</p>

        <p style="margin: 30px 0 0 0;">Best regards,<br>
        <strong>The ${companyName} Team</strong></p>
      </div>
    </div>

    <!-- Footer -->
    <div style="max-width: 600px; margin: 20px auto 0 auto; padding: 12px 20px; text-align: center;">
      <p style="font-size: 12px; color: #999; line-height: 1.5; margin: 0;">
        This is an automated confirmation email. Please do not reply directly to this message.<br>
        Contact us: <a href="mailto:info@gambrillspartners.com" style="color: #007bff; text-decoration: none;">info@gambrillspartners.com</a>
      </p>
    </div>
  </body>
</html>

    `;

    // Email content for the admin/team notification
    const adminEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Consultation Request</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
            .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px 20px; }
            .client-info { background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .request-info { background-color: #e0f2fe; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🚨 New Consultation Request</h1>
          </div>
          
          <div class="content">
            <p><strong>A new consultation request has been submitted!</strong></p>
            
            <div class="client-info">
              <h3>Client Information:</h3>
              <p><strong>Name:</strong> ${formData.firstName} ${
      formData.lastName
    }</p>
              <p><strong>Email:</strong> <a href="mailto:${formData.email}">${
      formData.email
    }</a></p>
              <p><strong>Phone:</strong> <a href="tel:${formData.phone}">${
      formData.phone
    }</a></p>
              <p><strong>Company:</strong> ${formData.companyName}</p>
              <p><strong>Business Type:</strong> ${formData.businessType}</p>
            </div>
            
            <div class="request-info">
              <h3>Consultation Details:</h3>
              <p><strong>Type:</strong> ${formData.consultationType}</p>
              <p><strong>Preferred Date:</strong> ${formatDate(
                formData.preferredDate
              )}</p>
              <p><strong>Preferred Time:</strong> ${formatTime(
                formData.preferredTime
              )}</p>
              ${
                formData.message
                  ? `<p><strong>Message:</strong><br>${formData.message}</p>`
                  : "<p><strong>Message:</strong> No additional information provided</p>"
              }
            </div>
            
            <p><strong>Action Required:</strong> Please review and respond to this consultation request within 24 hours.</p>
            
            ${
              formData.submissionId
                ? `<p><strong>Submission ID:</strong> ${formData.submissionId}</p>`
                : ""
            }
          </div>
          
          <div class="footer">
            <p>This notification was automatically generated from the consultation booking form.</p>
          </div>
        </body>
      </html>
    `;

    // Send confirmation email to the user
    const userEmailResponse = await resend.emails.send({
      from: "Gambrills Partners LLC <info@gambrillspartners.com>",
      to: [formData.email],
      subject: "Consultation Request Received - We'll Be In Touch Soon!",
      html: userEmailHtml,
    });

    // Send notification email to the admin team
    const adminEmailResponse = await resend.emails.send({
      from: "Gambrills Partners LLC <info@gambrillspartners.com>",
      to: ["info@gambrillspartners.com"], // You can add multiple admin emails here
      subject: `New Consultation Request from ${formData.firstName} ${formData.lastName}`,
      html: adminEmailHtml,
      // Optional: Add reply-to for direct client communication
      replyTo: formData.email,
    });

    console.log("User email sent:", userEmailResponse);
    console.log("Admin email sent:", adminEmailResponse);

    return NextResponse.json(
      {
        success: true,
        message: "Emails sent successfully",
        userEmailId: userEmailResponse.data?.id,
        adminEmailId: adminEmailResponse.data?.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending emails:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send email notifications",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
