import { json } from '@tanstack/react-start';
import { createFileRoute } from '@tanstack/react-router';
import type { User } from '../../utils/users';

// Must be called Route to be picked up by the route tree generator
export const Route = createFileRoute('/api/users')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        console.info('Fetching users... @', request.url);
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = (await res.json()) as User[];

        const list = data.slice(0, 10);

        return json(list.map((u) => ({ id: u.id, name: u.name, email: u.email })));
      },
    },
  },
});
