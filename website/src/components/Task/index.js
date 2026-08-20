import React, {useEffect, useState} from 'react';
import styles from './styles.module.css';

/**
 * Task (AufgabenCheckbox) — abhakbare Aufgabe für Arbeitsblätter.
 *
 * Nutzung in MDX (ohne Import, siehe src/theme/MDXComponents.js):
 *   <Task id="ab01-3">Text der Aufgabe</Task>
 *
 * Der Haken-Zustand wird unter dem Key `task:${id}` in localStorage
 * persistiert.
 */
export default function Task({id, children}) {
  if (!id) {
    throw new Error('Task: Prop "id" ist Pflicht.');
  }

  const storageKey = `task:${id}`;
  const [checked, setChecked] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    try {
      setChecked(window.localStorage.getItem(storageKey) === 'true');
    } catch (e) {
      // ignore
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated || typeof window === 'undefined') {
      return;
    }
    try {
      window.localStorage.setItem(storageKey, String(checked));
    } catch (e) {
      // ignore
    }
  }, [checked, hydrated, storageKey]);

  const inputId = `task-checkbox-${id}`;

  return (
    <div className={styles.task}>
      <input
        type="checkbox"
        id={inputId}
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <label
        htmlFor={inputId}
        className={`${styles.label} ${checked ? styles.done : ''}`}
      >
        {children}
      </label>
    </div>
  );
}
