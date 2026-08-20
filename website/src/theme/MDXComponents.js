import React from 'react';
// Default MDX-Komponenten von Docusaurus (swizzle-freies Wrapping).
import MDXComponents from '@theme-original/MDXComponents';
import TestTable from '@site/src/components/TestTable';
import Task from '@site/src/components/Task';

export default {
  // Bestehende Docusaurus-MDX-Komponenten übernehmen ...
  ...MDXComponents,
  // ... und um projekteigene Komponenten ergänzen, damit sie in
  // jeder .md/.mdx-Datei ohne expliziten Import genutzt werden können.
  TestTable,
  Task,
};
