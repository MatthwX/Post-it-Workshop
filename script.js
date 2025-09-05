const noteInput = document.getElementById('new-note-input');
const addButton = document.getElementById('add-note-button');
const notesContainer = document.getElementById('notes-container');
const toggleThemeButton = document.getElementById('toggle-theme-button');
const body = document.body;

const colors = ['note-yellow', 'note-blue', 'note-pink'];

/**
 * Crea un elemento DOM para una nota.
 * @param {string} text - Es el texto de la nota
 * @param {string} colorClass - Es la clase CSS que define el color de la nota
 * @return {HTMLElement} Es el elemento div de la nota creada.
 */
function createNoteElement(text, colorClass) {
    const noteDiv = document.createElement('div');
    noteDiv.classList.add('note', colorClass);
    noteDiv.textContent = text;
    
    const deleteButton = document.createElement('span');
    deleteButton.classList.add('delete-btn');
    deleteButton.textContent = 'x';
    noteDiv.appendChild(deleteButton);
    
    return noteDiv;
}

/**
 * Carga las notas guardadas en el navegador desde la última visita.
 * @summary Lee el 'localStorage' y muestra las notas en la página.
 */
function loadNotes() {
    const storedNotes = localStorage.getItem('notes');
    console.log(storedNotes);
    
    if (storedNotes) {
        const notes = JSON.parse(storedNotes);
        notes.forEach(noteData => {
            const newNote = createNoteElement(noteData.text, noteData.color);
            notesContainer.appendChild(newNote);
        });
    }
}

/**
 * Guarda todas las notas que están actualmente en la página.
 * @summary Almacena las notas en el 'localStorage' para que no se pierdan al recargar.
 */
function saveNotes() {
    const notes = [];
    document.querySelectorAll('.note').forEach(noteElement => {
        
        const noteText = noteElement.textContent.slice(0, -1);
        
        let colorClass = '';
        if (noteElement.classList.contains('note-yellow')) colorClass = 'note-yellow';
        else if (noteElement.classList.contains('note-blue')) colorClass = 'note-blue';
        else if (noteElement.classList.contains('note-pink')) colorClass = 'note-pink';
        
        notes.push({
            text: noteText,
            color: colorClass
        });
    });
    
    localStorage.setItem('notes', JSON.stringify(notes));
}

/**
 * Establece el modo oscuro si el usuario lo tenía activado.
 * @summary Lee la preferencia del 'localStorage' y aplica la clase CSS 'dark-mode'.
 */
function setInitialTheme() {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    if (isDarkMode) {
        body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Modo Claro';
    }
}

// Desactiva el botón de añadir si el campo de texto de la nota se encuentra en blanco.
noteInput.addEventListener('input', () => {
    addButton.disabled = noteInput.value.trim() === '';
});

// Cambia el tema de la página entre claro y oscuro al hacer clic en el botón.
toggleThemeButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('isDarkMode', isDarkMode);
    toggleThemeButton.textContent = isDarkMode ? 'Modo Claro' : 'Modo Oscuro';
});

// Deja editar una nota al hacer doble clic en ella.
notesContainer.addEventListener('dblclick', (event) => {
    const target = event.target;
    if (target.classList.contains('note')) {
        const currentText = target.textContent.slice(0, -1); 
        target.textContent = '';
        target.classList.add('editing');
        
        const textarea = document.createElement('textarea');
        textarea.value = currentText;
        target.appendChild(textarea);
        textarea.focus();
        
        function saveEdit() {
            const newText = textarea.value.trim();
            target.textContent = newText;
            target.classList.remove('editing');
            
            const deleteButton = document.createElement('span');
            deleteButton.classList.add('delete-btn');
            deleteButton.textContent = 'x';
            target.appendChild(deleteButton);
            
            saveNotes();
        }
        
        textarea.addEventListener('blur', saveEdit);
        textarea.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                saveEdit();
            }
        });
    }
});

// Añade una nueva nota al hacer click en el botón.
addButton.addEventListener('click', () => {
    const noteText = noteInput.value.trim();
    if (noteText !== '') {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const newNote = createNoteElement(noteText, randomColor);
        notesContainer.appendChild(newNote);
        
        noteInput.value = '';
        addButton.disabled = true;
        saveNotes();
    }
});

// Elimina una nota al hacer clic en el botón de X
notesContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        event.target.parentElement.remove();
        saveNotes();
    }
});

// Al cargar la página, establece el tema y carga las notas guardadas.
setInitialTheme();
loadNotes();