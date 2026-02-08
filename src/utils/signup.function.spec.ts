import { faker } from '@faker-js/faker';
import { z } from 'zod';

import { signupSchemaExtended } from './signup.function';

describe('signupSchemaExtended', () => {
  const validEmail = faker.internet.email();
  const strongPassword = faker.internet.password({ length: 50, pattern: /[\w.]/ });

  it('should pass when password end email are filled in and password is strong', async () => {
    const result = await signupSchemaExtended.safeParseAsync({
      username: validEmail,
      password: strongPassword,
    });

    expect(result.success).toBeTruthy();
  });

  it('should fail when password is too weak', async () => {
    const result = await signupSchemaExtended.safeParseAsync({
      username: validEmail,
      password: 'meow',
    });

    expect(result.success).toBeFalsy();

    if (result.error) {
      const error = z.flattenError(result.error);

      expect(error.fieldErrors['password']?.length).toBeGreaterThan(0);
      expect(error.fieldErrors['password']?.[0]).toBeTypeOf('string');
    }
  });
});
