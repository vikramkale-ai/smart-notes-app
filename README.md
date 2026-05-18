### Project-003 — Smart Notes App ###

Here's a summary of what it does:

Commands:
  node notes.js add "Title" "Content goes here"    # Add a note
  node notes.js list                               # List all notes
  node notes.js search keyword                     # Search titles + content
  node notes.js delete "Title"                     # Delete by exact title
  node notes.js help                               # Show usage

Key details:
  - Notes are stored in notes.json (auto-created on first use, same directory as the script)
  - Duplicate titles are rejected
  - add treats the first argument as the title and everything after as the content, so multi-word content works without extra quoting
  - search matches against both title and content, case-insensitive 
  - Each note stores a created timestamp and displays it in local time
