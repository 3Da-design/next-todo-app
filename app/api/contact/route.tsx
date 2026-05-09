import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

function buildAdminMessage(name: string, email: string, message: string) {
  return `Received a new inquiry:
    【Name】 ${name}
    【Email】 ${email}
    【Message】 ${message}
  `;
}

function buildUserMessage(name: string, email: string, message: string) {
  return `Dear ${name}
    Thank you for your message.
    We have received your request with the following details.

    ----------------------------------------
    【Name】 ${name}
    【Email】 ${email}
    【Message】 ${message}
    ----------------------------------------

    We will review your message and a representative will contact you shortly.
    Please wait a moment.
  `;
}

export async function POST(req: Request) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Please fill in all fields.'
      },
      {
        status: 400
      }
    )
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    await transporter.sendMail({
      from: `"Contact Form" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: '【New】 Contact Form Submission',
      text: buildAdminMessage(name, email, message)
    })

    await transporter.sendMail({
      from: `"Support Team" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '【Automatic Reply】 Thank you for your message.',
      text: buildUserMessage(name, email, message)
    })

    return NextResponse.json(
      {
        status: 'success',
        message: 'Your message has been submitted.'
      },
      {
        status: 200
      }
    )
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Failed to send message.'
      },
      {
        status: 500
      }
    )
  }
}
