import { createFileRoute } from "@tanstack/react-router";
import { useActionState } from "react"

type FormState = {
  fields: {
    term: {
      value: string;
      errorMessage?: string;
    };
  };
  // todo action data
};

export const Route = createFileRoute("/client-side-form-submit")({
  component: RouteComponent,
})

const searchAction = async (previousFormState: FormState, formData: FormData): Promise<FormState> => {
  const { promise: searchActionPromise, resolve, reject } = Promise.withResolvers<FormState>();
  const termRaw = formData.get("term");

  const term =
    typeof termRaw === "string"
      ? termRaw
      : previousFormState.fields.term.value;

  // todo search logic

  setTimeout(() => {
    resolve({
      fields: {
        term: {
          value: term,
          // errorMessage: 'Term is invalid.',
        },
      },
    });
  }, 2000);

  return searchActionPromise;
};


function RouteComponent() {
  const [formState, formAction, isPending] = useActionState(searchAction, {
    fields: {
      term: {
        value: "",
      },
    },
  });

  const hasTermError = Boolean(formState.fields.term.errorMessage);

  return (
    <main className="container mx-auto p-2">
        <h1 className="text-2xl mb-8">Client side only with form submit</h1>

        <search className="mb-8">
          <form
            aria-label="Search form"
            action={formAction}
            inert={isPending}
            className="@container/form inert:opacity-50 inert:animate-pulse motion-reduce:transition-none"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          >
            <fieldset className="grid grid-cols-1 @md/form:grid-cols-[min-content_15rem] items-center gap-3 mb-8">
              <legend className="sr-only">Search fields</legend>
              <label htmlFor="term">Term</label>
              <input
                type="text"
                defaultValue={formState.fields.term.value}
                className="border border-gray-200 p-1"
                placeholder="Please enter a term"
                name="term"
                id="term"
                required
                minLength={1}
                aria-invalid={hasTermError}
                aria-errormessage="termError"
              />
              {hasTermError ? (
                <p id="termError" className="col-start-2 col-end-auto">Term is invalid.</p>
              ) : null}
            </fieldset>
            <button type="submit" className="border-gray-200 border px-4 py-1">Search</button>
          </form>
        </search>

        <p>Results</p>
    </main>
  )
}
