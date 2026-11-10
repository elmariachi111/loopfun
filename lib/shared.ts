import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'loop.fun';
export const appTagline = 'A field guide to agentic loops';
export const siteUrl = 'https://loop.fun';
export const docsRoute = '/guide';
export const docsImageRoute = '/og/guide';
export const docsContentRoute = '/llms.mdx/guide';

export const gitConfig = {
  user: 'elmariachi111',
  repo: 'loopfun',
  branch: 'main',
};

export const repoUrl = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

/** Where field notes live in the repository. */
export const fieldNotesDir = 'content/guide/field-notes';

const fieldNoteTemplate = `---
title: "Your loop, in one line"
description: "What the loop does and where it runs"
author: "your name or handle"
harness: "Claude Code / Codex / Hermes / Antigravity / OpenClaw / custom"
---

## The loop
What triggers it, what it does each iteration, and when it stops.

## The goal
The exact goal or completion condition you used.

## What worked

## What hurt
Cost, verification, state, review, security, anything else.

## Numbers (optional)
Iterations, runtime, tokens or dollars, success rate.
`;

/** Opens GitHub's "new file" editor with the field-note template pre-filled. */
export const newFieldNoteUrl = `${repoUrl}/new/${gitConfig.branch}/${fieldNotesDir}?filename=${encodeURIComponent(
  'my-loop.mdx',
)}&value=${encodeURIComponent(fieldNoteTemplate)}`;

/** Opens a GitHub issue, optionally about a specific page. */
export function discussUrl(topic?: string) {
  const title = topic ? `Discussion: ${topic}` : 'Idea / correction';
  return `${repoUrl}/issues/new?title=${encodeURIComponent(title)}`;
}

export function editUrl(path: string) {
  return `${repoUrl}/edit/${gitConfig.branch}/content/guide/${encodeURI(path)}`;
}

const getContentUrl = createGetUrl(docsContentRoute);

export function getPageMarkdownUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'content.md'];

  return { segments, url: getContentUrl(segments, page.locale) };
}

const getImageUrl = createGetUrl(docsImageRoute);

export function getPageImageUrl(page: { slugs: string[]; locale?: string }) {
  const segments = [...page.slugs, 'image.png'];

  return { segments, url: getImageUrl(segments, page.locale) };
}
