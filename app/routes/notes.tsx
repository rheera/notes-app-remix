import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type MetaFunction,
  json,
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

export const meta: MetaFunction = () => {
  return [
    { title: "Notes Page" },
    { name: "description", content: "See all your notes and write new ones" },
  ];
};

export const links: LinksFunction = () => {
  return [...newNoteLinks(), ...noteListLinks()];
};

export const loader = async () => {
  const notes = await getStoredNotes();
  if (!notes || notes.length === 0) {
    throw json(
      { message: "Could not find any notes" },
      {
        status: 404,
        statusText: "Not Found",
      }
    );
  }
  return notes;
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
  const notes = useLoaderData<typeof loader>();

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
      <main>
        <NewNote />
        {/* <p>Status: {error.status}</p> */}
        <p className="info-message">{error.data.message}</p>
      </main>
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
