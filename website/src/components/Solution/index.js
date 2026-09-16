import React from 'react';
import CodeBlock from '@theme/CodeBlock';

/**
 * Solution — Musterlösung als ausklappbarer Block.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *
 *   import loesung from '@site/src/data/loesung-tutorial-01.json';
 *
 *   <Solution daten={loesung} />
 *
 * `daten` wird von scripts/loesung-generieren.mjs erzeugt, das den
 * Quelltext direkt aus dem Referenzprojekt liest. Die Lösung kann deshalb
 * nicht vom lauffähigen Projekt abweichen.
 */
export default function Solution({daten, titel = 'Musterlösung'}) {
  if (!daten) {
    throw new Error('Solution: Prop "daten" ist Pflicht.');
  }

  return (
    <details>
      <summary>{titel}</summary>
      {daten.dateien.map((datei) => (
        <CodeBlock key={datei.pfad} language={datei.sprache} title={datei.pfad}>
          {datei.inhalt}
        </CodeBlock>
      ))}
    </details>
  );
}
