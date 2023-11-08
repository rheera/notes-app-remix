import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
  type MetaFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
