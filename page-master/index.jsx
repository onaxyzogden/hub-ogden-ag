import { useState } from "react";

// ── CATEGORY → ACCENT COLOR MAP ──────────────────────────────────────────
const CATEGORIES = [
  { label: "Business & Enterprise",   accent: "#b89050", accentLight: "#cca866", accentMuted: "#9d7a40" },
  { label: "Health & Wellness",       accent: "#5a8a82", accentLight: "#72a89e", accentMuted: "#4a7a72" },
  { label: "Education & Development", accent: "#8a7a5a", accentLight: "#a89870", accentMuted: "#7a6a4a" },
  { label: "Land & Environment",      accent: "#b89050", accentLight: "#cca866", accentMuted: "#9d7a40" },
  { label: "Rites of Passage",        accent: "#9a5a3a", accentLight: "#b87a58", accentMuted: "#8a4a2a" },
  { label: "Community & Social",      accent: "#5a7a9a", accentLight: "#7898b8", accentMuted: "#4a6a8a" },
  { label: "Spiritual Practice",      accent: "#b89050", accentLight: "#cca866", accentMuted: "#9d7a40" },
  { label: "Arts & Culture",          accent: "#8a5a7a", accentLight: "#a87898", accentMuted: "#7a4a6a" },
  { label: "Other",                   accent: "#b89050", accentLight: "#cca866", accentMuted: "#9d7a40" },
];

// ── STEPS ────────────────────────────────────────────────────────────────
const STEPS = ["Offer", "Audience", "Arc", "Generate"];

// ── SYSTEM PROMPT ─────────────────────────────────────────────────────────
const buildSystemPrompt = () => `
You are a senior copywriter for OGDEN, a platform offering 200+ transformative solutions.
Every page follows a strict five-section narrative arc driven by proven copywriting frameworks.
Your output must be a single valid JSON object — no markdown, no preamble, no commentary.

COPYWRITING FRAMEWORKS IN USE:
- Hero: FAB (Feature → Advantage → Benefit). One-line description of transformation.
- Problem: PAS (Problem → Agitate). 4 numbered scenarios. Each is a complete failure moment. No solution yet.
- Turning: BAB (Before → After → Bridge). The question that reframes everything. Italicise the key phrase.
- System: FAB conclusion. What the solution actually provides. Specific, grounded.
- Explore: Depth + proof. The headline is a single powerful statement. The stages show the HOW.
- CTA: Invitation, not pressure. Echoes the turning question.

OGDEN VOICE:
- Quiet confidence. Never hype. Never superlatives.
- Specific over vague. "60 days" beats "a long time".
- The problem sections should feel uncomfortably accurate.
- Turning headline: one em-dash, italicised key phrase, ends with a question mark.
- All copy is second-person ("you", "your") unless stated otherwise.

OUTPUT FORMAT — return exactly this JSON structure:
{
  "page_title": "string — product name + short descriptor",
  "hero": {
    "eyebrow": "string — 4-6 word category descriptor in plain caps style",
    "headline": "string — 6-10 words. The transformation promise. No line break tags.",
    "subhead": "string — 2-3 sentences. The before/after. Mentions the specific audience pain."
  },
  "problem": {
    "eyebrow": "string — 4-5 words describing this failure pattern",
    "headline": "string — 2 sentences. Names the pattern. Sets up the list.",
    "items": [
      "string — scenario 1. One complete moment of failure. 2-3 sentences.",
      "string — scenario 2.",
      "string — scenario 3.",
      "string — scenario 4. The loss moment. Most emotionally resonant."
    ]
  },
  "turning": {
    "eyebrow": "string — 4-5 words",
    "headline": "string — The reframing question. Use *asterisks* around the italicised phrase.",
    "body": "string — 3-4 sentences expanding the question. Names all dimensions of the solution. Ends with the unique differentiator."
  },
  "system": {
    "eyebrow": "string — 'What [Product Name] provides'",
    "headline": "string — The capability promise. Use *asterisks* for italic phrase.",
    "body": "string — 2-3 sentences. Specific. Names the most distinctive feature last."
  },
  "explore": {
    "eyebrow": "string — '[Product Name] · Method' or similar",
    "headline": "string — 2-3 words. A declaration. e.g. 'Nothing Assumed.' or 'No Guesswork.'",
    "body": "string — 1-2 sentences. The scope of coverage.",
    "stages_eyebrow": "string — 4-5 words describing the process arc",
    "stages_headline": "string — 2 short sentences. How many stages. What that means.",
    "stages": [
      { "title": "string", "text": "string — 2-3 sentences." },
      { "title": "string", "text": "string" },
      { "title": "string", "text": "string" },
      { "title": "string", "text": "string" },
      { "title": "string", "text": "string" }
    ]
  },
  "cta": {
    "headline": "string — Invitation. Echoes the turning question. Use *asterisks* for italic.",
    "sub": "string — 2 sentences. Restates the core promise. Final honest sentence about what the system does."
  }
}
`;

