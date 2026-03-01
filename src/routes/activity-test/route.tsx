import { createFileRoute } from '@tanstack/react-router';
import {
  Activity,
  useMemo,
  useState,
  useId,
  useCallback,
  type ComponentPropsWithoutRef,
} from 'react';
import { debounce } from 'es-toolkit';
import type { ChangeEvent } from 'react';

import { Counter } from './components/Counter';

export const Route = createFileRoute('/activity-test')({
  component: ActivityTest,
});

type Fields = 'query' | 'query2';
type CounterProps = ComponentPropsWithoutRef<typeof Counter>;

function ActivityTest() {
  const [query, setQuery] = useState('');
  const [showQuery, setShowQuery] = useState(false);
  const headlineLetterCountId = useId();

  function submitAction(formData: FormData) {
    const value = formData.get('query');

    console.log('Value submitted:', value);

    return; // do nothing
  }

  // flag update needs to be debounced, not query value update itself
  // todo: Find out if still needed with React compiler
  const debouncedShowQuery = useMemo(
    () =>
      debounce(() => {
        setShowQuery(true);
      }, 500),
    [],
  );

  const handleChange = (field: Fields) => (event: ChangeEvent<HTMLInputElement>) => {
    if (field === 'query') {
      setQuery(event.currentTarget.value);
    }
    setShowQuery(false); // set activity back to background rendering state in case it was previously set to visible
    debouncedShowQuery();
  };

  // still needed with compiler for referential stability
  const renderCounterHeadline = useCallback(
    ({
      numberOfLetters,
      numberOfUniqueLetters,
    }: Parameters<NonNullable<CounterProps['children']>>[0]) => (
      <h3 id={headlineLetterCountId} className="mb-normal">
        <span>Letter frequency </span>
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="before:content-['('] after:content-[')']"
        >
          {numberOfLetters} letters, {numberOfUniqueLetters} unique letters
        </span>
      </h3>
    ),
    [],
  );

  return (
    <>
      <h1 className="mb-medium text-2xl">Activity component</h1>

      <search className="mb-medium">
        <form
          action={submitAction}
          className="gap-x-normal gap-y-small flex flex-wrap items-center"
        >
          <label htmlFor="query" className="basis-full">
            Search query
          </label>
          <input
            value={query}
            name="query"
            id="query"
            type="text"
            onChange={handleChange('query')}
            className="border-foreground p-small focus-visible:outline-highlight aria-invalid:border-error flex-none border focus-visible:outline-offset-4"
          />
          <button
            type="submit"
            className="border-foreground px-normal py-small focus-visible:outline-highlight flex-none cursor-pointer border focus-visible:outline-offset-4"
          >
            Search
          </button>
        </form>
      </search>

      <section>
        <h2>Results (Rendered hidden, not revealed until user stops typing)</h2>
        <Activity mode={showQuery ? 'visible' : 'hidden'}>
          <div role="status" aria-live="polite" aria-atomic="true" className="mt-normal">
            <p className="mb-normal">
              <span>Your search query is: </span>
              <output htmlFor="query" className="italic">
                {query}
              </output>
            </p>
            <Counter text={query} labelId={headlineLetterCountId}>
              {({ numberOfLetters, numberOfUniqueLetters }) =>
                renderCounterHeadline({ numberOfLetters, numberOfUniqueLetters })
              }
            </Counter>
          </div>
        </Activity>
      </section>
    </>
  );
}
