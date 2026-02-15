import { faker } from '@faker-js/faker';
import { z } from 'zod';

import { signupSchemaServer } from './signup';

describe('Signup Schema Extended', () => {
  const validUsername = faker.person.fullName();
  const strongPassword = faker.internet.password({ length: 50, pattern: /[\w.]/ });

  describe('password and username', () => {
    it('should pass when username and password are filled in', async () => {
      const result = await signupSchemaServer.safeParseAsync({
        username: validUsername,
        password: strongPassword,
      });

      expect(result.success).toBeTruthy();
    });

    it('should fail when username and/or password are missing', async () => {
      const result = await signupSchemaServer.safeParseAsync({
        username: '',
        password: '',
      });

      expect(result.success).toBeFalsy();

      if (result.error) {
        const error = z.flattenError(result.error);

        expect(error.fieldErrors['password']?.length).toBeGreaterThan(0);
        expect(error.fieldErrors['password']?.[0]).toBeTypeOf('string');
        expect(error.fieldErrors['username']?.length).toBeGreaterThan(0);
        expect(error.fieldErrors['username']?.[0]).toBeTypeOf('string');
      }
    });
  });

  describe('password', () => {
    it('should fail when password is too weak', async () => {
      const result = await signupSchemaServer.safeParseAsync({
        username: validUsername,
        password: 'meow',
      });

      expect(result.success).toBeFalsy();

      if (result.error) {
        const error = z.flattenError(result.error);

        expect(error.fieldErrors['password']?.length).toBeGreaterThan(0);
        expect(error.fieldErrors['password']?.[0]).toBeTypeOf('string');
      }
    });

    it('should fail when password contains username', async () => {
      const result = await signupSchemaServer.safeParseAsync({
        username: 'mrmeowgi',
        password: `mrmeowgi_${strongPassword}`,
      });

      expect(result.success).toBeFalsy();

      if (result.error) {
        const error = z.flattenError(result.error);

        expect(error.fieldErrors['password']?.length).toBeGreaterThan(0);
        expect(error.fieldErrors['password']?.[0]).toBe("Password shouldn't contain the username");
      }
    });
  });

  describe('username', () => {
    it('should fail when username contains profanity', async () => {
      const result = await signupSchemaServer.safeParseAsync({
        username: 'twat-waffle',
        password: strongPassword,
      });

      expect(result.success).toBeFalsy();

      if (result.error) {
        const error = z.flattenError(result.error);

        expect(error.fieldErrors['username']?.length).toBeGreaterThan(0);
        expect(error.fieldErrors['username']?.[0]).toBe('Unbecoming username');
      }
    });
  });
});
