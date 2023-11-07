import {
  redirect,
  type ActionFunctionArgs,
  type LinksFunction,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/noteUtils";
import type { Note } from "~/types/interfaces";

export const links: LinksFunction = () => {
  return [...newNoteLinks(), ...noteListLinks()];
};

export const loader = async () => {
  return await getStoredNotes();
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  // Add validation...
  const existingNotes = await getStoredNotes();
  noteData.id = new Date().toISOString();
  const updatedNotes = existingNotes.concat(noteData);
  await storeNotes(updatedNotes);
  return redirect("/notes");
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
