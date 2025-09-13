// Notes App JavaScript
class NotesApp {
    constructor() {
        this.notes = this.loadNotes();
        this.editingId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderNotes();
        this.updateEmptyState();
    }

    bindEvents() {
        // Save note button
        document.getElementById('saveNote').addEventListener('click', () => {
            this.saveNote();
        });

        // Clear form button
        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        // Search functionality
        document.getElementById('searchNotes').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        // Export notes
        document.getElementById('exportNotes').addEventListener('click', () => {
            this.exportNotes();
        });

        // Import notes
        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importNotes').click();
        });

        document.getElementById('importNotes').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importNotes(e.target.files[0]);
            }
        });

        // Save on Enter key (Ctrl+Enter for new line)
        document.getElementById('noteContent').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.saveNote();
            }
        });

        // Auto-save functionality (optional)
        document.getElementById('noteTitle').addEventListener('input', () => {
            this.autoSave();
        });

        document.getElementById('noteContent').addEventListener('input', () => {
            this.autoSave();
        });
    }

    saveNote() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title && !content) {
            this.showNotification('Por favor, escribe al menos un título o contenido', 'warning');
            return;
        }

        const note = {
            id: this.editingId || Date.now().toString(),
            title: title || 'Sin título',
            content: content || 'Sin contenido',
            createdAt: this.editingId ? this.notes.find(n => n.id === this.editingId)?.createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        if (this.editingId) {
            // Update existing note
            const index = this.notes.findIndex(n => n.id === this.editingId);
            if (index !== -1) {
                this.notes[index] = note;
                this.showNotification('Nota actualizada correctamente', 'success');
            }
            this.editingId = null;
        } else {
            // Add new note
            this.notes.unshift(note);
            this.showNotification('Nota guardada correctamente', 'success');
        }

        this.saveNotes();
        this.renderNotes();
        this.clearForm();
        this.updateEmptyState();
    }

    editNote(id) {
        const note = this.notes.find(n => n.id === id);
        if (note) {
            document.getElementById('noteTitle').value = note.title;
            document.getElementById('noteContent').value = note.content;
            this.editingId = id;
            
            // Scroll to form
            document.querySelector('.add-note-section').scrollIntoView({ 
                behavior: 'smooth' 
            });
            
            // Focus on title
            document.getElementById('noteTitle').focus();
        }
    }

    deleteNote(id) {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            this.notes = this.notes.filter(n => n.id !== id);
            this.saveNotes();
            this.renderNotes();
            this.updateEmptyState();
            this.showNotification('Nota eliminada correctamente', 'info');
        }
    }

    clearForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        this.editingId = null;
        document.getElementById('noteTitle').focus();
    }

    searchNotes(query) {
        const filteredNotes = this.notes.filter(note => 
            note.title.toLowerCase().includes(query.toLowerCase()) ||
            note.content.toLowerCase().includes(query.toLowerCase())
        );
        this.renderNotes(filteredNotes);
    }

    renderNotes(notesToRender = null) {
        const notes = notesToRender || this.notes;
        const container = document.getElementById('notesContainer');
        
        if (notes.length === 0) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = notes.map(note => `
            <div class="note-card ${this.editingId === note.id ? 'editing' : ''}" data-id="${note.id}">
                <div class="note-title">${this.escapeHtml(note.title)}</div>
                <div class="note-content">${this.escapeHtml(note.content)}</div>
                <div class="note-meta">
                    <span>Creada: ${this.formatDate(note.createdAt)}</span>
                    ${note.updatedAt !== note.createdAt ? 
                        `<span>Actualizada: ${this.formatDate(note.updatedAt)}</span>` : 
                        ''
                    }
                </div>
                <div class="note-actions">
                    <button class="btn-small btn-edit" onclick="app.editNote('${note.id}')">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn-small btn-delete" onclick="app.deleteNote('${note.id}')">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    updateEmptyState() {
        const emptyState = document.getElementById('emptyState');
        const notesContainer = document.getElementById('notesContainer');
        
        if (this.notes.length === 0) {
            emptyState.classList.remove('hidden');
            notesContainer.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            notesContainer.classList.remove('hidden');
        }
    }

    loadNotes() {
        try {
            const saved = localStorage.getItem('notesApp');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading notes:', error);
            return [];
        }
    }

    saveNotes() {
        try {
            localStorage.setItem('notesApp', JSON.stringify(this.notes));
        } catch (error) {
            console.error('Error saving notes:', error);
            this.showNotification('Error al guardar las notas', 'error');
        }
    }

    autoSave() {
        // Auto-save draft every 30 seconds
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            const title = document.getElementById('noteTitle').value;
            const content = document.getElementById('noteContent').value;
            
            if (title || content) {
                localStorage.setItem('notesAppDraft', JSON.stringify({ title, content }));
            }
        }, 30000);
    }

    loadDraft() {
        try {
            const draft = localStorage.getItem('notesAppDraft');
            if (draft) {
                const { title, content } = JSON.parse(draft);
                document.getElementById('noteTitle').value = title || '';
                document.getElementById('noteContent').value = content || '';
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
    }

    clearDraft() {
        localStorage.removeItem('notesAppDraft');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return 'Hoy';
        } else if (diffDays === 2) {
            return 'Ayer';
        } else if (diffDays <= 7) {
            return `Hace ${diffDays - 1} días`;
        } else {
            return date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${this.getNotificationIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideInRight 0.3s ease-out;
        `;

        // Add animation keyframes
        if (!document.getElementById('notification-styles')) {
            const style = document.createElement('style');
            style.id = 'notification-styles';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        return colors[type] || '#17a2b8';
    }

    // Export notes functionality
    exportNotes() {
        if (this.notes.length === 0) {
            this.showNotification('No hay notas para exportar', 'warning');
            return;
        }

        const dataStr = JSON.stringify(this.notes, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `notas-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
        this.showNotification('Notas exportadas correctamente', 'success');
    }

    // Import notes functionality
    importNotes(file) {
        if (!file.name.endsWith('.json')) {
            this.showNotification('Por favor selecciona un archivo JSON válido', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedNotes = JSON.parse(e.target.result);
                if (Array.isArray(importedNotes)) {
                    // Validar que las notas tengan la estructura correcta
                    const validNotes = importedNotes.filter(note => 
                        note && typeof note === 'object' && 
                        (note.title || note.content)
                    );
                    
                    if (validNotes.length === 0) {
                        this.showNotification('El archivo no contiene notas válidas', 'error');
                        return;
                    }

                    // Preguntar si reemplazar o agregar
                    const action = confirm(
                        `Se encontraron ${validNotes.length} notas.\n\n` +
                        '¿Quieres reemplazar todas las notas actuales?\n' +
                        'Clic en "Aceptar" para reemplazar, "Cancelar" para agregar.'
                    );

                    if (action) {
                        this.notes = validNotes;
                    } else {
                        this.notes = [...this.notes, ...validNotes];
                    }

                    this.saveNotes();
                    this.renderNotes();
                    this.updateEmptyState();
                    this.showNotification(`${validNotes.length} notas importadas correctamente`, 'success');
                } else {
                    throw new Error('Formato de archivo inválido');
                }
            } catch (error) {
                console.error('Error importing notes:', error);
                this.showNotification('Error al importar las notas. Verifica que el archivo sea válido.', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new NotesApp();
    
    // Load draft on page load
    app.loadDraft();
    
    // Clear draft when saving
    document.getElementById('saveNote').addEventListener('click', () => {
        app.clearDraft();
    });
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        app.saveNote();
    }
    
    // Escape to clear form
    if (e.key === 'Escape') {
        app.clearForm();
    }
    
    // Ctrl+F to focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        document.getElementById('searchNotes').focus();
    }
});
