// Configuration file for development and production environments
const config = {
  development: {
    supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with your Supabase URL
    supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your Supabase anon key
    environment: 'development'
  },
  production: {
    supabaseUrl: 'YOUR_SUPABASE_URL', // Replace with your production Supabase URL
    supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY', // Replace with your production Supabase anon key
    environment: 'production'
  }
};

// Get current environment
const currentEnv = window.location.hostname === 'localhost' ? 'development' : 'production';

// Export current configuration
export default config[currentEnv];
