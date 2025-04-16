// "use server"

// import { Resend } from "resend"

// // You'll need to add RESEND_API_KEY to your environment variables
// const resend = new Resend(process.env.RESEND_API_KEY)

// // Replace with your support email address
// const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL || "support@yourdomain.com"

// export async function sendSupportEmail(formData: FormData) {
//   const name = formData.get("name") as string
//   const email = formData.get("email") as string
//   const subject = formData.get("subject") as string
//   const message = formData.get("message") as string

//   const subjectMap: Record<string, string> = {
//     general: "General Inquiry",
//     technical: "Technical Support",
//     billing: "Billing Question",
//     feedback: "Feedback",
//   }

//   const subjectText = subjectMap[subject] || "Customer Support Request"

//   try {
//     await resend.emails.send({
//       from: "Customer Support <noreply@yourdomain.com>",
//       to: [SUPPORT_EMAIL],
//       reply_to: email,
//       subject: `Support Request: ${subjectText} from ${name}`,
//       html: `
//         <h1>New Support Request</h1>
//         <p><strong>From:</strong> ${name} (${email})</p>
//         <p><strong>Subject:</strong> ${subjectText}</p>
//         <p><strong>Message:</strong></p>
//         <p>${message.replace(/\n/g, "<br>")}</p>
//       `,
//     })

//     // Also send a confirmation email to the customer
//     await resend.emails.send({
//       from: "Customer Support <noreply@yourdomain.com>",
//       to: [email],
//       subject: `We've received your support request`,
//       html: `
//         <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
//           <div style="text-align: center; margin-bottom: 20px;">
//             <img src="https://your-logo-url.com" alt="Logo" style="max-width: 150px;" />
//           </div>
//           <h1 style="color: #7a1a1a;">We've Received Your Request</h1>
//           <p>Dear ${name},</p>
//           <p>Thank you for contacting our support team. We've received your request regarding "${subjectText}" and will get back to you as soon as possible.</p>
//           <p>For your records, here's a copy of your message:</p>
//           <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             ${message.replace(/\n/g, "<br>")}
//           </div>
//           <p>If you have any additional information to add, please reply to this email.</p>
//           <p>Best regards,<br>Customer Support Team</p>
//         </div>
//       `,
//     })

//     return { success: true }
//   } catch (error) {
//     console.error("Failed to send email:", error)
//     throw new Error("Failed to send support email")
//   }
// }
