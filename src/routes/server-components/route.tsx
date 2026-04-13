import { createFileRoute } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { renderToReadableStream, createFromReadableStream } from '@tanstack/react-start/rsc';
import { Suspense, useRef, type ReactNode } from 'react';
import { Refractor, registerLanguage } from 'react-refractor';
import js from 'refractor/javascript';
import 'prismjs/themes/prism-tomorrow.css';

import { ClientComponent } from './-client-component';
import { sourceCode } from './-static';

registerLanguage(js);

const SourceCode = () => {
  return <Refractor language="js" value={sourceCode} />;
};

const getPrettifiedSourceCode = createServerFn().handler(() => {
  return renderToReadableStream(<SourceCode />);
});

export const Route = createFileRoute('/server-components')({
  ssr: 'data-only',
  component: ServerComponentsPage,
});

function ServerComponentsPage() {
  const sourceCodeStream = useRef<Promise<ReactNode> | null>(null);

  // todo: fix compiler
  if (sourceCodeStream.current === null) {
    sourceCodeStream.current = getPrettifiedSourceCode().then((readableStream) =>
      createFromReadableStream(readableStream),
    );
  }

  return (
    <>
      <h1 className="mb-medium text-2xl">Server components</h1>
      <h2 className="mb-normal">Basic stuff</h2>
      <Suspense fallback={<p>Loading stuff</p>}>
        <ClientComponent promise={sourceCodeStream.current} />
      </Suspense>
    </>
  );
}
