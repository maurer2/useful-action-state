import { createFileRoute } from '@tanstack/react-router';
import { useActionState } from 'react';

type FormState = {
  fields: {
    term: {
      value: string;
      errorMessage?: string;
    };
  };
  // todo action data
};

export const Route = createFileRoute('/client-side-form-submit')({
  component: RouteComponent,
});

const searchAction = async (
  previousFormState: FormState,
  formData: FormData,
): Promise<FormState> => {
  const { promise: searchActionPromise, resolve, reject } = Promise.withResolvers<FormState>();
  const termRaw = formData.get('term');

  const term = typeof termRaw === 'string' ? termRaw : previousFormState.fields.term.value;
  const hasTermError = !term.length || term.includes('test');

  // todo search logic

  setTimeout(() => {
    resolve({
      fields: {
        term: {
          value: term,
          errorMessage: hasTermError ? 'Term is invalid.' : undefined,
        },
      },
    });
  }, 1500);

  return searchActionPromise;
};

function RouteComponent() {
  const [formState, formAction, isPending] = useActionState(searchAction, {
    fields: {
      term: {
        value: '',
      },
    },
  });

  const hasTermError = Boolean(formState.fields.term.errorMessage) && !isPending;

  return (
    <main className="container mx-auto p-2">
      <h1 className="mb-8 text-2xl">Client side only with form submit</h1>

      <search className="mb-8">
        <form
          aria-label="Search form"
          action={formAction}
          inert={isPending}
          className="@container/form inert:animate-pulse inert:opacity-50 motion-reduce:transition-none"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        >
          <fieldset className="mb-8 grid grid-cols-1 items-center gap-3 @md/form:grid-cols-[min-content_15rem]">
            <legend className="sr-only">Search fields</legend>
            <label htmlFor="term">Term</label>
            <input
              type="text"
              defaultValue={formState.fields.term.value}
              className="border border-gray-200 p-1 aria-[invalid=true]:border-red-600"
              placeholder="Please enter a term"
              name="term"
              id="term"
              aria-invalid={hasTermError}
              aria-errormessage="term-error"
            />
            {hasTermError ? (
              <p id="term-error" className="col-start-2 col-end-auto text-red-600">
                Term is invalid.
              </p>
            ) : null}
          </fieldset>
          <button type="submit" className="border border-gray-200 px-4 py-1">
            Search
          </button>
        </form>
      </search>

      <p>Results</p>
    </main>
  );
}
