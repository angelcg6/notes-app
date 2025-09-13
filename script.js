// Import Supabase modules
import { supabase, auth, notesAPI, subscribeToNotes } from './js/supabase.js';

// Notes App JavaScript with Supabase integration
class NotesApp {
    constructor() {
        this.notes = [];
        this.editingId = null;
        this.currentUser = null;
        this.isAuthenticated = false;
        this.init();
    }

    async init() {
        // Check authentication status
        await this.checkAuth();
        
        // Bind events
        this.bindEvents();
        
        // Load notes if authenticated
        if (this.isAuthenticated) {
            await this.loadNotes();
            this.renderNotes();
            this.updateEmptyState();
        }
    }

    async checkAuth() {
        try {
            const user = await auth.getCurrentUser();
            if (user) {
                this.currentUser = user;
                this.isAuthenticated = true;
                this.updateAuthUI();
            } else {
                this.isAuthenticated = false;
                this.updateAuthUI();
            }
        } catch (error) {
            console.error('Error checking auth:', error);
            this.isAuthenticated = false;
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const userInfo = document.getElementById('userInfo');
        const authButtons = document.getElementById('authButtons');
        const userEmail = document.getElementById('userEmail');
        const addNoteSection = document.querySelector('.add-note-section');
        const notesSection = document.querySelector('.notes-section');

        if (this.isAuthenticated) {
            userInfo.classList.remove('hidden');
            authButtons.classList.add('hidden');
            userEmail.textContent = this.currentUser.email;
            addNoteSection.style.display = 'block';
            notesSection.style.display = 'block';
        } else {
            userInfo.classList.add('hidden');
            authButtons.classList.remove('hidden');
            addNoteSection.style.display = 'none';
            notesSection.style.display = 'none';
        }
    }

    bindEvents() {
        // Auth events
        document.getElementById('signInBtn').addEventListener('click', () => {
            this.showAuthModal('signin');
        });

        document.getElementById('signUpBtn').addEventListener('click', () => {
            this.showAuthModal('signup');
        });

        document.getElementById('signOutBtn').addEventListener('click', () => {
            this.signOut();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideAuthModal();
        });

        document.getElementById('authForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleAuthForm();
        });

        document.getElementById('githubAuth').addEventListener('click', () => {
            this.signInWithGitHub();
        });

        document.getElementById('googleAuth').addEventListener('click', () => {
            this.signInWithGoogle();
        });

        // Note events
        document.getElementById('saveNote').addEventListener('click', () => {
            this.saveNote();
        });

        document.getElementById('clearForm').addEventListener('click', () => {
            this.clearForm();
        });

        document.getElementById('searchNotes').addEventListener('input', (e) => {
            this.searchNotes(e.target.value);
        });

        document.getElementById('exportNotes').addEventListener('click', () => {
            this.exportNotes();
        });

        document.getElementById('importBtn').addEventListener('click', () => {
            document.getElementById('importNotes').click();
        });

        document.getElementById('importNotes').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.importNotes(e.target.files[0]);
            }
        });

        // Keyboard shortcuts
        document.getElementById('noteContent').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.ctrlKey) {
                this.saveNote();
            }
        });

        // Listen to auth state changes
        auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
                this.currentUser = session.user;
                this.isAuthenticated = true;
                this.updateAuthUI();
                this.loadNotes().then(() => {
                    this.renderNotes();
                    this.updateEmptyState();
                });
            } else if (event === 'SIGNED_OUT') {
                this.currentUser = null;
                this.isAuthenticated = false;
                this.notes = [];
                this.updateAuthUI();
                this.renderNotes();
                this.updateEmptyState();
            }
        });

        // Listen to real-time changes
        if (this.isAuthenticated) {
            subscribeToNotes((payload) => {
                console.log('Real-time update:', payload);
                this.loadNotes().then(() => {
                    this.renderNotes();
                    this.updateEmptyState();
                });
            });
        }
    }

    showAuthModal(mode) {
        const modal = document.getElementById('authModal');
        const modalTitle = document.getElementById('modalTitle');
        const submitAuth = document.getElementById('submitAuth');
        
        modal.classList.remove('hidden');
        
        if (mode === 'signin') {
            modalTitle.textContent = 'Iniciar Sesión';
            submitAuth.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
        } else {
            modalTitle.textContent = 'Registrarse';
            submitAuth.innerHTML = '<i class="fas fa-user-plus"></i> Registrarse';
        }
        
        this.authMode = mode;
    }

    hideAuthModal() {
        const modal = document.getElementById('authModal');
        modal.classList.add('hidden');
        document.getElementById('authForm').reset();
    }

    async handleAuthForm() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            if (this.authMode === 'signin') {
                const { data, error } = await auth.signIn(email, password);
                if (error) throw error;
                this.showNotification('Sesión iniciada correctamente', 'success');
            } else {
                const { data, error } = await auth.signUp(email, password);
                if (error) throw error;
                this.showNotification('Cuenta creada correctamente. Revisa tu email para confirmar.', 'success');
            }
            this.hideAuthModal();
        } catch (error) {
            console.error('Auth error:', error);
            this.showNotification(error.message || 'Error en la autenticación', 'error');
        }
    }

    async signInWithGitHub() {
        try {
            const { data, error } = await auth.signInWithGitHub();
            if (error) throw error;
            this.hideAuthModal();
        } catch (error) {
            console.error('GitHub auth error:', error);
            this.showNotification('Error al iniciar sesión con GitHub', 'error');
        }
    }

    async signInWithGoogle() {
        try {
            const { data, error } = await auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
            this.hideAuthModal();
        } catch (error) {
            console.error('Google auth error:', error);
            this.showNotification('Error al iniciar sesión con Google', 'error');
        }
    }

    async signOut() {
        try {
            const { error } = await auth.signOut();
            if (error) throw error;
            this.showNotification('Sesión cerrada correctamente', 'info');
        } catch (error) {
            console.error('Sign out error:', error);
            this.showNotification('Error al cerrar sesión', 'error');
        }
    }

    async loadNotes() {
        if (!this.isAuthenticated) {
            this.notes = [];
            return;
        }

        try {
            const { data, error } = await notesAPI.getNotes();
            if (error) throw error;
            this.notes = data || [];
        } catch (error) {
            console.error('Error loading notes:', error);
            this.showNotification('Error al cargar las notas', 'error');
            this.notes = [];
        }
    }

    async saveNote() {
        if (!this.isAuthenticated) {
            this.showNotification('Debes iniciar sesión para guardar notas', 'warning');
            return;
        }

        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();

        if (!title && !content) {
            this.showNotification('Por favor, escribe al menos un título o contenido', 'warning');
            return;
        }

        const noteData = {
            title: title || 'Sin título',
            content: content || 'Sin contenido',
            user_id: this.currentUser.id
        };

        try {
            if (this.editingId) {
                // Update existing note
                const { data, error } = await notesAPI.updateNote(this.editingId, noteData);
                if (error) throw error;
                this.showNotification('Nota actualizada correctamente', 'success');
                this.editingId = null;
            } else {
                // Create new note
                const { data, error } = await notesAPI.createNote(noteData);
                if (error) throw error;
                this.showNotification('Nota guardada correctamente', 'success');
            }

            await this.loadNotes();
            this.renderNotes();
            this.clearForm();
            this.updateEmptyState();
        } catch (error) {
            console.error('Error saving note:', error);
            this.showNotification('Error al guardar la nota', 'error');
        }
    }

    async editNote(id) {
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

    async deleteNote(id) {
        if (!this.isAuthenticated) {
            this.showNotification('Debes iniciar sesión para eliminar notas', 'warning');
            return;
        }

        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            try {
                const { error } = await notesAPI.deleteNote(id);
                if (error) throw error;
                
                await this.loadNotes();
                this.renderNotes();
                this.updateEmptyState();
                this.showNotification('Nota eliminada correctamente', 'info');
            } catch (error) {
                console.error('Error deleting note:', error);
                this.showNotification('Error al eliminar la nota', 'error');
            }
        }
    }

    clearForm() {
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        this.editingId = null;
        document.getElementById('noteTitle').focus();
    }

    async searchNotes(query) {
        if (!this.isAuthenticated) return;

        try {
            if (query.trim() === '') {
                await this.loadNotes();
            } else {
                const { data, error } = await notesAPI.searchNotes(query);
                if (error) throw error;
                this.notes = data || [];
            }
            this.renderNotes();
        } catch (error) {
            console.error('Error searching notes:', error);
            this.showNotification('Error al buscar notas', 'error');
        }
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
                    <span>Creada: ${this.formatDate(note.created_at)}</span>
                    ${note.updated_at !== note.created_at ? 
                        `<span>Actualizada: ${this.formatDate(note.updated_at)}</span>` : 
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
        
        if (!this.isAuthenticated) {
            emptyState.innerHTML = `
                <i class="fas fa-lock"></i>
                <h3>Inicia sesión</h3>
                <p>Necesitas iniciar sesión para ver tus notas</p>
            `;
            emptyState.classList.remove('hidden');
            notesContainer.classList.add('hidden');
        } else if (this.notes.length === 0) {
            emptyState.innerHTML = `
                <i class="fas fa-edit"></i>
                <h3>No hay notas</h3>
                <p>Comienza escribiendo tu primera nota</p>
            `;
            emptyState.classList.remove('hidden');
            notesContainer.classList.add('hidden');
        } else {
            emptyState.classList.add('hidden');
            notesContainer.classList.remove('hidden');
        }
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
        if (!this.isAuthenticated) {
            this.showNotification('Debes iniciar sesión para exportar notas', 'warning');
            return;
        }

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
        if (!this.isAuthenticated) {
            this.showNotification('Debes iniciar sesión para importar notas', 'warning');
            return;
        }

        if (!file.name.endsWith('.json')) {
            this.showNotification('Por favor selecciona un archivo JSON válido', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
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

                    try {
                        if (action) {
                            // Delete all existing notes
                            for (const note of this.notes) {
                                await notesAPI.deleteNote(note.id);
                            }
                        }

                        // Import notes
                        for (const note of validNotes) {
                            await notesAPI.createNote({
                                title: note.title,
                                content: note.content,
                                user_id: this.currentUser.id
                            });
                        }

                        await this.loadNotes();
                        this.renderNotes();
                        this.updateEmptyState();
                        this.showNotification(`${validNotes.length} notas importadas correctamente`, 'success');
                    } catch (error) {
                        console.error('Error importing notes:', error);
                        this.showNotification('Error al importar las notas', 'error');
                    }
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
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+S to save
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        if (window.app && window.app.isAuthenticated) {
            window.app.saveNote();
        }
    }
    
    // Escape to clear form or close modal
    if (e.key === 'Escape') {
        if (window.app) {
            const modal = document.getElementById('authModal');
            if (!modal.classList.contains('hidden')) {
                window.app.hideAuthModal();
            } else {
                window.app.clearForm();
            }
        }
    }
    
    // Ctrl+F to focus search
    if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        if (window.app && window.app.isAuthenticated) {
            document.getElementById('searchNotes').focus();
        }
    }
});