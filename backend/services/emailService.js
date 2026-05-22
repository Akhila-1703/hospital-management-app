import nodemailer from "nodemailer";

/**
 * Sends an email reminder to a patient about an upcoming appointment.
 * Falls back to styled console logging if SMTP environment variables are not configured.
 * 
 * @param {Object} data
 * @param {string} data.patientEmail - The patient's email address
 * @param {string} data.patientName - The patient's name
 * @param {string} data.doctorName - The doctor's name
 * @param {string} data.appointmentDate - Formatted appointment date
 * @param {string} data.appointmentTime - Formatted appointment time
 * @param {string} data.reason - Reason for the visit
 * @returns {Promise<boolean>} Resolves to true if sent/logged successfully
 */
export const sendAppointmentReminder = async ({
  patientEmail,
  patientName,
  doctorName,
  appointmentDate,
  appointmentTime,
  reason
}) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const subject = `🔔 Reminder: Your Appointment is in 1 Hour!`;
  
  const textContent = `Hello ${patientName},\n\nThis is a friendly reminder that you have an appointment scheduled in 1 hour.\n\nAppointment Details:\n- Doctor: ${doctorName}\n- Date: ${appointmentDate}\n- Time: ${appointmentTime}\n- Reason: ${reason}\n\nPlease arrive 10 minutes early.\n\nBest regards,\nHospital Management System`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #2563eb; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Appointment Reminder</h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Hello <strong>${patientName}</strong>,</p>
        <p style="font-size: 16px; color: #555555; line-height: 1.6;">This is a friendly reminder that you have an appointment scheduled with us in <strong>1 hour</strong>.</p>
        
        <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; border-radius: 6px; padding: 20px; margin: 25px 0;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Consultation Details</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 100px; font-weight: 500;">Doctor:</td>
              <td style="padding: 6px 0; color: #1f2937; font-weight: 600;">Dr. ${doctorName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Date:</td>
              <td style="padding: 6px 0; color: #1f2937;">${appointmentDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Time:</td>
              <td style="padding: 6px 0; color: #1f2937; font-weight: 600; color: #2563eb;">${appointmentTime}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500; vertical-align: top;">Reason:</td>
              <td style="padding: 6px 0; color: #4b5563; font-style: italic;">"${reason}"</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; line-height: 1.5; margin-bottom: 25px;">
          📍 <em>Note: Please aim to arrive at least 10 minutes prior to your scheduled slot to complete any necessary check-in procedures. If you need to reschedule or cancel, please do so through your dashboard as soon as possible.</em>
        </p>
        
        <div style="text-align: center; margin-top: 30px; border-t: 1px solid #f3f4f6; padding-top: 20px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated reminder. Please do not reply to this email.</p>
          <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  // Check if SMTP is configured
  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10) || 587,
        secure: parseInt(port, 10) === 465, // true for 465, false for other ports
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"Hospital Management" <${user}>`,
        to: patientEmail,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[EmailService] Email sent successfully to ${patientEmail}. MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${patientEmail} via SMTP:`, error);
      // Don't fail the entire scheduler if SMTP fails; log and return false
      return false;
    }
  } else {
    // Development Fallback: Visual Console Log
    console.log("\n" + "=".repeat(80));
    console.log("📧 [DEVELOPMENT MODE] EMAIL REMINDER DISPATCHED");
    console.log("-".repeat(80));
    console.log(`To:        ${patientName} <${patientEmail}>`);
    console.log(`Subject:   ${subject}`);
    console.log(`Doctor:    Dr. ${doctorName}`);
    console.log(`Date/Time: ${appointmentDate} @ ${appointmentTime} (In 1 hour)`);
    console.log(`Reason:    "${reason}"`);
    console.log("-".repeat(80));
    console.log("Body Preview:");
    console.log(textContent);
    console.log("=".repeat(80) + "\n");
    
    return true;
  }
};

