#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const NOTES_FILE = path.join(__dirname, 'notes.json');

function loadNotes() {
  if (!fs.existsSync(NOTES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function saveNotes(notes) {
  fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
}

function add(title, content) {
  if (!title || !content) {
    console.error('Usage: notes add <title> <content>');
    process.exit(1);
  }
  const notes = loadNotes();
  if (notes.find(n => n.title === title)) {
    console.error(`A note titled "${title}" already exists.`);
    process.exit(1);
  }
  notes.push({ title, content, created: new Date().toISOString() });
  saveNotes(notes);
  console.log(`Added: "${title}"`);
}

function list() {
  const notes = loadNotes();
  if (notes.length === 0) {
    console.log('No notes yet.');
    return;
  }
  notes.forEach((n, i) => {
    console.log(`\n[${i + 1}] ${n.title}`);
    console.log(`    ${n.content}`);
    console.log(`    Created: ${new Date(n.created).toLocaleString()}`);
  });
}

function search(keyword) {
  if (!keyword) {
    console.error('Usage: notes search <keyword>');
    process.exit(1);
  }
  const lower = keyword.toLowerCase();
  const matches = loadNotes().filter(
    n => n.title.toLowerCase().includes(lower) || n.content.toLowerCase().includes(lower)
  );
  if (matches.length === 0) {
    console.log(`No notes matching "${keyword}".`);
    return;
  }
  matches.forEach((n, i) => {
    console.log(`\n[${i + 1}] ${n.title}`);
    console.log(`    ${n.content}`);
    console.log(`    Created: ${new Date(n.created).toLocaleString()}`);
  });
}

function del(title) {
  if (!title) {
    console.error('Usage: notes delete <title>');
    process.exit(1);
  }
  const notes = loadNotes();
  const index = notes.findIndex(n => n.title === title);
  if (index === -1) {
    console.error(`No note found with title "${title}".`);
    process.exit(1);
  }
  notes.splice(index, 1);
  saveNotes(notes);
  console.log(`Deleted: "${title}"`);
}

function help() {
  console.log(`
Usage: node notes.js <command> [args]

Commands:
  add <title> <content>   Add a new note
  list                    List all notes
  search <keyword>        Search notes by keyword
  delete <title>          Delete a note by title
  help                    Show this help message
`);
}

const [,, command, ...rest] = process.argv;

switch (command) {
  case 'add':    add(rest[0], rest.slice(1).join(' ')); break;
  case 'list':   list(); break;
  case 'search': search(rest.join(' ')); break;
  case 'delete': del(rest.join(' ')); break;
  case 'help':   help(); break;
  default:
    console.error(`Unknown command: "${command || ''}"`);
    help();
    process.exit(1);
}
