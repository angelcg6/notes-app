// Configuration file for development and production environments
const config = {
  development: {
    supabaseUrl: 'https://bwguyandwdufasmfiumx.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z3V5YW5kd2R1ZmFzbWZpdW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODEyMTYsImV4cCI6MjA3MzM1NzIxNn0.aXSYwxxY8NM6pRDnFSlASqSj7ckLoR4kXN2vbrLqBsk',
    environment: 'development'
  },
  production: {
    supabaseUrl: 'https://bwguyandwdufasmfiumx.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3Z3V5YW5kd2R1ZmFzbWZpdW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3ODEyMTYsImV4cCI6MjA3MzM1NzIxNn0.aXSYwxxY8NM6pRDnFSlASqSj7ckLoR4kXN2vbrLqBsk',
    environment: 'production'
  }
};

// Get current environment
const currentEnv = window.location.hostname === 'localhost' ? 'development' : 'production';

// Export current configuration
export default config[currentEnv];