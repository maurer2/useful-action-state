import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/client-side-form-submit")({
  component: RouteComponent,
})

function RouteComponent() {
  const hasTermError = true; // temp

  return (
    <main className="container mx-auto p-2">
        <h1 className="text-2xl mb-8">Client side only with form submit</h1>
        <search className="mb-8">
          <form
            inert={false}
            className="@container/form"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          >
            <fieldset className="grid grid-cols-1 @md:grid-cols-[min-content_15rem] items-center gap-3 mb-8">
              <legend className="sr-only">Term</legend>
              <label htmlFor="term">Search</label>{" "}
              <input
                type="text"
                className="border border-gray-200 p-1"
                placeholder="Term"
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
