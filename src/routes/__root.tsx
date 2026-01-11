import type { PropsWithChildren } from 'react';
import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  Outlet,
  Link,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';

import { DefaultCatchBoundary } from '../components/DefaultCatchBoundary';
import { NotFound } from '../components/NotFound';

import appCss from '../styles.css?url';

export const Route = createRootRouteWithContext()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start | Type-Safe, Client-First, Full-Stack React Framework',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  shellComponent: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: PropsWithChildren) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <nav className="mb-large border-foreground p-normal gap-normal flex flex-wrap border-b text-lg">
          <Link
            to="/"
            className="focus-visible:outline-highlight hover:underline focus-visible:underline focus-visible:outline-offset-4"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Home
          </Link>
          <Link
            to="/client-side-form-submit"
            className="focus-visible:outline-highlight hover:underline focus-visible:underline focus-visible:outline-offset-4"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Client side form with uncontrolled components
          </Link>
          <Link
            to="/activity-test"
            className="focus-visible:outline-highlight hover:underline focus-visible:underline focus-visible:outline-offset-4"
            activeProps={{
              className: 'font-bold',
            }}
            activeOptions={{ exact: true }}
          >
            Activity component
          </Link>
        </nav>
        <main className="mx-normal">{children}</main>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
