# Resumen del proyecto: Repair Estimate Reviewer
*Estado al 14 de noviembre de 2026*

## Funciones completadas (Etapas 1 a 3)
- **Catálogo (`catalog.js`):** 5 partidas con datos ficticios, separadas de la lógica. La pintura interior de paredes usa $3.00/SF, con rango 2.50–3.50.
- **Ingreso de partidas:** descripción, cantidad, unidad, precio cotizado, referencia del catálogo y confirmación Sí / No / No sé. Muestra el detalle de la referencia elegida y valida que cantidad y precio sean mayores que cero.
- **Comparabilidad y clasificación:** una partida es "No comparable" si la unidad no coincide o la confirmación no es "Sí". Para las comparables, los límites son inclusivos. Hay tres resultados: Por debajo del rango (ámbar), Dentro del rango (azul) y Por encima del rango (rojo suave), con comentarios predefinidos y sin IA. "No comparable" va en gris.
- **Tabla resumen:** 7 columnas legibles, con eliminación de filas.
- **Totales:** se calculan solo con las partidas comparables, con la diferencia total como cotizado − referencia. Muestran también el contador de comparables y no comparables.
- **Aviso:** el aviso de precios ficticios está visible arriba de la página.
- **PDF (Etapa 3):** carga y visor con el navegador, todo local y sin servidores. Tiene botón "Quitar PDF" que no borra las partidas. Con PDF cargado, el visor va a la izquierda y el formulario a la derecha. Sin PDF, el formulario ocupa todo el ancho.
- **`.gitignore`:** excluye `*.pdf` para proteger el repositorio público.

## Git y GitHub
- **Repositorio:** https://github.com/robertorons/repair-estimate-reviewer
- **Rama actual:** `main`, sincronizada con `origin/main` en el commit `4c3350f`, sin cambios pendientes (antes de crear este archivo).
- **Historial:**
  - `f6981e0`: requisitos iniciales.
  - `546ffce`: Etapa 1.
  - `9d5787d`: Etapa 2.
  - `a24c914`: Etapa 3, en la rama `feature/pdf-viewer`.
  - `4c3350f`: merge del Pull Request #1.
- **Rama `feature/pdf-viewer`:** sigue existiendo en el computador y en GitHub. Ya no hace falta y se puede borrar, pero aún no se ha eliminado.
- **Pull request:** se practicó el flujo completo: rama, commit, push, pull request en la web y merge.
- **Publicación:** todavía no está publicada en GitHub Pages.

## Pruebas realizadas
Todas las hizo el usuario en el navegador; Claude no ejecutó la aplicación.
- **Etapa 1:** cálculos, validación de cantidad cero y reinicio con F5.
- **Etapa 2:** los 5 casos de la sección 12, los totales (con 3 comparables y 2 no comparables), la eliminación de filas, los colores y la legibilidad de la tabla.
- **Etapa 3:** carga del PDF, diseño de dos columnas, PDF inválido, "Quitar PDF", operación sin conexión, y compatibilidad con las Etapas 1 y 2.
- **Seguridad del repositorio:** no hay PDFs ni datos confidenciales en la carpeta ni en el historial.

## Pendientes para la clase del 21 de noviembre (Etapa 4)
1. **Probar la versión de `main`:** abrir `index.html` desde `main` tras el merge y repetir las pruebas principales.
2. **Probar más a fondo:**
   - Los 5 casos de la sección 12.
   - Casos extremos: decimales, números muy grandes y descripciones largas.
   - Criterio de aceptación: al menos 3 partidas sin PDF.
   - Otros navegadores, si es posible.
3. **Corregir errores** que aparezcan.
4. **Publicar en GitHub Pages:** activarlo en la configuración del repositorio (Settings → Pages, rama `main`) y comprobar que la URL pública funciona, incluido el visor del PDF.
5. **Preparar la presentación:**
   - Una cotización de ejemplo ficticia y un PDF digital ficticio de ejemplo.
   - Esos archivos no deben subirse al repositorio.
6. **Limpieza opcional:** borrar la rama `feature/pdf-viewer`, que es seguro porque ya está incorporada.
7. **Fecha límite del proyecto:** el 5 de diciembre de 2026, con la aplicación publicada.

## Notas para retomar
- Se trabaja una etapa a la vez, con autorización del usuario antes de avanzar. Nada de commits sin su confirmación.
- No se añaden funciones ni librerías fuera de `CLAUDE.md`.
- Los mensajes de commit van en inglés y la interfaz en español.
