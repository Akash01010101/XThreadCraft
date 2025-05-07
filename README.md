# Sparklog Twitter Integration

## Features
- Twitter API integration for tweet posting and retrieval
- Supabase backend for data storage
- GIPHY integration for GIF search and sharing
- Turnstile CAPTCHA for enhanced security

## Installation
1. Clone the repository
2. Run `npm install` to install dependencies

## Environment Variables Setup

### Twitter API Credentials
1. Go to https://developer.twitter.com/ and create a developer account
2. Create a new project and app
3. Under 'Keys and tokens', you'll find:
   - API Key and Secret
   - Client ID and Secret
   - Bearer Token
4. Generate Access Token and Secret under 'Authentication Tokens'

### Supabase Configuration
1. Create a Supabase account at https://supabase.io/
2. Create a new project
3. In Project Settings > API, you'll find:
   - Project URL
   - anon (public) key
4. Create a service role key in Project Settings > API
5. Generate JWT secret in Project Settings > API

### GIPHY API Key
1. Go to https://developers.giphy.com/
2. Create a developer account
3. Create a new app to get your API key

### Turnstile CAPTCHA
1. Go to https://developers.cloudflare.com/turnstile/
2. Add a site to get your Site Key
3. In Settings, you'll find your Secret Key

### Environment File Setup
1. Create a `.env` file in the root directory
2. Add the following variables:

```
# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_ROLE_KEY=your_supabase_role_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret

# Twitter API Configuration
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
TWITTER_ACCESS_TOKEN=your_twitter_access_token
TWITTER_ACCESS_SECRET=your_twitter_access_secret

# GIPHY Configuration
GIPHY_API_KEY=your_giphy_api_key

# Turnstile CAPTCHA Configuration
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
```

3. Replace the placeholder values with your actual credentials
4. Save the file

## Running the Application
Run `npm run dev` to start the development server.