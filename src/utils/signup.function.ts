import { z } from 'zod';
import { zxcvbn, zxcvbnOptions, type ZxcvbnResult } from '@zxcvbn-ts/core';
import zxcvbnCommonPackage from '@zxcvbn-ts/language-common';
import zxcvbnEnPackage from '@zxcvbn-ts/language-en';

const MIN_PASSWORD_STRENGTH: ZxcvbnResult['score'] = 2; // 1 - 4, the higher, the better
const passwordStrengthCheckOptions = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
};
zxcvbnOptions.setOptions(passwordStrengthCheckOptions);

// frontend
export const signupSchemaBase = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const checkPassword = async (password: string): Promise<string | null> => {
  const checkResults = zxcvbn(password);

  if (checkResults.score >= MIN_PASSWORD_STRENGTH) {
    return null;
  }

  return checkResults.feedback.warning || 'Poor password';
};

// backend
export const signupSchemaExtended = signupSchemaBase.superRefine(async ({ password }, context) => {
  const passwordCheckResult = await checkPassword(password);

  if (passwordCheckResult) {
    context.addIssue({
      code: 'custom',
      message: passwordCheckResult,
      path: ['password'],
    });
  }

  // email lookup stuff
});
