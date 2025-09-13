// Debug script para identificar problemas
console.log('🔍 Iniciando debug...');

// Verificar que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM cargado');
    
    // Verificar elementos
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const authModal = document.getElementById('authModal');
    
    console.log('signInBtn:', signInBtn);
    console.log('signUpBtn:', signUpBtn);
    console.log('authModal:', authModal);
    
    if (signInBtn) {
        console.log('✅ Botón Iniciar Sesión encontrado');
        signInBtn.addEventListener('click', () => {
            console.log('🖱️ Clic en Iniciar Sesión');
            if (authModal) {
                console.log('✅ Modal encontrado, removiendo clase hidden');
                authModal.classList.remove('hidden');
                console.log('Modal classes:', authModal.className);
            } else {
                console.log('❌ Modal no encontrado');
            }
        });
    } else {
        console.log('❌ Botón Iniciar Sesión NO encontrado');
    }
    
    if (signUpBtn) {
        console.log('✅ Botón Registrarse encontrado');
        signUpBtn.addEventListener('click', () => {
            console.log('🖱️ Clic en Registrarse');
            if (authModal) {
                console.log('✅ Modal encontrado, removiendo clase hidden');
                authModal.classList.remove('hidden');
                console.log('Modal classes:', authModal.className);
            } else {
                console.log('❌ Modal no encontrado');
            }
        });
    } else {
        console.log('❌ Botón Registrarse NO encontrado');
    }
    
    // Verificar modal
    if (authModal) {
        console.log('✅ Modal encontrado');
        console.log('Modal inicial classes:', authModal.className);
        
        // Agregar botón de cerrar
        const closeBtn = document.getElementById('closeModal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                console.log('🖱️ Clic en cerrar modal');
                authModal.classList.add('hidden');
            });
        }
    } else {
        console.log('❌ Modal NO encontrado');
    }
});

// Verificar configuración de Supabase
import('./js/supabase.js').then(({ supabase }) => {
    console.log('✅ Supabase importado correctamente');
    console.log('Supabase URL:', supabase.supabaseUrl);
}).catch(err => {
    console.log('❌ Error importando Supabase:', err);
});
