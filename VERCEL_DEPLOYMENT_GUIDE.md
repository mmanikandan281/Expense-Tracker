# Fixing "Failed to fetch" Error on Vercel

## The Problem
Your app is getting a "Failed to fetch" error because the Supabase environment variables are not configured in your Vercel deployment.

## Solution Steps

### 1. Get Your Supabase Credentials
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

### 2. Set Environment Variables in Vercel
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `expense-tracker` project
3. Go to **Settings** → **Environment Variables**
4. Add these variables:

```
Name: VITE_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development

Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Environment: Production, Preview, Development
```

### 3. Redeploy Your App
1. After adding environment variables, go to **Deployments**
2. Click **Redeploy** on your latest deployment
3. Or push a new commit to trigger automatic deployment

### 4. Local Development Setup
1. Create a `.env.local` file in your project root:
```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Restart your development server

## Verification
After deployment, check the browser console for:
- ✅ "Supabase connected successfully" message
- No more "Failed to fetch" errors

## Common Issues
- **CORS errors**: Make sure your Supabase project allows your Vercel domain
- **Invalid URL**: Ensure the Supabase URL includes `https://` and `.supabase.co`
- **Wrong key**: Use the "anon public" key, not the service role key

## Need Help?
If you still get errors after following these steps:
1. Check the browser console for specific error messages
2. Verify your Supabase project is active and not paused
3. Ensure your Vercel domain is allowed in Supabase CORS settings
