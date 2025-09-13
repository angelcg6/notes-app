// Script simplificado para debuggear el modal
console.log('🚀 Iniciando script simplificado...');

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM cargado');
    
    // Verificar elementos
    const signInBtn = document.getElementById('signInBtn');
    const signUpBtn = document.getElementById('signUpBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    
    console.log('Elementos encontrados:');
    console.log('- signInBtn:', signInBtn);
    console.log('- signUpBtn:', signUpBtn);
    console.log('- authModal:', authModal);
    console.log('- closeModal:', closeModal);
    
    // Función para mostrar modal
    function showModal(mode) {
        console.log('🔍 Mostrando modal:', mode);
        
        if (!authModal) {
            console.error('❌ Modal no encontrado');
            return;
        }
        
        console.log('Modal antes de mostrar:', authModal.className);
        authModal.classList.remove('hidden');
        console.log('Modal después de mostrar:', authModal.className);
        
        // Cambiar título
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = mode === 'signin' ? 'Iniciar Sesión' : 'Registrarse';
        }
        
        // Cambiar botón
        const submitAuth = document.getElementById('submitAuth');
        if (submitAuth) {
            if (mode === 'signin') {
                submitAuth.innerHTML = '<i class="fas fa-sign-in-alt"></i> Iniciar Sesión';
            } else {
                submitAuth.innerHTML = '<i class="fas fa-user-plus"></i> Registrarse';
            }
        }
    }
    
    // Función para ocultar modal
    function hideModal() {
        console.log('🔍 Ocultando modal');
        
        if (!authModal) {
            console.error('❌ Modal no encontrado');
            return;
        }
        
        console.log('Modal antes de ocultar:', authModal.className);
        authModal.classList.add('hidden');
        console.log('Modal después de ocultar:', authModal.className);
    }
    
    // Event listeners
    if (signInBtn) {
        signInBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Clic en Iniciar Sesión');
            showModal('signin');
        });
        console.log('✅ Event listener para Iniciar Sesión configurado');
    } else {
        console.error('❌ Botón Iniciar Sesión no encontrado');
    }
    
    if (signUpBtn) {
        signUpBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Clic en Registrarse');
            showModal('signup');
        });
        console.log('✅ Event listener para Registrarse configurado');
    } else {
        console.error('❌ Botón Registrarse no encontrado');
    }
    
    if (closeModal) {
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🖱️ Clic en cerrar modal');
            hideModal();
        });
        console.log('✅ Event listener para cerrar modal configurado');
    } else {
        console.error('❌ Botón cerrar modal no encontrado');
    }
    
    // Cerrar modal al hacer clic fuera
    if (authModal) {
        authModal.addEventListener('click', (e) => {
            if (e.target === authModal) {
                console.log('🖱️ Clic fuera del modal');
                hideModal();
            }
        });
    }
    
    // Cerrar modal con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
            console.log('⌨️ Tecla Escape presionada');
            hideModal();
        }
    });
    
    console.log('✅ Script simplificado configurado correctamente');
});
