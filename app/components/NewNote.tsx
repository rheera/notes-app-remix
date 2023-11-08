import type { LinksFunction } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import styles from "~/styles/new-note.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

function NewNote() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const actionData = useActionData();
  const errorMessage = typeof actionData === "string" ? actionData : null;

  return (
    <Form method="post" id="note-form">
      {errorMessage && <p>{errorMessage}</p>}
      <p>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" required />
      </p>
      <p>
        <label htmlFor="content">Content</label>
        <textarea id="content" name="content" rows={5} required />
      </p>
      <div className="form-actions">
        <button disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Note"}
        </button>
      </div>
    </Form>
  );
}

export default NewNote;
