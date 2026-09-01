import React from 'react';
// Default MDX-Komponenten von Docusaurus (swizzle-freies Wrapping).
import MDXComponents from '@theme-original/MDXComponents';
import TestTable from '@site/src/components/TestTable';
import Task from '@site/src/components/Task';
import FillInTable from '@site/src/components/FillInTable';
import Solution from '@site/src/components/Solution';
import PageExplorer from '@site/src/components/PageExplorer';
import TestLayers from '@site/src/components/TestLayers';

export default {
  // Bestehende Docusaurus-MDX-Komponenten übernehmen ...
  ...MDXComponents,
  // ... und um projekteigene Komponenten ergänzen, damit sie in
  // jeder .md/.mdx-Datei ohne expliziten Import genutzt werden können.
  TestTable,
  Task,
  FillInTable,
  Solution,
  PageExplorer,
  TestLayers,
};
