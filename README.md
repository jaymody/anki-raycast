# Anki Raycast Extension

A [Raycast](https://www.raycast.com) extension for [Anki](https://apps.ankiweb.net).

## Features
- **New Anki Card**: Create and add a new Anki card.

## Installation
The Anki collection is manipulated using their [Python API](https://pypi.org/project/anki/). As such, this extension calls Python from within JavaScript. This is not ideal, and there are alternatives:

- [`anki-connect`](https://www.google.com/search?client=safari&rls=en&q=anki+connection&ie=UTF-8&oe=UTF-8) enables the manipulation of Anki via a REST API. This works by adding anki-connect as a plugin for Anki, which runs an API server as a background process within Anki. There are two problems I have with this: 1) It requires an additional step where I have to install a plugin to Anki 2) This means that Anki must be running as a background process (and as noted in the README, Mac users must also disable the _App Nap_, which I don't want to do as that feature is suppose to save my battery life).
- The Anki collection file is basically just an SQLite3 file, so we should be able to work directly with file in JS using the [`node-sqlite3`](https://github.com/TryGhost/node-sqlite3) package. However this is a project I hacked together in an evening, and this would probably take me more than one evening if I went this route.

In any case, here are the installation steps.

### Python
Install [`anki`](https://pypi.org/project/anki/) to some Python on your computer (I'm going to use `/usr/bin/python3` as an example, but you should really probably use an isolated environment for this):

```shell
/usr/bin/python3 -m pip install anki
```

### Extension
Clone this repo:

```shell
git clone https://github.com/jaymody/anki-raycast
```

Then in Raycast, use the command `Import Extension` and point it to the cloned repo.

Then, in the Raycast preferences menu, under the extensions tab, configure the command with the python path that has the anki python API installed and to your Anki collection path (this is probably something like `/Users/<USERNAME>/Library/Application Support/Anki2/User 1/collection.anki2`).

Then, to make sure things are working, try creating a new Anki card with the command `New Anki Card`.

## Development
```shell
npm install
npm run dev
```

For linting and formatting:
```shell
npm run fix-lint
```

## TODO
- [ ] Add markdown support.
- [ ] Modify the SQLite3 file directly instead of calling Python.
- [ ] Automatically get the Deck names and have them as a dropdown instead of as a User setting.
- [ ] Maybe I should just use a default for the Anki collection file location?
