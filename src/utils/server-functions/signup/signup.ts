import { z } from 'zod';
import { zxcvbn, zxcvbnOptions, type Score as PasswordStrengthScore } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { Profanity } from '@2toad/profanity';

type ValidatorResult = { isValid: true } | { isValid: false; message: string };

const MIN_PASSWORD_STRENGTH: PasswordStrengthScore = 2; // 0 - 4, the higher, the better

zxcvbnOptions.setOptions({
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
});

const profanity = new Profanity({
  languages: ['en'],
});

const signupSchemaClient = z.object({
  username: z.string().min(5),
  password: z.string().min(8),
});

export const validateSignupFormClientSide = (fields: unknown) => {
  const validationResults = signupSchemaClient.safeParse(fields);

  if (validationResults.success) {
    return null;
  }

  const { fieldErrors } = z.flattenError(validationResults.error);

  return fieldErrors; // todo update incorrect documentation on zod
};

const validatePasswordStrength = (password: string): ValidatorResult => {
  const { score, feedback } = zxcvbn(password);

  if (score >= MIN_PASSWORD_STRENGTH) {
    return { isValid: true };
  }

  return { isValid: false, message: feedback.warning || 'Unsafe password' };
};

const validateUsername = (username: string): ValidatorResult => {
  const isCleanUsername = !profanity.exists(username);

  if (isCleanUsername) {
    return { isValid: true };
  }

  return { isValid: false, message: 'Unbecoming username' };
};

const validateXAsync = (): Promise<ValidatorResult> => {
  const { promise, resolve } = Promise.withResolvers<ValidatorResult>();

  setTimeout(() => {
    resolve({ isValid: true });
  }, 250);

  return promise;
};

export const signupSchemaServer = signupSchemaClient.superRefine(
  async ({ password, username }, context) => {
    const passwordStrengthValidatorResult = validatePasswordStrength(password);
    const usernameValidatorResult = validateUsername(username);
    const isPasswordContainingUsername = password.toLowerCase().includes(username.toLowerCase());
    const isAsyncValidator = await validateXAsync();

    if (!passwordStrengthValidatorResult.isValid) {
      context.addIssue({
        code: 'custom',
        message: passwordStrengthValidatorResult.message,
        path: ['password'],
      });
    }

    if (!usernameValidatorResult.isValid) {
      context.addIssue({
        code: 'custom',
        message: usernameValidatorResult.message,
        path: ['username'],
      });
    }

    if (!usernameValidatorResult.isValid) {
      context.addIssue({
        code: 'custom',
        message: usernameValidatorResult.message,
        path: ['username'],
      });
    }

    if (isPasswordContainingUsername) {
      context.addIssue({
        code: 'custom',
        message: "Password shouldn't contain the username",
        path: ['password'],
      });
    }

    console.info(isAsyncValidator);
  },
);