const buildUserPrompt = (f) => `
Generate a complete solution page for the following offer:

SOLUTION NAME: ${f.name}
CATEGORY: ${f.category}
TARGET AUDIENCE: ${f.audience}
ONE-LINE DESCRIPTION: ${f.description}
THE PROBLEM (before state): ${f.problem}
THE TURNING QUESTION: ${f.turning}
WHAT IT PROVIDES: ${f.system}
PROOF / DEPTH: ${f.explore}
ADDITIONAL CONTEXT: ${f.notes || "None"}

Follow the JSON structure exactly. Make the copy feel specific to this audience and offer.
`;

// ── HTML TEMPLATE BUILDER ─────────────────────────────────────────────────
const buildHTML = (data, brief, cat) => {
  const { hero, problem, turning, system, explore, cta, page_title } = data;
  const { accent, accentLight, accentMuted } = cat;

  const italicise = (str) =>
    str.replace(/\*(.*?)\*/g, "<em>$1</em>").replace(/\n/g, "<br>");

  const stagesHTML = explore.stages.map((s, i) => `
      <li class="num-item">
        <span class="num-index">0${i + 1}</span>
        <div>
          <p class="num-title">${s.title}</p>
          <p class="num-text">${s.text}</p>
        </div>
      </li>`).join("");

  const problemItems = problem.items.map((item, i) => `
      <li class="num-item no-title">
        <span class="num-index">0${i + 1}</span>
        <p class="num-text">${item}</p>
      </li>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${page_title} — OGDEN</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=DM+Mono:wght@300;400;500&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
/* ── PRODUCT THEME ── */
:root {
  --accent:       ${accent};
  --accent-light: ${accentLight};
  --accent-muted: ${accentMuted};
}

/* ── BASE TOKENS ── */
:root {
  --ink:        #0a0906;
  --char:       #111009;
  --parchment:  #f0ebe0;
  --bone:       #d8d0bf;
  --dust:       #8a8070;
  --line:       rgba(184,144,80,0.18);
  --line-soft:  rgba(240,235,224,0.06);
  --serif:  'Cormorant Garamond', Georgia, serif;
  --mono:   'DM Mono', monospace;
  --sans:   'Instrument Sans', system-ui, sans-serif;
}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html{scroll-behavior:smooth;}
body{background:var(--char);color:var(--parchment);font-family:var(--sans);line-height:1.6;overflow-x:hidden;}

/* ── SKIP NAV ── */
.skip-nav{position:absolute;top:-999px;left:1rem;z-index:9999;background:var(--parchment);color:var(--ink);padding:0.6rem 1.25rem;font-family:var(--mono);font-size:0.75rem;letter-spacing:0.1em;text-decoration:none;border-radius:2px;}
.skip-nav:focus{top:0.75rem;}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:2px;}

/* ── BACKGROUND ── */
.bg-fixed{position:fixed;inset:0;z-index:0;pointer-events:none;}
.topo-layer{position:absolute;inset:0;opacity:0.048;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800'%3E%3Cdefs%3E%3CradialGradient id='rg' cx='45%25' cy='40%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%23b89050' stop-opacity='1'/%3E%3Cstop offset='100%25' stop-color='%23b89050' stop-opacity='0'/%3E%3C/radialGradient%3E%3C/defs%3E%3Cellipse cx='360' cy='320' rx='280' ry='220' fill='none' stroke='url(%23rg)' stroke-width='1'/%3E%3Cellipse cx='360' cy='320' rx='165' ry='125' fill='none' stroke='url(%23rg)' stroke-width='1'/%3E%3Cellipse cx='360' cy='320' rx='70' ry='50' fill='none' stroke='url(%23rg)' stroke-width='1'/%3E%3Cellipse cx='200' cy='500' rx='130' ry='100' fill='none' stroke='url(%23rg)' stroke-width='0.8' opacity='0.5'/%3E%3C/svg%3E");background-size:75vw 75vw;background-position:60% 30%;background-repeat:no-repeat;}
.grain-layer{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");opacity:0.55;}

/* ── NAV ── */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;padding:0 2.5rem;height:48px;background:rgba(10,9,6,0.9);backdrop-filter:blur(14px);border-bottom:1px solid var(--line-soft);}
.nav-brand{font-family:var(--mono);font-size:0.75rem;font-weight:500;letter-spacing:0.2em;color:var(--parchment);text-decoration:none;text-transform:uppercase;flex-shrink:0;}
.nav-div{width:1px;height:18px;background:rgba(240,235,224,0.12);margin:0 1.5rem;flex-shrink:0;}
.nav-products{display:flex;align-items:center;gap:1.4rem;list-style:none;flex-shrink:0;}
.nav-products a{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust);text-decoration:none;transition:color 0.2s;}
.nav-products a:hover{color:var(--bone);}
.nav-products a.nav-active{color:var(--parchment);font-weight:500;}
.nav-div2{width:1px;height:18px;background:rgba(240,235,224,0.08);margin:0 1.5rem;flex-shrink:0;}
.nav-sections{display:flex;align-items:center;gap:1.4rem;list-style:none;margin-left:auto;}
.nav-sections a{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.14em;text-transform:uppercase;color:var(--dust);text-decoration:none;padding-bottom:2px;border-bottom:1px solid transparent;transition:color 0.2s,border-color 0.2s;}
.nav-sections a:hover{color:var(--bone);}
.nav-sections a.sec-active{color:var(--parchment);border-color:var(--accent);}

/* ── HERO ── */
.hero{position:relative;z-index:1;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:6rem 2rem 5rem;}
.hero-eyebrow{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.32em;text-transform:uppercase;color:var(--dust);margin-bottom:2.25rem;opacity:0;animation:fadeUp 0.8s ease 0.15s forwards;}
.hero-headline{font-family:var(--serif);font-weight:300;font-size:clamp(2.8rem,6.5vw,5.25rem);line-height:1.08;letter-spacing:-0.01em;text-align:center;color:var(--parchment);max-width:780px;margin-bottom:2rem;opacity:0;animation:fadeUp 0.9s ease 0.3s forwards;}
.hero-sub{font-family:var(--sans);font-size:clamp(0.88rem,1.6vw,1.02rem);font-weight:300;color:var(--bone);line-height:1.8;text-align:center;max-width:540px;margin-bottom:3.5rem;opacity:0;animation:fadeUp 0.9s ease 0.45s forwards;}
.hero-sub em{font-style:italic;color:var(--accent-light);font-family:var(--serif);}
.hero-rule{width:1px;height:36px;background:linear-gradient(to bottom,transparent,rgba(184,144,80,0.3),transparent);margin:0 auto 2.75rem;opacity:0;animation:fadeIn 0.8s ease 0.7s forwards;}

/* ── PATHWAYS ── */
.pathways{display:flex;flex-direction:column;gap:0.8rem;width:100%;max-width:540px;opacity:0;animation:fadeUp 0.9s ease 0.82s forwards;}
.pathway{position:relative;display:flex;align-items:center;justify-content:space-between;gap:1.5rem;padding:1.6rem 1.75rem;background:rgba(10,9,6,0.58);backdrop-filter:blur(10px);border:1px solid rgba(184,144,80,0.14);border-radius:3px;text-decoration:none;transition:background 0.3s,border-color 0.3s;overflow:hidden;}
.pathway::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 140% 120% at 50% 120%,rgba(184,144,80,0.07) 0%,transparent 60%);opacity:0;transition:opacity 0.35s;}
.pathway::after{content:'';position:absolute;left:0;top:0;bottom:0;width:2px;background:linear-gradient(to bottom,transparent,var(--accent),transparent);transform:scaleY(0);transition:transform 0.4s;transform-origin:center;}
.pathway:hover{background:rgba(18,16,11,0.82);border-color:rgba(184,144,80,0.3);}
.pathway:hover::before{opacity:1;}
.pathway:hover::after{transform:scaleY(1);}
.pathway:focus-visible{outline:2px solid var(--accent);outline-offset:2px;}
.pathway-body{flex:1;min-width:0;}
.pathway-header{display:flex;align-items:center;gap:0.8rem;margin-bottom:0.45rem;}
.pathway-title{font-family:var(--serif);font-size:1.2rem;font-weight:400;color:var(--parchment);transition:color 0.2s;}
.pathway:hover .pathway-title{color:#fff;}
.pathway-tag{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-muted);border:1px solid rgba(184,144,80,0.22);padding:0.2rem 0.5rem;border-radius:2px;white-space:nowrap;transition:color 0.2s,border-color 0.2s;}
.pathway:hover .pathway-tag{color:var(--accent-light);border-color:rgba(184,144,80,0.5);}
.pathway-desc{font-family:var(--sans);font-size:0.78rem;font-weight:300;color:rgba(216,208,191,0.7);line-height:1.65;transition:color 0.2s;}
.pathway:hover .pathway-desc{color:rgba(216,208,191,0.9);}
.pathway-arrow{font-family:var(--mono);font-size:0.95rem;color:rgba(184,144,80,0.35);flex-shrink:0;transition:color 0.25s,transform 0.25s;}
.pathway.arrow-right:hover .pathway-arrow{color:var(--accent-light);transform:translateX(4px);}
.pathway.arrow-down:hover .pathway-arrow{color:var(--accent-light);transform:translateY(4px);}

/* ── SHARED SECTION ── */
.section{position:relative;z-index:1;padding:8rem 2rem;}
.section-inner{max-width:820px;margin:0 auto;}
.section-inner--wide{max-width:780px;margin:0 auto;}
.sec-eyebrow{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.32em;text-transform:uppercase;color:var(--dust);text-align:center;margin-bottom:1.4rem;}
.sec-rule{width:32px;height:1px;background:rgba(184,144,80,0.35);margin:0 auto 3rem;}
.sec-headline{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,4vw,3.2rem);line-height:1.18;color:var(--parchment);text-align:center;margin-bottom:1.75rem;letter-spacing:0.01em;}
.sec-headline em{font-style:italic;color:var(--accent-light);}
.sec-subheadline{font-family:var(--serif);font-weight:400;font-size:clamp(1.7rem,3.2vw,2.5rem);line-height:1.18;color:var(--parchment);text-align:center;margin-bottom:1.75rem;letter-spacing:0.01em;}
.sec-subheadline em{font-style:italic;color:var(--accent-light);}
.sec-body{font-family:var(--sans);font-size:0.9rem;font-weight:300;color:rgba(216,208,191,0.65);line-height:1.85;text-align:center;max-width:620px;margin:0 auto;}

/* ── NUMBERED LIST ── */
.num-list{list-style:none;margin-top:4.5rem;}
.num-item{display:grid;grid-template-columns:72px 1fr;gap:0;padding:2.5rem 0;position:relative;opacity:0;transform:translateY(14px);transition:opacity 0.55s ease,transform 0.55s ease;}
.num-item::before{content:'';position:absolute;left:0;top:12px;bottom:12px;width:1px;background:rgba(240,235,224,0.14);}
.num-item.visible{opacity:1;transform:translateY(0);}
.num-index{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.08em;color:var(--accent-muted);padding-top:0.25rem;padding-left:2rem;}
.num-title{font-family:var(--serif);font-size:1.1rem;font-weight:400;color:var(--parchment);margin-bottom:0.6rem;line-height:1.3;}
.num-text{font-family:var(--sans);font-size:0.9rem;font-weight:300;color:rgba(216,208,191,0.72);line-height:1.82;}
.num-item.no-title .num-text{color:rgba(216,208,191,0.78);}

/* ── SEPARATOR ── */
.sep{position:relative;z-index:1;height:1px;background:rgba(240,235,224,0.05);max-width:820px;margin:0 auto;}

/* ── CTA ── */
.cta-section{position:relative;z-index:1;padding:9rem 2rem 10rem;text-align:center;}
.cta-inner{max-width:600px;margin:0 auto;}
.cta-headline{font-family:var(--serif);font-weight:300;font-size:clamp(2rem,4vw,3.2rem);line-height:1.15;color:var(--parchment);margin-bottom:1.5rem;}
.cta-headline em{font-style:italic;color:var(--accent-light);}
.cta-sub{font-family:var(--sans);font-size:0.9rem;font-weight:300;color:rgba(216,208,191,0.7);line-height:1.8;margin-bottom:3rem;}
.cta-btn{display:inline-flex;align-items:center;gap:0.75rem;padding:1rem 2.5rem;background:transparent;border:1px solid rgba(184,144,80,0.4);border-radius:3px;font-family:var(--mono);font-size:0.7rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--accent-light);text-decoration:none;transition:background 0.3s,border-color 0.3s,color 0.3s;}
.cta-btn:hover{background:rgba(184,144,80,0.1);border-color:rgba(184,144,80,0.7);color:var(--parchment);}
.cta-btn-arrow{transition:transform 0.25s;}
.cta-btn:hover .cta-btn-arrow{transform:translateX(4px);}

/* ── FOOTER ── */
footer{position:relative;z-index:1;padding:2rem 2.5rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;border-top:1px solid rgba(240,235,224,0.05);}
.footer-mark{font-family:var(--mono);font-size:0.67rem;letter-spacing:0.15em;text-transform:uppercase;color:rgba(240,235,224,0.35);}
.footer-mark span{color:var(--accent-muted);}
.footer-line{font-family:var(--serif);font-style:italic;font-size:0.8rem;color:rgba(240,235,224,0.3);}

/* ── ANIMATIONS ── */
@keyframes fadeUp{from{opacity:0;transform:translateY(18px);}to{opacity:1;transform:translateY(0);}}
@keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
.reveal{opacity:0;transform:translateY(20px);transition:opacity 0.65s ease,transform 0.65s ease;}
.reveal.visible{opacity:1;transform:translateY(0);}

@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:0.01ms!important;animation-iteration-count:1!important;transition-duration:0.01ms!important;opacity:1!important;transform:none!important;}}
@media(max-width:680px){.nav-div2,.nav-sections{display:none;}.hero-headline{font-size:2.5rem;}.section{padding:5rem 1.5rem;}.num-item{padding-left:1.25rem;}}
</style>
</head>
<body>

<div class="bg-fixed" aria-hidden="true"><div class="topo-layer"></div><div class="grain-layer"></div></div>

<a class="skip-nav" href="#main-content">Skip to main content</a>

<header>
<nav class="nav" aria-label="Site navigation">
  <a href="/" class="nav-brand">OGDEN</a>
  <div class="nav-div" aria-hidden="true"></div>
  <ul class="nav-products">
    <li><a href="#" aria-label="Home">Home</a></li>
    <li><a href="#" aria-label="BBOS">BBOS</a></li>
    <li><a href="#" aria-label="Moontrance">Moontrance</a></li>
    <li><a href="#" aria-label="Atlas">Atlas</a></li>
  </ul>
  <div class="nav-div2" aria-hidden="true"></div>
  <ul class="nav-sections">
    <li><a href="#problem"  data-sec="problem">Problem</a></li>
    <li><a href="#turning"  data-sec="turning">Turning</a></li>
    <li><a href="#system"   data-sec="system">System</a></li>
    <li><a href="#explore"  data-sec="explore">Explore</a></li>
    <li><a href="#connect"  data-sec="connect">Connect</a></li>
  </ul>
</nav>
</header>

<main id="main-content">

<section class="hero" aria-labelledby="hero-h1">
  <p class="hero-eyebrow">${hero.eyebrow}</p>
  <h1 class="hero-headline" id="hero-h1">${hero.headline}</h1>
  <p class="hero-sub">${hero.subhead}</p>
  <div class="hero-rule" aria-hidden="true"></div>
  <nav class="pathways" aria-label="Choose your entry point">
    <a href="${brief.ctaUrl}" class="pathway arrow-right">
      <div class="pathway-body">
        <div class="pathway-header">
          <span class="pathway-title">Take Me There</span>
          <span class="pathway-tag">The Platform</span>
        </div>
        <p class="pathway-desc">You know what you're here for. Enter directly and begin.</p>
      </div>
      <span class="pathway-arrow" aria-hidden="true">→</span>
    </a>
    <a href="#problem" class="pathway arrow-down">
      <div class="pathway-body">
        <div class="pathway-header">
          <span class="pathway-title">I'm New Here</span>
          <span class="pathway-tag">The Story</span>
        </div>
        <p class="pathway-desc">Understand what this is, why it exists, and whether it's for you.</p>
      </div>
      <span class="pathway-arrow" aria-hidden="true">↓</span>
    </a>
  </nav>
</section>

<div class="sep" aria-hidden="true"></div>
<section class="section" id="problem" aria-labelledby="prob-h">
  <div class="section-inner">
    <p class="sec-eyebrow reveal">${problem.eyebrow}</p>
    <div class="sec-rule reveal" aria-hidden="true"></div>
    <h2 class="sec-headline reveal" id="prob-h">${italicise(problem.headline)}</h2>
    <ul class="num-list" aria-label="Common failure patterns">${problemItems}
    </ul>
  </div>
</section>

<div class="sep" aria-hidden="true"></div>
<section class="section" id="turning" aria-labelledby="turn-h">
  <div class="section-inner">
    <p class="sec-eyebrow reveal">${turning.eyebrow}</p>
    <div class="sec-rule reveal" aria-hidden="true"></div>
    <h2 class="sec-headline reveal" id="turn-h">${italicise(turning.headline)}</h2>
    <p class="sec-body reveal">${turning.body}</p>
  </div>
</section>

<div class="sep" aria-hidden="true"></div>
<section class="section" id="system" aria-labelledby="sys-h">
  <div class="section-inner">
    <p class="sec-eyebrow reveal">${system.eyebrow}</p>
    <div class="sec-rule reveal" aria-hidden="true"></div>
    <h2 class="sec-headline reveal" id="sys-h">${italicise(system.headline)}</h2>
    <p class="sec-body reveal">${system.body}</p>
  </div>
</section>

<div class="sep" aria-hidden="true"></div>
<section class="section" id="explore" aria-labelledby="exp-h">
  <div class="section-inner--wide">
    <p class="sec-eyebrow reveal">${explore.eyebrow}</p>
    <div class="sec-rule reveal" aria-hidden="true"></div>
    <h2 class="sec-headline reveal" id="exp-h">${explore.headline}</h2>
    <p class="sec-body reveal">${explore.body}</p>
    <div style="margin-top:14rem;">
      <p class="sec-eyebrow reveal">${explore.stages_eyebrow}</p>
      <div class="sec-rule reveal" aria-hidden="true"></div>
      <h3 class="sec-subheadline reveal">${italicise(explore.stages_headline)}</h3>
    </div>
    <ul class="num-list" style="margin-top:3.5rem;" aria-label="Process stages">${stagesHTML}
    </ul>
  </div>
</section>

<div class="sep" aria-hidden="true"></div>
<section class="cta-section" id="connect" aria-labelledby="cta-h">
  <div class="cta-inner">
    <h2 class="cta-headline reveal" id="cta-h">${italicise(cta.headline)}</h2>
    <p class="cta-sub reveal">${cta.sub}</p>
    <a href="${brief.ctaUrl}" class="cta-btn reveal">
      ${brief.ctaLabel || "Take Me There"}
      <span class="cta-btn-arrow" aria-hidden="true">→</span>
    </a>
  </div>
</section>

</main>

<footer>
  <div class="footer-mark">OGDEN · ${brief.name}</div>
  <div class="footer-line">Built with intention.</div>
  <div class="footer-mark">Powered by <span>Claude</span></div>
</footer>

<script>
const obs=new IntersectionObserver(e=>{e.forEach(e=>{if(!e.isIntersecting)return;const l=e.target.closest('.num-list');l?setTimeout(()=>e.target.classList.add('visible'),Array.from(l.children).indexOf(e.target)*90):e.target.classList.add('visible');obs.unobserve(e.target);});},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal,.num-item').forEach(e=>obs.observe(e));
const so=new IntersectionObserver(e=>{e.forEach(e=>{const l=document.querySelector('.nav-sections a[data-sec="'+e.target.id+'"]');if(l)l.classList.toggle('sec-active',e.isIntersecting);});},{threshold:0.3});
['problem','turning','system','explore','connect'].forEach(id=>{const e=document.getElementById(id);if(e)so.observe(e);});
</script>
</body>
</html>`;
};

// ── FIELD COMPONENT ───────────────────────────────────────────────────────
const Field = ({ label, hint, children }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <label style={{ display: "block", fontFamily: "'DM Mono', monospace", fontSize: "0.67rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#8a8070", marginBottom: "0.5rem" }}>
      {label}
    </label>
    {hint && <p style={{ fontSize: "0.75rem", color: "rgba(216,208,191,0.45)", marginBottom: "0.5rem", fontFamily: "system-ui", lineHeight: 1.5 }}>{hint}</p>}
    {children}
  </div>
);

const inputStyle = {
  width: "100%", background: "rgba(10,9,6,0.5)", border: "1px solid rgba(184,144,80,0.2)",
  borderRadius: "3px", color: "#f0ebe0", fontFamily: "system-ui", fontSize: "0.88rem",
  padding: "0.7rem 0.9rem", lineHeight: 1.6, outline: "none", transition: "border-color 0.2s",
};
const taStyle = { ...inputStyle, minHeight: "90px", resize: "vertical" };

// ── MAIN COMPONENT ────────────────────────────────────────────────────────
export default function OGDENGenerator() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", category: CATEGORIES[0].label, description: "",
    audience: "", problem: "", turning: "", system: "", explore: "",
    ctaUrl: "", ctaLabel: "Take Me There", notes: "",
  });
  const [status, setStatus] = useState("idle"); // idle | loading | done | error
  const [output, setOutput] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const cat = CATEGORIES.find((c) => c.label === form.category) || CATEGORIES[0];

  const canProceed = [
    form.name && form.category && form.description,
    form.audience,
    form.problem && form.turning && form.system && form.explore,
  ][step] ?? true;

  const generate = async () => {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: [{ role: "user", content: buildUserPrompt(form) }],
        }),
      });
      const data = await res.json();
      const raw = data.content?.[0]?.text || "";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      const html = buildHTML(parsed, form, cat);
      setOutput(html);
      setStatus("done");
    } catch (err) {
      setErrorMsg("Generation failed. Check your inputs and try again.");
      setStatus("error");
    }
  };

  const download = () => {
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ogden-${form.name.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── STYLES ──
  const wrap = { background: "#111009", minHeight: "100vh", color: "#f0ebe0", fontFamily: "system-ui", padding: "0" };
  const header = { background: "rgba(10,9,6,0.95)", borderBottom: "1px solid rgba(240,235,224,0.06)", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 50 };
  const brand = { fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#f0ebe0" };
  const badge = { fontFamily: "'DM Mono', monospace", fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", color: cat.accentMuted, border: `1px solid ${cat.accent}33`, padding: "0.2rem 0.6rem", borderRadius: "2px" };

  const card = { maxWidth: "640px", margin: "0 auto", padding: "3rem 2rem" };

  const stepBar = { display: "flex", gap: "0.5rem", marginBottom: "3rem" };
  const stepDot = (i) => ({
    flex: 1, height: "2px",
    background: i <= step ? cat.accent : "rgba(240,235,224,0.1)",
    borderRadius: "2px", transition: "background 0.3s",
  });

  const btnPrimary = { display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", border: `1px solid ${cat.accent}66`, borderRadius: "3px", padding: "0.8rem 2rem", fontFamily: "'DM Mono', monospace", fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase", color: cat.accentLight, cursor: "pointer", transition: "all 0.2s" };
  const btnSecondary = { ...btnPrimary, border: "1px solid rgba(240,235,224,0.1)", color: "rgba(216,208,191,0.5)" };

  const sectionTitle = (t, sub) => (
    <div style={{ marginBottom: "2.5rem" }}>
      <p style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: cat.accentMuted, marginBottom: "0.75rem" }}>{t}</p>
      {sub && <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "1.4rem", fontWeight: 300, color: "#f0ebe0", lineHeight: 1.3 }}>{sub}</p>}
    </div>
  );

  // ── STEP CONTENT ──
  const steps = [
    // Step 0: Offer
    <div key="offer">
      {sectionTitle("Step 1 · The Offer", "Name and describe the solution.")}
      <Field label="Solution Name" hint="What is this called? e.g. 'Boys to Manhood Experience'">
        <input style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. The Threshold Program" />
      </Field>
      <Field label="Category">
        <select style={inputStyle} value={form.category} onChange={set("category")}>
          {CATEGORIES.map((c) => <option key={c.label}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="One-Line Description" hint="The transformation this solution delivers, in one sentence.">
        <input style={inputStyle} value={form.description} onChange={set("description")} placeholder="e.g. A structured rites-of-passage program that moves boys from childhood to grounded manhood." />
      </Field>
      <Field label="CTA Destination URL">
        <input style={inputStyle} value={form.ctaUrl} onChange={set("ctaUrl")} placeholder="https://hub.ogden.ag/..." />
      </Field>
      <Field label="CTA Button Label">
        <input style={inputStyle} value={form.ctaLabel} onChange={set("ctaLabel")} placeholder="Take Me There" />
      </Field>
    </div>,

    // Step 1: Audience
    <div key="audience">
      {sectionTitle("Step 2 · The Audience", "Who is this for, and what are they carrying?")}
      <Field label="Target Audience" hint="Describe them specifically — their situation, identity, and what they're struggling with.">
        <textarea style={taStyle} value={form.audience} onChange={set("audience")} placeholder="e.g. Fathers of boys aged 12–18 who sense their son is drifting — consuming more, producing less, with no clear passage into responsibility. Men who had no rite of passage themselves." />
      </Field>
    </div>,

    // Step 2: Arc
    <div key="arc">
      {sectionTitle("Step 3 · The Narrative Arc", "Five inputs drive the five story sections.")}
      <Field label="The Problem" hint="Describe 3-4 specific failure moments. What does the 'before' state look like? Be precise — general pain doesn't sell.">
        <textarea style={taStyle} value={form.problem} onChange={set("problem")} placeholder="e.g. Boys reach 18 with no clear sense of what it means to be a man. They've consumed thousands of hours of content but been given no responsibilities. Parents sense the drift but don't know how to name it..." />
      </Field>
      <Field label="The Turning Question" hint="The 'What if...' that reframes everything. This becomes the Turning section headline.">
        <input style={inputStyle} value={form.turning} onChange={set("turning")} placeholder="e.g. What if the passage itself was the curriculum?" />
      </Field>
      <Field label="What It Provides" hint="The system — what it actually does. Specific features or methods. The distinctive capability.">
        <textarea style={taStyle} value={form.system} onChange={set("system")} placeholder="e.g. A 12-month cohort program structured around five trials: physical hardship, financial stewardship, community service, spiritual practice, and a final rite witnessed by the father..." />
      </Field>
      <Field label="Proof & Depth" hint="The stages, the method, what makes it credible. This populates the Explore section.">
        <textarea style={taStyle} value={form.explore} onChange={set("explore")} placeholder="e.g. Stage 1: Assessment — where the boy is, what he's avoiding. Stage 2: Challenge design — bespoke to his specific drift patterns. Stages 3-5: The arc from trial to testimony..." />
      </Field>
      <Field label="Additional Context (optional)">
        <textarea style={{ ...taStyle, minHeight: "60px" }} value={form.notes} onChange={set("notes")} placeholder="Anything else Claude should know about tone, audience sensitivities, or specific language to use or avoid." />
      </Field>
    </div>,

    // Step 3: Generate
    <div key="generate">
      {sectionTitle("Step 4 · Generate", "Review and produce the page.")}
      <div style={{ background: "rgba(10,9,6,0.5)", border: "1px solid rgba(240,235,224,0.08)", borderRadius: "3px", padding: "1.5rem", marginBottom: "2rem" }}>
        {[["Solution", form.name], ["Category", form.category], ["Audience", form.audience?.slice(0, 80) + "…"], ["CTA", form.ctaUrl]].map(([k, v]) => (
          <div key={k} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: "0.5rem", padding: "0.6rem 0", borderBottom: "1px solid rgba(240,235,224,0.05)" }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "#8a8070" }}>{k}</span>
            <span style={{ fontSize: "0.82rem", color: "rgba(216,208,191,0.7)" }}>{v}</span>
          </div>
        ))}
      </div>

      {status === "error" && (
        <p style={{ color: "#c06050", fontFamily: "'DM Mono', monospace", fontSize: "0.75rem", marginBottom: "1rem" }}>{errorMsg}</p>
      )}

      {status === "done" && (
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ background: "rgba(90,138,130,0.1)", border: "1px solid rgba(90,138,130,0.3)", borderRadius: "3px", padding: "1rem 1.25rem", marginBottom: "1rem", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", color: "#72a89e", letterSpacing: "0.1em" }}>
            ✓ Page generated — {output?.length?.toLocaleString()} characters
          </div>
          <button style={{ ...btnPrimary, width: "100%", justifyContent: "center" }} onClick={download}>
            Download HTML File →
          </button>
          <button style={{ ...btnSecondary, width: "100%", justifyContent: "center", marginTop: "0.75rem" }}
            onClick={() => { setStatus("idle"); setOutput(null); }}>
            Generate Again
          </button>
        </div>
      )}

      {status === "loading" && (
        <div style={{ textAlign: "center", padding: "2rem", fontFamily: "'DM Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.18em", color: cat.accentMuted }}>
          <div style={{ marginBottom: "1rem", fontSize: "1.5rem" }}>⧖</div>
          Writing copy across five sections…
        </div>
      )}
    </div>,
  ];

  return (
    <div style={wrap}>
      <div style={header}>
        <span style={brand}>OGDEN · Page Generator</span>
        <span style={badge}>{form.category || "No category"}</span>
      </div>

      <div style={card}>
        {/* Step progress bar */}
        <div style={stepBar} aria-hidden="true">
          {STEPS.map((_, i) => <div key={i} style={stepDot(i)} />)}
        </div>
        <div style={{ display: "flex", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {STEPS.map((s, i) => (
            <span key={s} style={{ fontFamily: "'DM Mono', monospace", fontSize: "0.62rem", letterSpacing: "0.15em", textTransform: "uppercase", color: i === step ? cat.accentLight : "rgba(216,208,191,0.25)", cursor: i < step ? "pointer" : "default", transition: "color 0.2s" }}
              onClick={() => i < step && setStep(i)}>
              {s}
            </span>
          ))}
        </div>

        {/* Step content */}
        {steps[step]}

        {/* Navigation */}
        {status !== "loading" && (
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "2rem", gap: "1rem" }}>
            {step > 0 && status !== "done" ? (
              <button style={btnSecondary} onClick={() => setStep((s) => s - 1)}>← Back</button>
            ) : <div />}
            {step < STEPS.length - 1 ? (
              <button style={{ ...btnPrimary, opacity: canProceed ? 1 : 0.35 }}
                onClick={() => canProceed && setStep((s) => s + 1)}
                disabled={!canProceed}>
                Continue →
              </button>
            ) : status !== "done" ? (
              <button style={{ ...btnPrimary, opacity: canProceed ? 1 : 0.35 }}
                onClick={generate}
                disabled={status === "loading"}>
                Generate Page →
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
