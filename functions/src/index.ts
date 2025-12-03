/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {setGlobalOptions} from "firebase-functions/v2";
import {onCall} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import {Resend} from "resend";
import {defineSecret} from "firebase-functions/params";

// For cost control, set maximum concurrent instances
setGlobalOptions({maxInstances: 10});

// Define Resend API key as a secret
const resendApiKey = defineSecret("RESEND_API_KEY");

// Initialize Resend (will be set when function runs)
let resend: Resend;

interface SendEmailData {
  to: string;
  subject: string;
  html: string;
}

// Send email using Resend API
export const sendEmail = onCall(
  {secrets: [resendApiKey]},
  async (request) => {
    const {to, subject, html} = request.data as SendEmailData;

    try {
      // Initialize Resend with the secret
      if (!resend) {
        resend = new Resend(resendApiKey.value());
      }

      logger.info("Sending email", {to, subject});

      const result = await resend.emails.send({
        from: "LittleStep <onboarding@resend.dev>",
        to,
        subject,
        html,
      });

      logger.info("Email sent successfully", {result});
      return {success: true, messageId: result.data?.id};
    } catch (error) {
      logger.error("Error sending email", {error});
      throw new Error("Failed to send email");
    }
  }
);
