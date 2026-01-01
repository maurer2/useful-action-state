import { createFileRoute } from '@tanstack/react-router'
import { useState, type ChangeEvent, Activity, useMemo } from 'react'
import { debounce } from 'es-toolkit'

export const Route = createFileRoute('/activity-test')({
  component: ActivityTest,
})

type Fields = 'query'

function ActivityTest() {
  const [query, setQuery] = useState('')
  const [showQuery, setShowQuery] = useState(false)

  async function submitAction(formData: FormData) {
    const value = formData.get('query')

    console.log('Value submitted:', value)

    return // do nothing
  }

  // flag update needs to be debounced, not query value update itself
  // todo: Find out if still needed with React compiler
  const debouncedShowQuery = useMemo(
    () =>
      debounce(() => {
        setShowQuery(true)
      }, 500),
    [],
  )

  const handleChange =
    (field: Fields) => (event: ChangeEvent<HTMLInputElement>) => {
      if (field === 'query') {
        setQuery(event.currentTarget.value)
      }
      setShowQuery(false) // set Activity back to background rendering state in case it was previously set to visible
      debouncedShowQuery()
    }

  return (
    <>
      <search>
        <form action={submitAction}>
          <label htmlFor="query"></label>
          <input
            value={query}
            name="query"
            id="query"
            type="text"
            onChange={handleChange('query')}
            className="border border-gray-200 p-1 focus-visible:outline-offset-1 focus-visible:outline-blue-500 aria-[invalid=true]:border-red-600"
          />

          <button
            type="submit"
            className="basis-full border border-gray-200 px-4 py-1 focus-visible:outline-offset-1 focus-visible:outline-blue-500 @md/form:basis-auto"
          >
            Search
          </button>
        </form>
      </search>

      <section>
        <h2>Results</h2>
        <p>Not rendered until user stops typing</p>
        <Activity mode={showQuery ? 'visible' : 'hidden'}>
          <div role="status" aria-live="polite" aria-atomic="true">
            <output htmlFor="query">{query}</output>
          </div>
        </Activity>
      </section>
    </>
  )
}
