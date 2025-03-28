# Player Registration and Matching System - Deployment Guide

This guide provides instructions for deploying the Dublin Sports Hub player registration and matching system to Netlify.

## Prerequisites

- A Netlify account
- Access to the GitHub repository at https://github.com/anuroopbs/DSM-Minimal

## Deployment Steps

1. **Push the updated code to GitHub**
   - Ensure all the new files are added to your GitHub repository
   - The key new files include:
     - `/lib/player-types.ts`
     - `/lib/player-service.ts`
     - `/app/player-profile/page.tsx`
     - `/app/player-directory/page.tsx`
     - `/app/challenge/page.tsx`
     - `/app/matches/page.tsx`

2. **Configure Netlify**
   - The `netlify.toml` file has been updated with the correct build settings
   - The build command is set to `npm run build`
   - The publish directory is set to `.next`
   - The Netlify Next.js plugin is configured

3. **Environment Variables**
   - Ensure your Firebase configuration variables are set in Netlify's environment variables section
   - Required variables include:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

4. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Select the repository and branch to deploy
   - Netlify will automatically detect the build settings from the `netlify.toml` file
   - Click "Deploy site"

## Post-Deployment

After deployment, verify the following functionality:
- User registration with skill level and availability
- Player profile editing
- Player directory with filtering
- Challenge system with match scheduling

## Troubleshooting

If you encounter any issues during deployment:
- Check the Netlify build logs for errors
- Verify that all environment variables are correctly set
- Ensure the Firebase project has the correct security rules for Firestore
- Test the application locally before deployment using `npm run build` and `npm start`
