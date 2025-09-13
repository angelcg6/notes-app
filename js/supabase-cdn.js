// Supabase configuration using CDN
const { createClient } = supabase;

// Supabase configuration
const supabaseUrl = 'https://bwguyandwdufasmfiumx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z3V5YW5kd2R1ZmFzbWZpdW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODEyMTYsImV4cCI6MjA3MzM1NzIxNn0.aXSYwxxY8NM6pRDnFSlASqSj7ckLoR4kXN2vbrLqBsk';

// Create Supabase client
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
const auth = {
  // Sign up with email and password
  async signUp(email, password) {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with email and password
  async signIn(email, password) {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign in with GitHub
  async signInWithGitHub() {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabaseClient.auth.signOut();
    return { error };
  },

  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabaseClient.auth.getUser();
    return user;
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabaseClient.auth.onAuthStateChange(callback);
  }
};

// Notes API functions
const notesAPI = {
  // Get all notes for current user
  async getNotes() {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get a single note by ID
  async getNote(id) {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();
    
    return { data, error };
  },

  // Create a new note
  async createNote(note) {
    const { data, error } = await supabaseClient
      .from('notes')
      .insert([note])
      .select()
      .single();
    
    return { data, error };
  },

  // Update an existing note
  async updateNote(id, updates) {
    const { data, error } = await supabaseClient
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Delete a note
  async deleteNote(id) {
    const { error } = await supabaseClient
      .from('notes')
      .delete()
      .eq('id', id);
    
    return { error };
  },

  // Search notes
  async searchNotes(query) {
    const { data, error } = await supabaseClient
      .from('notes')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order('created_at', { ascending: false });
    
    return { data, error };
  }
};

// Real-time subscription for notes
const subscribeToNotes = (callback) => {
  return supabaseClient
    .channel('notes_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'notes' 
      }, 
      callback
    )
    .subscribe();
};

// Export to global scope
window.supabase = supabaseClient;
window.auth = auth;
window.notesAPI = notesAPI;
window.subscribeToNotes = subscribeToNotes;
