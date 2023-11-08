import type { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import noteDetailStyles from "~/styles/note-details.css";

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: noteDetailStyles,
  },
];

export default function NoteDetails() {
  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>Note Title</h1>
      </header>
      <p id="note-details-content">Note Content</p>
    </main>
  );
}
