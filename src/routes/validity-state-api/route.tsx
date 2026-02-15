import { createFileRoute } from '@tanstack/react-router';
import { useActionState, useRef, useEffect, type FormEvent as SubmitEvent } from 'react';
import { validateSignupFormClientSide } from '@/utils/server-functions/signup/signup';

export const Route = createFileRoute('/validity-state-api')({
  component: ValidityStateAPI,
});

type FormErrors = Partial<{
  username: string;
  password: string;
}>;

const submitValues = async (_prevState: FormErrors, formData: FormData): Promise<FormErrors> => {
  const { promise, resolve } = Promise.withResolvers<FormErrors>();

  const fields = Object.fromEntries(formData.entries()); // fails for arrays
  const validationResults = validateSignupFormClientSide(fields);

  if (validationResults === null) {
    resolve({});
  } else {
    const { username, password } = validationResults;

    // todo call server function for server validation

    // todo: improve
    resolve({
      ...(username?.[0] ? { username: username[0] } : undefined),
      ...(password?.[0] ? { password: password[0] } : undefined),
    });
  }

  return promise;
};

function ValidityStateAPI() {
  const [formErrors, formAction, isPending] = useActionState(submitValues, {});
  const usernameField = useRef<HTMLInputElement>(null);
  const passwordField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const { username, password } = formErrors;

    if (username) {
      usernameField.current?.setCustomValidity(username);
    } else {
      usernameField.current?.setCustomValidity('');
    }

    if (password) {
      passwordField.current?.setCustomValidity(password);
    } else {
      passwordField.current?.setCustomValidity('');
    }
  }, [formErrors.username, formErrors.password]);

  const handleSubmit = (_event: SubmitEvent<HTMLFormElement>) => {
    usernameField.current?.setCustomValidity('');
    passwordField.current?.setCustomValidity('');
  };

  return (
    <>
      <h1 className="mb-medium text-2xl" id="title">
        ValidityStateAPI
      </h1>

      <form aria-labelledby="title" action={formAction} onSubmit={handleSubmit}>
        <div className="flex flex-col">
          <label htmlFor="username">Name</label>
          <input
            id="username"
            name="username"
            type="text"
            required
            // aria-invalid={false}
            // aria-errormessage={false ? 'error-username' : undefined}
            ref={usernameField}
            onInput={() => usernameField.current?.setCustomValidity('')}
            className="border"
          />

          {false ? (
            <p id="error-username" role="alert">
              Valdiation message
            </p>
          ) : null}
        </div>

        <div className="flex flex-col">
          <label htmlFor="name">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            // aria-invalid={false}
            // aria-errormessage={false ? 'error-password' : undefined}
            ref={passwordField}
            onInput={() => passwordField.current?.setCustomValidity('')}
            className="border"
          />

          {false ? (
            <p id="error-password" role="alert">
              Valdiation message
            </p>
          ) : null}
        </div>

        <button type="submit" className="mt-normal mb-normal border">
          Submit
        </button>

        <hr className="mb-normal" />

        {isPending ? (
          <p id="form-status" role="status">
            Form is being submitted
          </p>
        ) : null}

        {false ? (
          <p id="form-error" role="alert">
            Errors X
          </p>
        ) : null}

        <pre className="whitespace-pre-line">{JSON.stringify(formErrors)}</pre>
      </form>
    </>
  );
}
