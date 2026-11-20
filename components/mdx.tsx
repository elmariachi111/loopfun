import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import type { MDXComponents } from 'mdx/types';
import { Cycle, Defs, Evidence, Flow, LoopLayers, Quote } from './diagrams';
import { FieldReportCTA } from './contribute';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Step,
    Steps,
    Tab,
    Tabs,
    Accordion,
    Accordions,
    Cycle,
    Defs,
    Evidence,
    Flow,
    LoopLayers,
    Quote,
    FieldReportCTA,
    // Injected by the guide page renderer, which has access to the page source.
    FieldReports: () => null,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
