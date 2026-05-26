# Al-Muraqib — The Observer

**Create your Social Radar. Find your Crown Council.**

Al-Muraqib is a mobile-first Social Intelligence Suite for GCC/MENA users. People create a Social Radar link, post it on Snapchat, Instagram, TikTok, or WhatsApp, collect consent-safe observer signals, and turn the Top 3 observers into a Crown Council.

The product is designed first for Kuwait, Saudi Arabia, and the UAE.

## Core concept

A user creates a radar link, chooses a radar mode and question, shares the link, and receives observer signals from people who enter the radar. Observers can enter publicly or masked, answer the radar question, and later use paid social/status actions such as boosts, masked access, or consent-based reveal requests.

Al-Muraqib does **not** claim hacking, device fingerprinting, identity decryption, private contact matching, or access to off-platform accounts. Reveal mechanics are consent-based only.

## Radar modes

- **General Radar** — “Who is watching my story?”
- **Crush Radar** — “Do I cross your mind?”
- **Unfinished Radar** — “Would you reply if I texted?”
- **Signal Check** — “What is my vibe to you?”

## Crown Council

The Top 3 observers become:

1. **Crown King**
2. **Diamond Prince**
3. **Golden Guard**

## MVP screens

- Home / Landing
- Create Radar
- Radar Mode + Question Setup
- Public Radar / Observer Join page at `/r/:slug`
- Viral Verdict
- Intelligence Dashboard
- Crown Council
- Boost & Access

## Paid actions

- Golden Boost — small rank boost
- Diamond Boost — stronger rank boost
- Crown Boost — challenge Top 3
- Masked Mode — stay discreet for 24h
- Royal Reveal Request — ask an observer to reveal only if they consent
- Premium anonymous message — later

Creator payouts, city battles, creator marketplaces, Queen battles, and complex competition systems are intentionally out of scope for the MVP.

## Tech stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS v4
- `motion`
- `lucide-react`

The current implementation is frontend-only with local prototype state. Supabase, Stripe, analytics, and production payments come later.

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

## Product language rules

Use:

- observer signals
- masked observer
- interest score
- repeat signal
- Crown Council
- boost rank
- request reveal

Avoid:

- hacking
- fingerprinting
- decrypt identity
- unmask without consent
- private phone/Snapchat/WhatsApp sales
- adult or off-platform access
