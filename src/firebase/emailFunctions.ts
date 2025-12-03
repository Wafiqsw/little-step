// src/firebase/emailFunctions.ts

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResponse {
  success: boolean;
  messageId?: string;
}

/**
 * Send an email using Firebase Cloud Function and Resend
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param html - Email HTML content
 * @returns Promise with success status and message ID
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string
): Promise<SendEmailResponse> => {
  try {
    const functionUrl = 'https://sendemail-uhcrf5ljfq-uc.a.run.app';

    console.log('Calling sendEmail function with:', { to, subject });

    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: { to, subject, html }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Function response error:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('sendEmail function result:', result);

    return (result as any).result as SendEmailResponse;
  } catch (error: any) {
    console.error("Error calling sendEmail function:", error);
    console.error("Error message:", error?.message);
    throw error;
  }
};

/**
 * Send verification code email to parent
 * @param email - Parent's email address
 * @param code - Verification code (TOC)
 * @param parentName - Parent's name
 * @param studentName - Student's name (optional)
 * @param tempPassword - Temporary password for first login (optional)
 */
export const sendVerificationEmail = async (
  email: string,
  code: string,
  parentName: string,
  studentName?: string,
  tempPassword?: string
): Promise<SendEmailResponse> => {
  const subject = "LittleStep - Verification Code & Login Credentials";
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #371B34; color: white; padding: 20px; text-align: center; }
          .content { background-color: #f9f9f9; padding: 30px; }
          .code-box { background-color: white; border: 2px solid #371B34; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; }
          .password-box { background-color: #fff3cd; border: 2px solid #ffc107; padding: 15px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; }
          .student-info { background-color: white; border-left: 4px solid #371B34; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          .warning { color: #d32f2f; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>LittleStep</h1>
          </div>
          <div class="content">
            <h2>Hello ${parentName},</h2>
            ${studentName ? `
            <div class="student-info">
              <p style="margin: 0; font-weight: bold; color: #371B34;">Student Registered:</p>
              <p style="margin: 5px 0 0 0; font-size: 18px;">${studentName}</p>
            </div>
            <p>Your child has been successfully registered with LittleStep!</p>
            ` : '<p>Thank you for registering with LittleStep!</p>'}
            
            <p>To complete your registration, please use the following credentials:</p>
            
            <p style="font-weight: bold; margin-top: 20px;">Verification Code (TOC):</p>
            <div class="code-box">${code}</div>
            
            ${tempPassword ? `
            <p style="font-weight: bold; margin-top: 20px;">Temporary Password:</p>
            <div class="password-box">${tempPassword}</div>
            <p class="warning">⚠️ Please change this password after your first login!</p>
            ` : ''}
            
            <p>Please enter these credentials in the app to complete your registration.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; 2024 LittleStep. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail(email, subject, html);
};

/**
 * Resend verification code email to parent
 * @param email - Parent's email address
 * @param code - New verification code (TOC)
 * @param parentName - Parent's name
 * @param studentName - Student's name (optional)
 * @param tempPassword - Temporary password (optional)
 */
export const resendVerificationEmail = async (
  email: string,
  code: string,
  parentName: string,
  studentName?: string,
  tempPassword?: string
): Promise<SendEmailResponse> => {
  return sendVerificationEmail(email, code, parentName, studentName, tempPassword);
};
