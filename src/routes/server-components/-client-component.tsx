import { use } from 'react';

export function ClientComponent({ promise }: { promise: Promise<unknown> }) {
  const payload = use(promise);

  return <>{payload}</>;
}
