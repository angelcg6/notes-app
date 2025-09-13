# 🚨 CONFIGURACIÓN URGENTE - Supabase

## ❌ **PROBLEMA IDENTIFICADO**
Los botones de iniciar sesión no funcionan porque **falta ejecutar la migración de base de datos en Supabase**.

## ✅ **SOLUCIÓN INMEDIATA**

### 1. **Ejecutar Migración SQL en Supabase**

1. Ve a tu proyecto en [Supabase](https://supabase.com)
2. Haz clic en **SQL Editor** (en el menú lateral)
3. Haz clic en **New query**
4. Copia y pega **EXACTAMENTE** este código:

```sql
-- Create notes table
CREATE TABLE IF NOT EXISTS notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);
CREATE INDEX IF NOT EXISTS notes_created_at_idx ON notes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policy for users to only see their own notes
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy for users to insert their own notes
CREATE POLICY "Users can insert their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own notes
CREATE POLICY "Users can update their own notes" ON notes
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy for users to delete their own notes
CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notes_updated_at 
    BEFORE UPDATE ON notes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

5. Haz clic en **Run** (botón verde)
6. Deberías ver "Success. No rows returned" o similar

### 2. **Configurar Autenticación**

1. Ve a **Authentication** > **Settings**
2. En **Site URL** pon: `http://localhost:3000`
3. En **Redirect URLs** agrega: `http://localhost:3000`
4. Haz clic en **Save**

### 3. **Probar la Aplicación**

1. Ve a `http://localhost:3000`
2. Haz clic en **"Registrarse"**
3. Crea una cuenta con email/password
4. Debería funcionar correctamente

## 🔍 **Verificar Errores**

Si sigues teniendo problemas:

1. Ve a `http://localhost:3000/test-connection.html`
2. Revisa qué error aparece
3. Abre las **Developer Tools** (F12) y ve a la pestaña **Console**
4. Busca errores en rojo

## 📞 **Errores Comunes**

- **"relation 'notes' does not exist"** → No ejecutaste la migración SQL
- **"Invalid API key"** → La clave de Supabase está mal
- **"Failed to fetch"** → Problema de CORS o URL incorrecta

¡Ejecuta la migración SQL y todo debería funcionar! 🚀
