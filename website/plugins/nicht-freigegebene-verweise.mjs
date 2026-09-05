/**
 * Verweise auf noch nicht freigeschaltete Tutorials entschärfen.
 *
 * Die Infoblätter sind immer erreichbar (siehe tutorials.js) und verlinken
 * die Tutorials, zu denen sie gehören. Solange ein Tutorial nicht
 * freigeschaltet ist, wird es aber gar nicht erst gebaut — der Verweis zeigt
 * dann ins Leere und `onBrokenLinks: 'throw'` bricht die Veröffentlichung ab.
 *
 * Die naheliegenden Auswege taugen beide nichts:
 *   - Die Verweise weglassen. Dann fehlen sie auch, wenn das Tutorial
 *     freigeschaltet ist — und niemand denkt daran, sie nachzutragen.
 *   - `onBrokenLinks` auf 'warn' stellen. Dann rutschen echte Tippfehler
 *     genauso durch.
 *
 * Deshalb dieser Weg: Beim Bauen wird ein Verweis auf ein nicht
 * freigeschaltetes Tutorial zu normalem Text. Steht er allein in einem
 * Aufzählungspunkt (typisch für "Weiterlesen"), fällt der ganze Punkt weg —
 * ein Eintrag ohne Verweis wäre dort ein Rätsel.
 *
 * Wichtig: Nur BEKANNTE Tutorial-Ids werden so behandelt. Ein Verweis auf
 * `/tutorial-09/` bleibt ein kaputter Verweis und bricht den Build weiterhin
 * ab — Tippfehler sollen auffallen.
 */

const TUTORIAL_ADRESSE = /^\/(tutorial-\d+)(\/|$|#)/;

/**
 * @param {object} optionen
 * @param {string[]} optionen.alle        Ids aller vorhandenen Tutorials
 * @param {string[]} optionen.freigegeben Ids der veröffentlichten Tutorials
 */
export default function nichtFreigegebeneVerweise({alle = [], freigegeben = []} = {}) {
  const gesperrt = new Set(alle.filter((id) => !freigegeben.includes(id)));

  /** Zeigt dieser Knoten auf ein bekanntes, aber gesperrtes Tutorial? */
  const zeigtInsLeere = (knoten) => {
    if (!knoten || knoten.type !== 'link' || typeof knoten.url !== 'string') {
      return false;
    }
    const treffer = TUTORIAL_ADRESSE.exec(knoten.url);
    return treffer !== null && gesperrt.has(treffer[1]);
  };

  return (baum) => {
    if (gesperrt.size === 0) {
      return;
    }

    const begehe = (knoten) => {
      if (!knoten || !Array.isArray(knoten.children)) {
        return;
      }

      // 1. Aufzählungspunkte, die mit einem solchen Verweis anfangen, ganz weg.
      if (knoten.type === 'list') {
        knoten.children = knoten.children.filter((punkt) => {
          const absatz = punkt.children?.[0];
          return !zeigtInsLeere(absatz?.children?.[0]);
        });
      }

      // 2. Alle übrigen Verweise dieser Art werden zu normalem Text.
      knoten.children = knoten.children.flatMap((kind) =>
        zeigtInsLeere(kind) ? kind.children : [kind],
      );

      knoten.children.forEach(begehe);
    };

    begehe(baum);
  };
}
