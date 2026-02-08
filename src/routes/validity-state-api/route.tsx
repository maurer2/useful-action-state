import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/activity-test')({
  component: ValiditStateAPI,
});

function ValiditStateAPI() {
  const [field, setField] = useState('');

  return (
    <>
      <h1 className="mb-medium text-2xl">ValiditStateAPI</h1>
    </>
  );
}
