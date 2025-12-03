# Firebase Functions Setup Guide

## 📋 Current Status

✅ Firebase Cloud Functions is set up with TypeScript
✅ Resend email service is configured
✅ sendEmail function is created
✅ Helper functions for React Native are created

## 🔧 Setup Steps

### 1. Get Resend API Key

1. Go to [Resend](https://resend.com)
2. Sign up or log in
3. Verify your domain (or use their testing domain)
4. Go to **API Keys** section
5. Create a new API key
6. Copy the API key (starts with `re_`)

### 2. Configure Firebase Functions Environment

You need to set the Resend API key as an environment variable:

```bash
cd functions
firebase functions:config:set resend.key="YOUR_RESEND_API_KEY_HERE"
```

Or for the new way (using .env):
```bash
# Create a .env file in functions folder
echo "RESEND_API_KEY=YOUR_RESEND_API_KEY_HERE" > .env
```

### 3. Update Email Sender Domain

In `functions/src/index.ts`, change this line:
```typescript
from: "LittleStep <noreply@yourdomain.com>",
```

To your verified domain:
```typescript
from: "LittleStep <noreply@yourverifieddomain.com>",
```

Or use Resend's test domain:
```typescript
from: "LittleStep <onboarding@resend.dev>",
```

### 4. Build and Deploy Functions

```bash
cd functions

# Build TypeScript
npm run build

# Deploy to Firebase
npm run deploy

# Or deploy and watch logs
firebase deploy --only functions && firebase functions:log
```

### 5. Test Locally (Optional)

```bash
cd functions

# Start emulator
npm run serve

# Then in your React Native app's firebase/index.ts, uncomment:
# if (__DEV__) {
#   connectFunctionsEmulator(functions, "localhost", 5001);
# }
```

## 💻 How to Use in React Native

### Example 1: Send Verification Email

```typescript
import { sendVerificationEmail } from '../firebase/emailFunctions';

// When registering a new parent
const handleRegisterStudent = async () => {
  try {
    const verificationCode = generateRandomCode(); // e.g., "123456"

    await sendVerificationEmail(
      parentEmail,
      verificationCode,
      parentName
    );

    console.log('Verification email sent!');
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
```

### Example 2: Resend Verification Code

```typescript
import { resendVerificationEmail } from '../firebase/emailFunctions';

const handleResendCode = async () => {
  try {
    const newCode = generateRandomCode();

    await resendVerificationEmail(
      email,
      newCode,
      parentName
    );

    alert('Verification code resent!');
  } catch (error) {
    console.error('Failed to resend:', error);
    alert('Failed to resend code');
  }
};
```

### Example 3: Custom Email

```typescript
import { sendEmail } from '../firebase/emailFunctions';

const handleSendCustomEmail = async () => {
  try {
    await sendEmail(
      'parent@example.com',
      'Welcome to LittleStep!',
      '<h1>Welcome!</h1><p>Your account is ready.</p>'
    );
  } catch (error) {
    console.error('Failed to send email:', error);
  }
};
```

## 🔍 Debugging

### Check Function Logs

```bash
firebase functions:log
```

### Test Function Manually

You can test the function using Firebase Console:
1. Go to Firebase Console > Functions
2. Find your `sendEmail` function
3. Click on it and view logs
4. Use the "Test" feature to send a test email

### Common Issues

**Issue: "Function not found"**
- Make sure you deployed: `npm run deploy`
- Check function name matches: `sendEmail`

**Issue: "Permission denied"**
- User must be authenticated to call the function
- Add authentication check in the function if needed

**Issue: "Resend API key not found"**
- Set the environment variable: `firebase functions:config:set resend.key="YOUR_KEY"`
- Or check `.env` file in functions folder

**Issue: "Email not sending"**
- Check Resend dashboard for errors
- Verify your domain in Resend
- Check function logs: `firebase functions:log`

## 📝 Code Generation Helper

Here's a simple function to generate verification codes:

```typescript
// src/utils/codeGenerator.ts
export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 6-digit code: e.g., "123456"
```

## 🚀 Next Steps

1. ✅ Set up Resend API key
2. ✅ Update sender email domain
3. ✅ Deploy functions
4. ✅ Test sending an email
5. ✅ Integrate into your registration flow
6. ✅ Add error handling and user feedback
7. ✅ Monitor function usage and costs

## 💰 Cost Considerations

- **Firebase Functions**: Free tier includes 2M invocations/month
- **Resend**: Free tier includes 3,000 emails/month
- Monitor usage in Firebase Console and Resend Dashboard

## 🔒 Security Notes

- Never commit `.env` files to git
- Keep API keys secret
- Consider adding rate limiting
- Add authentication checks to Cloud Functions
- Validate email addresses before sending
