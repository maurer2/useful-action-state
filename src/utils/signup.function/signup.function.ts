import { z } from 'zod';
import { zxcvbn, zxcvbnOptions, type Score as PasswordStrengthScore } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';
import { Profanity } from '@2toad/profanity';

type ValidatorResult = { isValid: true } | { isValid: false; message: string };

const MIN_PASSWORD_STRENGTH: PasswordStrengthScore = 2; // 0 - 4, the higher, the better

const passwordStrengthCheckOptions = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(passwordStrengthCheckOptions);

const profanity = new Profanity({
  languages: ['en'],
});

// frontend
export const signupSchemaBase = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const validatePasswordStrength = async (password: string): Promise<ValidatorResult> => {
  const { score, feedback } = zxcvbn(password);

  if (score >= MIN_PASSWORD_STRENGTH) {
    return { isValid: true };
  }

  return { isValid: false, message: feedback.warning || 'Unsafe password' };
};

const validateUsername = async (username: string): Promise<ValidatorResult> => {
  const isCleanUsername = !Boolean(profanity.exists(username));

  if (isCleanUsername) {
    return { isValid: true };
  }

  return { isValid: false, message: 'Unbecoming username' };
};

// backend
export const signupSchemaExtended = signupSchemaBase.superRefine(
  async ({ password, username }, context) => {
    const passwordStrengthValidatorResult = await validatePasswordStrength(password);
    const usernameValidatorResult = await validateUsername(username);
    const isPasswordContainingUsername = password.toLowerCase().includes(username.toLowerCase());

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
  },
);
