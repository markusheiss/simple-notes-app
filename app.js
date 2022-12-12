'use strict';

// html elements
const notesList = document.querySelector('#notes-list');
const notesBody = document.querySelector('.notes-body');
const btnSaveNote = document.querySelector('#btn-save-note');
const btnSaveNewNote = document.querySelector('#btn-save-new-note');
const btnDeleteNote = document.querySelector('#btn-delete-note');
const btnEditNote = document.querySelector('#btn-edit-note');
const btnNewNote = document.querySelector('#btn-new-note');
const editBody = document.querySelector('#edit-body');
const editTitle = document.querySelector('#edit-title');
const editSection = document.querySelector('.notes-edit');

// create a uid for a note
const createUid = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// save and load notes array from local storage
const saveNotesToLocalStorage = (notes) => {
    localStorage.setItem('notes', JSON.stringify(notes));
};

const loadNotesFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('notes'));
};

const createNote = (id, title, body) => {
    return {
        id,
        title,
        body,
    };
};

const getNoteObject = (id) => {
    return notes.filter((note) => note.id === id)[0];
};

const getNoteIndex = (id) => {
    return notes.indexOf(getNoteObject(id));
};

const showNoteBody = (noteId) => {
    if (noteId != null) notesBody.innerHTML = getNoteObject(noteId).body;
};

// creates a list item for insertion into notes list
const createNoteListItem = (note) => {
    const el = document.createElement('a');
    el.innerHTML = note.title;
    el.classList.add('list-item');
    el.setAttribute('data-id', note.id);
    el.setAttribute('onclick', 'handleListClick(this)');
    return el;
};

// adds a list item for every note to the notes list
const renderNotesList = (notes) => {
    notesList.innerHTML = '';
    notes.forEach((note) => {
        const el = createNoteListItem(note);
        notesList.insertAdjacentElement('beforeend', el);
    });
};

// highlight selected note
const handleActiveElement = (el) => {
    if (el) {
        for (let i = 0; i < notesList.children.length; i++) {
            notesList.children[i].classList.remove('active');
        }
        el.classList.add('active');
    } else {
        for (let i = 0; i < notesList.children.length; i++) {
            notesList.children[i].classList.remove('active');
        }
    }
};

// handles each elements visibility at the current state
const handleVisibility = (arr) => {
    const elements = [
        editSection,
        notesBody,
        btnEditNote,
        btnSaveNote,
        btnSaveNewNote,
        btnDeleteNote,
    ];
    for (let i = 0; i < elements.length; i++) {
        if (arr[i]) {
            elements[i].classList.add('hidden');
        } else {
            elements[i].classList.remove('hidden');
        }
    }
};

// helper function
const handleNoteModification = () => {
    renderNotesList(notes);
    showNoteBody(currentNoteId);
    saveNotesToLocalStorage(notes);
};

// EVENT LISTENERS FOR EACH BUTTON
const editNote = () => {
    const note = getNoteObject(currentNoteId);
    editBody.value = note.body;
    editTitle.value = note.title;
    handleVisibility([0, 1, 1, 0, 1, 0]);
};

const saveNote = () => {
    const note = getNoteObject(currentNoteId);
    note.body = editBody.value;
    note.title = editTitle.value;
    if (editBody.value !== '' && editTitle.value !== '') {
        handleNoteModification();
        handleVisibility([1, 0, 0, 1, 1, 1]);
    }
};

const deleteNote = () => {
    if (confirm('Do you really want to delete the note?')) {
        notes.splice(getNoteIndex(currentNoteId), 1);
        currentNoteId = null;
        handleNoteModification();
        handleVisibility([1, 1, 1, 1, 1, 1]);
    }
};

const saveNewNote = () => {
    if (editBody.value !== '' && editTitle.value !== '') {
        currentNoteId = createUid();
        const newNote = createNote(
            currentNoteId,
            editTitle.value,
            editBody.value
        );
        notes.push(newNote);
        handleNoteModification();
        handleVisibility([1, 0, 0, 1, 1, 1]);
    }
};

const createNewNote = () => {
    editBody.value = '';
    editTitle.value = '';
    handleActiveElement();
    handleVisibility([0, 1, 1, 1, 0, 1]);
};

const handleListClick = (el) => {
    currentNoteId = el.getAttribute('data-id');
    showNoteBody(currentNoteId);
    handleActiveElement(el);
    handleVisibility([1, 0, 0, 1, 1, 1]);
};

btnEditNote.addEventListener('click', editNote);
btnSaveNote.addEventListener('click', saveNote);
btnSaveNewNote.addEventListener('click', saveNewNote);
btnDeleteNote.addEventListener('click', deleteNote);
btnNewNote.addEventListener('click', createNewNote);

// APP
let notes = loadNotesFromLocalStorage() || [];
let currentNoteId = null;
renderNotesList(notes);
