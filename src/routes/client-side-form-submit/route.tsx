import { createFileRoute } from '@tanstack/react-router';
import { useActionState, useMemo, useRef } from 'react';
import { debounce as debounce2 } from 'es-toolkit';
import type { ChangeEvent } from 'react';

type FormState = {
  fields: {
    term: {
      value: string;
      errorMessage?: string;
    };
  };
  data?: string[];
};

export const Route = createFileRoute('/client-side-form-submit')({
  component: RouteComponent,
});

const defaultFormState: FormState = {
  fields: {
    term: {
      value: '',
    },
  },
};

const searchAction = async (
  previousFormState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const { promise: searchActionPromise, resolve } = Promise.withResolvers<FormState>();

  if (formData.get('action') === 'reset') {
    resolve(defaultFormState);
  }

  const termRaw = formData.get('term');
  const term = typeof termRaw === 'string' ? termRaw : previousFormState.fields.term.value;
  const hasTermError = !term.length || term.endsWith('test');

  const newFormState: FormState = {
    ...defaultFormState,
    fields: {
      term: {
        value: term,
        errorMessage: hasTermError ? 'Term is invalid.' : undefined,
      },
    },
  };

  if (hasTermError) {
    resolve(newFormState);
  } else {
    setTimeout(() => {
      const dummyResults = Array.from({ length: 9 }, (_, index) => `Result ${index + 1}`);

      resolve({
        ...newFormState,
        data: dummyResults,
      });
    }, 1500);
  }

  return searchActionPromise;
};

// todo: improve typings
// const debounce = (callback: any, timeout = 500) => {
//   let timer: number | undefined;

//   return (...args: any) => {
//     clearTimeout(timer);

//     timer = window.setTimeout(() => callback.apply(this, args), timeout);
//   };
// };

function RouteComponent() {
  const [formState, formAction, isPending] = useActionState(searchAction, defaultFormState);
  const formElement = useRef<HTMLFormElement>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();

    formElement.current?.requestSubmit();
  };

  const debounceHandleChange = useMemo(() => debounce2(handleChange, 500), []);

  const hasTermError = typeof formState.fields.term.errorMessage !== 'undefined' && !isPending;
  const hasData = typeof formState.data !== 'undefined' && !isPending;
  const hasEntries = Boolean(formState.data?.length) && !isPending;

  return (
    <>
      <h1 className="mb-medium text-2xl">Client side form handling with uncontrolled components</h1>

      <search className="mb-medium">
        <form
          action={formAction}
          inert={isPending}
          ref={formElement}
          className="@container/form inert:animate-pulse inert:opacity-50 motion-reduce:transition-none"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          aria-label="Search form"
        >
          <fieldset className="mb-normal gap-x-normal gap-y-small grid grid-cols-1 items-center @md/form:grid-cols-[min-content_15rem]">
            <legend className="sr-only">Search fields</legend>
            <label htmlFor="term">Term</label>
            <input
              defaultValue={formState.fields.term.value}
              onChange={debounceHandleChange}
              className="border-foreground p-small focus-visible:outline-highlight aria-invalid:border-error border focus-visible:outline-offset-4"
              type="search"
              placeholder="Please enter a term"
              name="term"
              id="term"
              aria-invalid={hasTermError}
              aria-errormessage="term-error"
            />
            {hasTermError ? (
              <p id="term-error" className="aria-invalid:border-error col-start-2 col-end-auto">
                Term is invalid.
              </p>
            ) : null}
          </fieldset>
          <div className="gap-normal flex">
            <button
              type="submit"
              className="border-foreground py-small px-normal focus-visible:outline-highlight aria-invalid:border-error basis-full cursor-pointer border focus-visible:outline-offset-4 @md/form:basis-auto"
              name="action"
              value="submit"
            >
              Search
            </button>
            <button
              type="submit"
              className="border-foreground py-small px-normal focus-visible:outline-highlight aria-invalid:border-error basis-full cursor-pointer border focus-visible:outline-offset-4 @md/form:basis-auto"
              name="action"
              value="reset"
            >
              Reset
            </button>
          </div>
        </form>
      </search>

      {hasData ? (
        <section>
          <h2 className="mb-normal text-xl" role="status" aria-atomic="true">
            There are <span>{formState.data?.length ?? 0}</span> results for{' '}
            <span>"{formState.fields.term.value}"</span>
          </h2>
          {hasEntries ? (
            <ul className="gap-small flex list-inside list-disc flex-col">
              {formState.data?.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          ) : (
            <p>No results for term {formState.fields.term.value}</p>
          )}
        </section>
      ) : null}
    </>
  );
}
