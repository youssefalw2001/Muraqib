# Diwan of Shadows — ديوان الظلال

**Leave a whisper. Flip the card.**

Diwan of Shadows is a mobile-first anonymous mystery-card social game for GCC/MENA audiences. Creators open a Diwan link, share a dark-gold sticker on Snapchat, Instagram, TikTok, or WhatsApp, and receive anonymous Shadow Cards from their circle.

The owner flips cards inside the Shadow Hearth, reads whispers, and can spend Insight Tokens to unlock safe clues. Clues are voluntary, game-generated, or based on the sender's chosen deck/mood — not device tracking, contact matching, GPS, carrier lookup, or identity decryption.

## MVP flow

1. Creator generates a Diwan link such as `/d/latifa`.
2. Creator generates a Snapchat-style sticker: “Leave a whisper in my Diwan... I'm flipping the cards tonight.”
3. Visitor chooses a deck: Truth, Roast, or Secret Crush.
4. Visitor types an anonymous whisper and may record a scrambled voice preview.
5. Owner sees face-down obsidian cards in the Shadow Hearth.
6. Owner taps to flip cards and reveal whispers.
7. Locked clue slots can be revealed with Insight Tokens.

## Current frontend features

- Luxury dark mobile-first interface
- Creator setup and share sticker preview
- Anonymous sender interface
- Truth / Roast / Secret Crush deck selection
- Native microphone recording with Web Audio distortion playback
- Shadow Hearth card dashboard
- 3D card flip reveal
- Token balance and checkout-style clue unlock modal
- Safe clue language designed to avoid stalking/surveillance claims

## Product safety rules

Use:

- Shadow Cards
- whispers
- voluntary hints
- deck aura
- time clue
- Insight Tokens
- safe mystery clues

Avoid:

- hacking
- device fingerprinting
- GPS tracking
- carrier/network lookup claims
- matching anonymous users to real contacts
- forced unmasking
- selling private accounts, phone numbers, or off-platform access

## Tech stack

- React 19
- Vite 6
- TypeScript
- Tailwind CSS v4
- Lucide React
- Native Web Audio API

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
