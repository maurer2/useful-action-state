import { useState, useMemo, type ReactNode } from 'react';
import { Temporal } from '@js-temporal/polyfill';

type ChildrenCallbackProps = {
  numberOfLetters: number;
  numberOfUniqueLetters: number;
};

type CounterProps = {
  text: string;
  labelId?: string;
  // FaCC
  children?: ({ numberOfLetters, numberOfUniqueLetters }: ChildrenCallbackProps) => ReactNode;
};

export function Counter({ text, labelId, children }: CounterProps) {
  const [startDate] = useState(() => Temporal.Now.plainTimeISO()); // doesn't get reset when activity is set to background rendering state

  const textWithLettersOnly = text.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // const uniqueLetters = new Set(textWithLettersOnly);
  const letterFrequencies = new Map<string, number>();
  for (const character of textWithLettersOnly) {
    const count = letterFrequencies.getOrInsertComputed(character, () => 0);
    letterFrequencies.set(character, count + 1);
  }

  console.log(startDate.toLocaleString('en-GB'));

  // still needed with compiler for referential stability
  const childrenCallbackProps = useMemo<ChildrenCallbackProps>(
    () => ({
      numberOfLetters: textWithLettersOnly.length,
      numberOfUniqueLetters: letterFrequencies.size,
    }),
    [textWithLettersOnly.length, letterFrequencies.size],
  );

  return (
    <>
      {children?.(childrenCallbackProps)}
      {textWithLettersOnly.length ? (
        <dl
          aria-labelledby={labelId}
          className="gap-normal grid grid-cols-[repeat(auto-fill,minmax(4rem,1fr))]"
        >
          {[...letterFrequencies].map(([letter, count]) => (
            <div className="border-foreground flex flex-col border" key={letter}>
              <dt className="bg-foreground text-background p-tiny font-bold">{letter}</dt>
              <dd className="p-tiny">{count}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p>No results</p>
      )}
    </>
  );
}
