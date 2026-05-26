# Al-Muraqib Trials — The Observer

**Test your friends. Crown the real ones.**

Al-Muraqib Trials is the gamified loyalty-trial mode inside the Al-Muraqib universe. A creator builds a personal challenge, shares a `/trial/:slug` link on Snapchat, Instagram, TikTok, or WhatsApp, and friends compete through a level ladder of personal questions.

Winners enter the Crown Council. Failed challengers get a playful, shareable Roast Verdict.

## Core loop

1. Creator builds a Loyalty Trial.
2. Creator sets personal questions, a winner reward, and custom voice-roast scripts.
3. Creator shares the `/trial/:slug` link.
4. Friend plays the Trial.
5. Friend either survives into Crown Council or fails into a viral verdict.
6. Result page pushes the challenger to create their own Trial.

## MVP screens

- Home / Landing
- Create Trial
- Public Trial at `/trial/:slug`
- Viral Verdict
- Intelligence Dashboard
- Crown Council
- Boost & Access

## Monetization-first actions

- Extra Life — revive near the end of a Trial
- Premium Roast Pack — better verdict copy and voice scripts
- Royal Trial Skin — premium story-card visuals
- Reward Gate — unlock winner reward after completing a Trial

## Safety and product language

Use playful language:

- loyalty score
- Trial level
- voice roast
- Roast Verdict
- Crown Council
- Extra Life
- winner reward

Avoid:

- hacking
- identity matching
- device fingerprinting
- forced public shaming
- private account access
- adult/off-platform access

This MVP is frontend-only. Supabase, Stripe, audio upload, and persistent reward gates can be added after the viral flow is validated.

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Render deployment

This repo includes `render.yaml` for static deployment.

- Build command: `npm install && npm run build`
- Publish directory: `dist`
