import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Link,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/noteUtils";
import type { Note } from "~/types/interfaces";

export const meta: MetaFunction = () => {
  return [
    { title: "Notes App notes page" },
    { name: "description", content: "See all your notes and write new ones" },
  ];
};

export const links: LinksFunction = () => {
  return [...newNoteLinks(), ...noteListLinks()];
};

export const loader = async () => {
  return await getStoredNotes();
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const noteData = Object.fromEntries(await request.formData());
  // Add validation...
  if (
    typeof noteData.title !== "string" ||
    typeof noteData.content !== "string"
  )
    throw new Error("invalid value");
  else {
    if (noteData.title.trim().length < 5) {
      return "Invalid title - must be at least 5 characters long";
    }
    const existingNotes = await getStoredNotes();
    noteData.id = new Date().toISOString();
    const updatedNotes = existingNotes.concat(noteData);
    await storeNotes(updatedNotes);
    return redirect("/notes");
  }
};

export default function NotesPage() {
  const notes = useLoaderData() as Note[];

  return (
    <main>
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>Oops</h1>
        <p>Status: {error.status}</p>
        <p>{error.data.message}</p>
      </div>
    );
  }

  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }
  return (
    <main className="error">
      <h1>An error related to your notes occurred!</h1>
      <p>{errorMessage}</p>
      <p>
        Back to <Link to="/">Safety</Link>
      </p>
    </main>
  );
}
