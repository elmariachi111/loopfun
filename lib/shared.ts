import { createGetUrl } from 'fumadocs-core/source';

export const appName = 'loop.fun';
export const appTagline = 'A field guide to loop engineering';
/** One-line mission, repeated in the site footer. */
export const missionStatement =
  'Patterns, hints and tools for designing the loops that keep agents working, and for widening the set of loops you can think of.';
export const socialLinks = [
  { label: 'Bluesky', href: 'https://bsky.app/profile/loopfun.bsky.social' },
  { label: 'X', href: 'https://x.com/loop_dot_fun' },
] as const;
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

/** Where field reports live in the repository. */
export const fieldReportsDir = 'content/guide/field-reports';

const fieldReportTemplate = `---
title: "Your loop, in one line"
description: "What it does and where it runs"
author: "your name or handle"
harness: "Claude Code / Codex / Hermes / Antigravity / OpenClaw / custom"
---

{/* Write it the way you'd tell a colleague. Failures are as welcome as wins.
    Leave out secrets, customer data and internal hostnames.
    Ground rules (short): ${repoUrl}/blob/${gitConfig.branch}/CONTRIBUTING.md */}

## What I set up
What starts the loop, what it does each round, and how it knows it's done.

## What happened

## What I learned

## Numbers
Optional and rough is fine: runtime, iterations, cost, how often it worked.
`;

/** Opens GitHub's "new file" editor with the field-report template pre-filled. */
export const newFieldReportUrl = `${repoUrl}/new/${gitConfig.branch}/${fieldReportsDir}?filename=${encodeURIComponent(
  'my-loop.mdx',
)}&value=${encodeURIComponent(fieldReportTemplate)}`;

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
