import type { LinksFunction } from "@remix-run/node";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import mainStyles from "~/styles/main.css";
import MainNavigation from "./components/MainNavigation";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: mainStyles },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  let errorContent: { message: string; status: number | null } = {
    message: "Unknown error",
    status: null,
  };

  if (isRouteErrorResponse(error)) {
    errorContent = {
      message: error.data?.message,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    errorContent.message = error.message;
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <title>An error occurred!</title>
      </head>
      <body>
        <header>
          <MainNavigation />
        </header>
        <main className="error">
          <h1>An error occurred</h1>
          {errorContent.status && <p>{errorContent.status}</p>}
          <p>{errorContent.message}</p>
          <p>
            Back to <Link to="/">Safety</Link>
          </p>
        </main>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