/**
 * Sends a welcome email containing login credentials directly to the newly registered doctor.
 * Falls back to styled console logging if SMTP environment variables are not configured.
 * 
 * @param {Object} data
 * @param {string} data.email - Doctor's email address
 * @param {string} data.name - Doctor's full name
 * @param {string} data.password - Plaintext password
 * @returns {Promise<boolean>} Resolves to true if sent/logged successfully
 */
export const sendDoctorCredentials = async ({ email, name, password }) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  const subject = `🏥 Your Doctor Login Credentials - People Care Hospital`;
  
  const textContent = `Hello Dr. ${name},\n\nWelcome to People Care International Hospital. An administrator has created your doctor account. Below are your login credentials:\n\nLogin URL: http://localhost:5173/login\nEmail: ${email}\nPassword: ${password}\n\nPlease log in and change your password for security.\n\nBest regards,\nHospital Management System`;

  const htmlContent = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
      <div style="background-color: #0071e3; color: white; padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Welcome to People Care</h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff;">
        <p style="font-size: 16px; color: #333333; line-height: 1.6; margin-top: 0;">Hello <strong>Dr. ${name}</strong>,</p>
        <p style="font-size: 16px; color: #555555; line-height: 1.6;">Your professional doctor account has been successfully created by the administrator. You can now log in to manage your appointments, write prescriptions, and access patient files.</p>
        
        <div style="background-color: #f3f4f6; border-left: 4px solid #0071e3; border-radius: 6px; padding: 20px; margin: 25px 0;">
          <h3 style="margin-top: 0; margin-bottom: 12px; font-size: 16px; color: #1e3a8a; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Login Credentials</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr>
              <td style="padding: 6px 0; color: #6b7280; width: 100px; font-weight: 500;">Portal URL:</td>
              <td style="padding: 6px 0; color: #0071e3; font-weight: 600;"><a href="http://localhost:5173/login" style="color: #0071e3; text-decoration: none;">http://localhost:5173/login</a></td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Email:</td>
              <td style="padding: 6px 0; color: #1f2937; font-weight: 600;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #6b7280; font-weight: 500;">Password:</td>
              <td style="padding: 6px 0; color: #2563eb; font-family: monospace; font-size: 16px; font-weight: bold; letter-spacing: 0.5px;">${password}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 14px; color: #ef4444; line-height: 1.5; margin-bottom: 25px; font-weight: 500;">
          ⚠️ <em>For security reasons, we strongly recommend that you change your password immediately after logging in for the first time via your profile settings.</em>
        </p>
        
        <div style="text-align: center; margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 20px;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">This is an automated system email. Please do not reply to this message.</p>
          <p style="font-size: 12px; color: #9ca3af; margin: 4px 0 0 0;">&copy; ${new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  `;

  if (host && user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port: parseInt(port, 10) || 587,
        secure: parseInt(port, 10) === 465,
        auth: {
          user,
          pass,
        },
      });

      const info = await transporter.sendMail({
        from: `"People Care Hospital" <${user}>`,
        to: email,
        subject,
        text: textContent,
        html: htmlContent,
      });

      console.log(`[EmailService] Credentials email sent successfully to ${email}. MessageId: ${info.messageId}`);
      return true;
    } catch (error) {
      console.error(`[EmailService] Failed to send credentials email to ${email} via SMTP:`, error);
      return false;
    }
  } else {
    // Development Fallback: Visual Console Log
    console.log("\n" + "=".repeat(80));
    console.log("📧 [DEVELOPMENT MODE] DOCTOR CREDENTIALS EMAIL DISPATCHED");
    console.log("-".repeat(80));
    console.log(`To:        Dr. ${name} <${email}>`);
    console.log(`Subject:   ${subject}`);
    console.log(`Login URL: http://localhost:5173/login`);
    console.log(`Password:  ${password}`);
    console.log("-".repeat(80));
    console.log("Body Preview:");
    console.log(textContent);
    console.log("=".repeat(80) + "\n");
    
    return true;
  }
};
