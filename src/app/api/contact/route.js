// src/app/api/contact/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    console.log("📧 Contact API called with:", { name, email, messageLength: message?.length });

    // Validate input
    if (!name || !email || !message) {
      console.error("❌ Validation failed: Missing fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Validation failed: Invalid email");
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.error("❌ Missing EMAIL_USER or EMAIL_PASSWORD in environment variables");
      return NextResponse.json(
        { error: "Email service not configured. Please contact administrator." },
        { status: 500 }
      );
    }

    console.log("✅ Environment variables found");
    console.log("📧 EMAIL_USER:", process.env.EMAIL_USER);
    console.log("📧 EMAIL_TO:", process.env.EMAIL_TO || process.env.EMAIL_USER);

    // Create transporter with detailed config
    let transporter;
    
    try {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        // Add debug options
        debug: true,
        logger: true,
      });

      console.log("✅ Transporter created");

      // Verify transporter
      await transporter.verify();
      console.log("✅ Transporter verified successfully");
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError);
      return NextResponse.json(
        { 
          error: "Email service configuration error",
          details: verifyError.message 
        },
        { status: 500 }
      );
    }

    // Email to admin/organization
    const mailOptionsToAdmin = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `New Contact Form: ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f7f7f7; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #c9a35e 0%, #f8d46a 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 28px;">New Contact Message</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #c9a35e; margin: 0 0 10px 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            
            <h2 style="color: #c9a35e; margin: 20px 0 10px 0;">Message</h2>
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #c9a35e;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    };

    // Email to user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting AR Foundation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f7f7f7; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #c9a35e 0%, #f8d46a 100%); padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="margin: 0; color: #000; font-size: 28px;">Thank You!</h1>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px;">
            <p>Dear ${name},</p>
            <p>Thank you for reaching out to AR Foundation. We have received your message and will get back to you as soon as possible.</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #c9a35e; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: bold;">Your Message:</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>Best regards,<br>AR Foundation Team</p>
          </div>
        </div>
      `,
    };

    console.log("📤 Sending email to admin...");
    await transporter.sendMail(mailOptionsToAdmin);
    console.log("✅ Admin email sent successfully");

    console.log("📤 Sending confirmation email to user...");
    await transporter.sendMail(mailOptionsToUser);
    console.log("✅ User confirmation email sent successfully");

    return NextResponse.json(
      { 
        success: true, 
        message: "Message sent successfully! Check your email for confirmation." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Contact API Error:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      command: error.command,
      stack: error.stack,
    });
    
    return NextResponse.json(
      { 
        error: "Failed to send message. Please try again later.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}
