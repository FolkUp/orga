---
title: "Cookie Policy"
description: "How Underground Academia handles cookies, local storage, and embedded third-party media."
page_type: "cookie_policy"
language: "en"
lastmod: 2026-04-20
draft: false
translations:
  ru:
    status: done
    slug: ru/cookie-policy
---

## Overview

Underground Academia keeps its technical footprint deliberately small. We do not use analytics, advertising, or social-media tracking. The only client-side storage we rely on is a single localStorage entry that remembers your consent choice for embedded media.

## What we store locally

| Name | Where | Purpose | Lifetime |
|------|-------|---------|----------|
| `orga-consent-v1` | localStorage | Records whether you accepted or rejected embedded media (Spotify, YouTube). Contains no personal data. | Until you clear browser storage or click "Reject" again. |

This entry is scoped to the current origin only. It is not shared with other `folkup.*` properties or any third party.

## Embedded media — opt-in

Some articles include audio or video players provided by Spotify and YouTube. Those services receive your IP address and may set their own cookies when their content is loaded.

We block those embeds by default. A banner at the bottom of the page asks you to accept or reject embedded media. The iframe is only inserted into the page after you press **Accept**. If you press **Reject**, the article renders without players, and platform links remain available so you can open the track on the service of your choice directly.

You can change your mind at any time:

- **To revoke consent:** clear the browser's site data for this domain, or open the developer console and run `localStorage.removeItem('orga-consent-v1')`. A refresh brings the banner back.
- **To update consent:** click **Reject** in the banner after revocation.

## Essential operation

No cookies are set by Underground Academia itself. The site is statically generated; there is no session, no login, no server-side state that requires cookies.

## Fonts

We use system fonts only (Georgia, -apple-system, Segoe UI, Roboto, and standard fallbacks). No external font services are contacted from your browser.

## Third-party cookies from embeds

If you accept embedded media, the third-party iframe may set its own cookies and use its own storage. Those cookies are governed by the third-party provider's policy:

- Spotify — [spotify.com/legal/cookies-policy](https://www.spotify.com/legal/cookies-policy/)
- YouTube (youtube-nocookie.com) — [policies.google.com/privacy](https://policies.google.com/privacy)

We use YouTube's privacy-enhanced mode (`youtube-nocookie.com`) which limits personalization cookies until playback begins.

## Policy updates

We will update this page when our media or storage handling changes. The last update date is shown in the header of this page.

## Editorial workflow

Underground Academia uses automated tools as part of its editorial workflow. Specifically:

- **Fact verification.** Every date, figure, and attribution is cross-checked against independent public sources; automated searches assist this verification but do not replace human judgement.
- **Style review.** Drafts pass through automated style checks (consistency, AI-pattern detection, citation format) alongside human editorial review.
- **Hostile review.** Before publication, each longform article is reviewed by adversarial agents instructed to find weaknesses, unsupported claims, or compliance gaps.

Human editors are responsible for the final text, the argument, and any opinion expressed in our articles. Automated tools do not author content in our longform and investigation categories; they assist with verification, flagging, and process discipline.

This disclosure is provided in keeping with the EU AI Act Article 50 transparency principle.

## Contact

Questions about cookies or the editorial workflow: `contact@folkup.app`.
