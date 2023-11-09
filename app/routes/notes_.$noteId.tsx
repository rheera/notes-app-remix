import {
  json,
  type MetaFunction,
  type LinksFunction,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { getStoredNotes } from "~/data/noteUtils";
import noteDetailStyles from "~/styles/note-details.css";
import type { Note } from "~/types/interfaces";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: noteDetailStyles,
  },
];

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data.title },
    { name: "description", content: "View your note" },
  ];
};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  // invariant(params.noteId, "Missing note param");
  const allNotes = await getStoredNotes();
  const selectedNote = allNotes.find((note: Note) => note.id === params.noteId);

  if (!selectedNote) {
    throw json(
      { message: "Could not find note for id: " + params.noteId },
      { status: 404 }
    );
  }
  return selectedNote;
};

export default function NoteDetails() {
  const loadedNote = useLoaderData<typeof loader>();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{loadedNote.title}</h1>
      </header>
      <p id="note-details-content">{loadedNote.content}</p>
    </main>
  );
}

// no need for its' own error boundary since it's so similar to the root one

export function ErrorBoundary() {
  const error = useRouteError();
  let errorContent: { message: string; status: number | null } = {
    message: "Unknown error",
    status: null,
  };

  if (isRouteErrorResponse(error)) {
    errorContent = {
      message: error.data.message || error.data,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    errorContent.message = error.message;
  }
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
      </header>
      <p id="note-details-content">{errorContent.message}</p>
      <p id="note-details-content">{errorContent.status}</p>
    </main>
  );
}
