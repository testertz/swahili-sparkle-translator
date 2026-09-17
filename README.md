# Swahili Bridge

Yes — for Phase One, keep it simple and public: no admin, no accounts, no authentication. Here is the revised single prompt:

Phase One English–Swahili Translation Website Prompt

Create a modern, professional English ↔ Swahili (Kiswahili) translation website for 2026. This is Phase One, so keep the product simple, fast, polished, and publicly accessible.

Important: Do NOT add authentication, user accounts, sign-in/sign-up, admin dashboards, or account management.

Main Goal

Build a premium translation website focused on:

English → Swahili

Swahili → English

Natural and accurate translations

Fast performance

Excellent mobile experience

Clean professional design

Simple user experience

The website should feel like a serious language product, not a basic demo.

Homepage

Create a beautiful landing page with a clean header.

Header

Include:

Professional logo/brand name

Translator

Dictionary

Common Phrases

About

Dark/light mode toggle

Keep the navigation minimal and responsive.

Hero Section

Headline:

English to Swahili Translator

Subheadline:

Translate English and Kiswahili naturally, accurately, and instantly.

Place the translator directly below the headline.

Translation Interface

Create a premium two-panel translation interface.

English Input

Include:

Language selector

Large text area

Placeholder: “Type or paste English text here...”

Character count

Word count

Clear button

Paste button

Microphone button

Translate button

Swahili Output

Include:

Translation result

Copy button

Listen button

Download button

Share button

Regenerate button

👍 / 👎 feedback

Add a clear English ⇄ Kiswahili swap button.

Translation Modes

Allow users to choose:

Natural

Formal

Professional

Simple

Conversational

Academic

The translation should prioritize meaning and natural Swahili, rather than literal word-for-word translation.

Alternative Translations

After generating a translation, optionally display:

Alternative translations

Show 2–4 natural alternatives when appropriate.

Each alternative should have:

Copy

Listen

Use this translation

Explain Translation

Add an Explain button.

When clicked, explain:

Meaning

Important words

Context

Grammar

Why the translation was phrased that way

Keep explanations short and easy to understand.

Pronunciation

Add text-to-speech for both English and Swahili.

Users should be able to:

Listen

Pause/replay

Adjust playback speed

Use natural-sounding voices where available.

Voice Input

Add microphone support.

Users should be able to:

Click microphone

Speak

Convert speech to text

Translate the text

Show a polished recording animation and clear microphone permission/error states.

Translation History

Since there is no authentication, store recent translations locally in the user's browser.

Include:

Recent translations

Original text

Translation

Date/time

Delete individual item

Clear history

Reuse translation

Do not send unnecessary history data to a server.

Clearly explain that local history is stored on the user's device.

Favorites

Allow users to favorite translations locally in the browser.

No account required.

Include:

Favorite translations

Favorite words

Favorite phrases

Remove favorite

Search favorites

Use local storage or an appropriate browser storage mechanism.

Dictionary

Create a dedicated English ↔ Swahili Dictionary section.

Include:

Search

English definition

Swahili meaning

Part of speech

Example sentence

Related words

Pronunciation

Favorite button

Create a clean dictionary search experience.

Common Swahili Phrases

Create a dedicated page/section with useful phrases.

Categories:

Greetings

Travel

Business

Shopping

Restaurants

Directions

School

Work

Everyday conversation

Each phrase should show:

English

Kiswahili

with:

Listen

Copy

Favorite

Learn Swahili

Create a lightweight learning section containing:

Basic greetings

Numbers

Days and months

Common vocabulary

Basic grammar

Pronunciation

Everyday expressions

Keep it simple for Phase One but structure it so more lessons can be added later.

Feedback

After each translation show:

Was this translation helpful?

👍 Yes
👎 No

If the user selects No, show:

Incorrect meaning

Grammar problem

Wrong word

Too formal

Too informal

Other

For Phase One, feedback can be handled through a simple lightweight mechanism without requiring an account.

SEO

Optimize the website for searches such as:

English to Swahili translator

Swahili to English translator

English Swahili translation

Swahili dictionary

English Swahili dictionary

Swahili phrases

Learn Swahili

Swahili pronunciation

Implement:

SEO metadata

Open Graph metadata

Semantic HTML

Sitemap

Robots configuration

Fast-loading pages

Clean URLs

Structured data where appropriate

Design

Use a premium modern 2026 design.

Style:

Minimal

Professional

Elegant

Spacious

Modern typography

Rounded cards

Subtle shadows

Soft gradients

Smooth micro-interactions

Excellent contrast

Professional icons

Use a subtle East African-inspired color palette without making the website look overly decorative.

Include:

Light mode

Dark mode

System theme

Mobile Experience

Make mobile the priority.

The website must work beautifully on:

iPhone

Android

Tablets

Laptop

Desktop

On mobile, stack the translation panels vertically.

Make the translator usable with one hand and keep important controls easy to reach.

Performance

Make the website extremely fast.

Implement:

Optimized assets

Minimal JavaScript

Lazy loading

Code splitting

API request debouncing

Efficient caching

Skeleton loading

Optimized fonts

Excellent Core Web Vitals

Optimize for users on slower mobile connections.

Accessibility

Implement:

Keyboard navigation

Screen-reader support

Proper labels

Accessible buttons

Visible focus states

Semantic HTML

High color contrast

Reduced-motion support

Translation API Architecture

Do not put translation API keys in frontend code.

Use:

Frontend → Secure Backend/API → Translation Provider → Backend → Frontend

The backend should handle:

API authentication

Input validation

Rate limiting

Error handling

Retries

Caching where appropriate

Provider errors

Make the translation provider replaceable so another provider can be used later.

Translation Quality

The translation system should prioritize:

Natural Swahili

Correct grammar

Context

Sentence structure

Proper nouns

Names

Places

Numbers

Dates

Currency

Business terminology

Technical terminology

Preserve URLs, email addresses, names, product names, and technical identifiers where appropriate.

Error States

Create polished user-friendly states for:

Empty input

Translation in progress

Translation failed

Network error

API unavailable

Rate limit

Microphone permission denied

Speech recognition failure

Never expose raw technical/API errors.

Example:

“We couldn't complete that translation. Please try again.”

Pages

Create only these main pages:

Home / Translator

Dictionary

Common Phrases

Learn Swahili

About

Privacy Policy

Terms of Service

Contact

Do NOT create:

Login

Sign up

User dashboard

Admin dashboard

Account settings

Authentication pages

Privacy

Since there are no accounts, emphasize simple privacy.

Do not unnecessarily store personal information.

Local history and favorites should remain in the user's browser.

Provide:

Privacy Policy

Terms of Service

Clear information about how translation requests are processed

Future-Ready

Design the code so Phase Two can later add:

Image/OCR translation

PDF translation

Document translation

Real-time voice translation

Conversation mode

Mobile apps

Browser extension

Developer API

More African languages

AI Swahili tutor

Custom terminology/glossaries

Do not build those features now.

Final Product

The finished website should feel like a professional 2026 English–Swahili language platform.

The first thing users should see is the translator.

Keep the interface uncluttered, intuitive, fast, trustworthy, and visually impressive.

No authentication. No accounts. No admin. No unnecessary complexity. Focus entirely on delivering an excellent English ↔ Swahili translation experience.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/f78853c8-06de-49c1-8352-fc9c8890da32).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
