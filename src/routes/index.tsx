import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <div className="">
      <h1>Welcome Home!</h1>
    </div>
  );
}
