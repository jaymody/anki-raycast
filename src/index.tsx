import { Form, ActionPanel, Action, getPreferenceValues, showHUD } from "@raycast/api";
import { spawn } from "child_process";

const pythonCode = `
import sys
from anki.storage import Collection

_, collection_path, deck_name, front, back = sys.argv

col = Collection(collection_path)

modelBasic = col.models.by_name("Basic")

deck = col.decks.by_name(deck_name)
col.decks.select(deck["id"])
col.decks.current()["mid"] = modelBasic["id"]

note = col.newNote()
note.fields[0] = front
note.fields[1] = back
col.add_note(note, deck["id"])

col.save()
`;

type Values = {
  front: string;
  back: string;
};

interface Preferences {
  pythonPath: string;
  collectionPath: string;
  deckName: string;
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();

  function handleSubmit(values: Values) {
    const python = spawn(
      preferences.pythonPath,
      ["-c", pythonCode, preferences.collectionPath, preferences.deckName, values.front, values.back],
      // The Anki python code tries to append to the path with +=, so if the
      // path doesn't exist, we get a key error, so to avoid this, we set the
      // path explicitly here to an empty string, hopefully this doesn't break
      // anything ...
      { env: { PATH: "" } }
    );
    python.on("exit", function (code: number) {
      if (code) {
        showHUD("❌ Note creation failed!");
        python.stdout.on("data", function (data: Buffer) {
          console.log(data.toString());
        });
        python.stderr.on("data", function (data: Buffer) {
          const err = data.toString();
          if (err.includes("anki.errors.DBError: Anki already open, or media currently syncing.")) {
            showHUD("❌ Anki is already open, or media currently sinking.");
          }
          console.log(data.toString());
        });
      } else {
        showHUD("✅ Note created successfully!");
      }
    });
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextArea id="front" title="Front Text" placeholder="Why did the chicken cross the road?" />
      <Form.TextArea id="back" title="Back Text" placeholder="To get to the other side." />
    </Form>
  );
}
