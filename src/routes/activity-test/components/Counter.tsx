import { useState, useEffect, useEffectEvent, type ReactNode } from 'react';
import { Temporal } from '@js-temporal/polyfill';

type CounterProps = {
  text: string;
  labelId?: string;
  children?: ReactNode; // PropsWithChildren will potentially get deprecated in React 20
};

export function Counter({ text, labelId, children }: CounterProps) {
  const [startDate] = useState(() => Temporal.Now.plainTimeISO()); // doesn't get reset when activity is set to background rendering state
  const [count, setCount] = useState(0);

  const textWithLettersOnly = text.replace(/[^a-zA-Z]/g, '').toUpperCase();

  // const uniqueLetters = new Set(textWithLettersOnly);
  const letterFrequencies = new Map<string, number>();
  for (const character of textWithLettersOnly) {
    const count = letterFrequencies.getOrInsertComputed(character, () => 0);
    letterFrequencies.set(character, count + 1);
  }

  const onCountChange = useEffectEvent(() => {
    setCount((prevCount) => prevCount + 1);
  });

  // paused while activity is inactive
  useEffect(() => {
    let timeoutId: number | undefined = undefined;

    const updateCount = () => {
      onCountChange();
      timeoutId = window.setTimeout(updateCount, 1000);
    };

    timeoutId = window.setTimeout(updateCount, 1000);

    return () => clearTimeout(timeoutId);
  }, []);

  console.log(count);

  return (
    <>
      <div className="mb-normal empty:mb-0">{children}</div>
      {textWithLettersOnly.length ? (
        <>
          <p role="status" aria-live="polite" aria-atomic="true" className="mb-normal">
            Status: <span>{textWithLettersOnly.length} letters</span>,{' '}
            <span>{letterFrequencies.size} unique letters</span>,{' '}
            <span>first search at {startDate.toLocaleString('en-GB')}</span>
          </p>
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
        </>
      ) : (
        <p>No results</p>
      )}
    </>
  );
}
