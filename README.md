# 📝 Notas App

Una aplicación web moderna y elegante para crear, editar y gestionar notas personales.

## ✨ Características

- **Interfaz moderna**: Diseño atractivo con gradientes y animaciones suaves
- **Crear notas**: Escribe títulos y contenido para tus notas
- **Editar notas**: Modifica notas existentes fácilmente
- **Eliminar notas**: Borra notas que ya no necesites
- **Búsqueda**: Encuentra notas rápidamente por título o contenido
- **Persistencia**: Las notas se guardan automáticamente en el navegador
- **Respaldo**: Exporta e importa tus notas como archivo JSON
- **Responsive**: Funciona perfectamente en móviles y escritorio
- **Atajos de teclado**: Usa Ctrl+S para guardar, Escape para limpiar, etc.

## 🚀 Cómo usar

1. **Abrir la aplicación**: Simplemente abre `index.html` en tu navegador web
2. **Crear una nota**: 
   - Escribe un título (opcional)
   - Escribe el contenido de tu nota
   - Haz clic en "Guardar Nota" o presiona Ctrl+Enter
3. **Editar una nota**: Haz clic en el botón "Editar" de cualquier nota
4. **Eliminar una nota**: Haz clic en el botón "Eliminar" y confirma
5. **Buscar notas**: Usa el campo de búsqueda en la parte superior
6. **Exportar notas**: Haz clic en "Exportar" para descargar un respaldo
7. **Importar notas**: Haz clic en "Importar" para cargar notas desde un archivo

## ⌨️ Atajos de teclado

- `Ctrl + S`: Guardar nota
- `Ctrl + Enter`: Guardar nota (desde el área de contenido)
- `Escape`: Limpiar formulario
- `Ctrl + F`: Enfocar campo de búsqueda

## 🛠️ Tecnologías utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Flexbox y Grid
- **JavaScript ES6+**: Funcionalidad interactiva
- **LocalStorage**: Persistencia de datos
- **Font Awesome**: Iconos

## 📱 Características técnicas

- **Almacenamiento local**: Las notas se guardan en el navegador
- **Auto-guardado**: Borrador automático cada 30 segundos
- **Validación**: Previene guardar notas vacías
- **Escape de HTML**: Protección contra XSS
- **Responsive design**: Adaptable a todos los dispositivos
- **Animaciones**: Transiciones suaves y efectos visuales

## 🎨 Personalización

La aplicación está diseñada para ser fácilmente personalizable. Puedes modificar:

- Colores en `styles.css`
- Funcionalidades en `script.js`
- Estructura en `index.html`

## 📂 Estructura del proyecto

```
notas-app/
├── index.html      # Página principal
├── styles.css      # Estilos CSS
├── script.js       # Lógica JavaScript
└── README.md       # Este archivo
```

## 🔧 Instalación

No requiere instalación. Simplemente:

1. Descarga todos los archivos
2. Abre `index.html` en tu navegador
3. ¡Comienza a escribir tus notas!

## 💾 Respaldo y recuperación

### ⚠️ **Importante sobre la caché del navegador**
- **Sí, se borran las notas** si limpias la caché del navegador
- Las notas se guardan en `localStorage` que se incluye en la caché
- **Solución**: Usa los botones de Exportar/Importar para hacer respaldos

### 🔄 **Cómo hacer respaldos**
1. **Exportar**: Haz clic en "Exportar" para descargar un archivo JSON
2. **Importar**: Haz clic en "Importar" y selecciona un archivo JSON
3. **Reemplazar o agregar**: Al importar, puedes elegir reemplazar todas las notas o agregar a las existentes

### 📁 **Formato del archivo de respaldo**
- Archivo JSON con todas tus notas
- Incluye títulos, contenido, fechas de creación y modificación
- Compatible entre diferentes navegadores

## 💡 Consejos de uso

- **Haz respaldos regularmente** para no perder tus notas
- Usa títulos descriptivos para encontrar notas fácilmente
- El contenido puede incluir saltos de línea
- Las notas se ordenan por fecha de creación (más recientes primero)
- Puedes buscar por título o contenido
- Los borradores se guardan automáticamente

¡Disfruta organizando tus ideas con esta aplicación de notas!
