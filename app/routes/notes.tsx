import type { LinksFunction } from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";

export const links: LinksFunction = () => {
  return [...newNoteLinks()];
};

export default function NotesPage() {
  return (
    <main>
      <NewNote />
    </main>
  );
}
