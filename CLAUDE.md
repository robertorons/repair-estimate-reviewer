# Repair Estimate Reviewer
**Documento de requisitos — MVP v1.0**

## 1. Objetivo
Construir una aplicación web sencilla que permita a un ajustador de pérdidas comparar los precios unitarios de una cotización de reparación contra un catálogo pequeño de referencias.

Es un proyecto educativo del curso Miami Dade College AI Clinic Level 3 – Code & Cloud, desarrollado con Claude Code y GitHub.

**Prioridad:** entregar una aplicación sencilla, funcional y publicada antes del 5 de diciembre de 2026. Se prefiere una herramienta pequeña que funcione a una completa e inestable.

## 2. Cómo debe trabajar Claude Code en este proyecto
- El usuario es principiante. Explica cada paso en español sencillo, brevemente.
- Antes de escribir código, explica brevemente qué harás en la etapa y qué archivos crearás o modificarás. No avances a otra etapa sin autorización del usuario.
- Trabaja una etapa por vez (sección 10). Al terminar cada etapa, explica cómo probarla y espera la confirmación del usuario antes de continuar.
- No añadas funciones, archivos, librerías ni servicios que no estén en este documento sin aprobación previa.
- Propón un commit cada vez que algo funcione, con un mensaje breve en inglés.

## 3. Tecnología
- Solo HTML, CSS y JavaScript. Sin frameworks, sin paso de compilación y sin paquetes npm.
- Archivos previstos: `index.html`, `styles.css`, `app.js` y `catalog.js`.
- El catálogo va en `catalog.js` (no en JSON), para que la aplicación funcione abriendo `index.html` con doble clic, sin servidor local.
- Sin backend, base de datos, cuentas de usuario, servicios de pago ni claves de API, salvo que el instructor lo exija.
- Publicación preferida: GitHub Pages, conectada al repositorio.

## 4. Idioma
- La interfaz y este documento están en español.
- Se conservan términos técnicos habituales: drywall, O&P, SF, LF, SY, EA, LS, GitHub.

## 5. Funciones del MVP
1. **Ingreso de partidas:** el usuario introduce la descripción del trabajo, la cantidad, la unidad (lista: SF, SY, LF, EA, LS, Otra) y el precio unitario cotizado.
2. **Selección de referencia:** el usuario elige del catálogo la partida equivalente. Al seleccionarla, se muestran su definición, alcance (incluye/excluye), unidad, método de medición y base de precio.
3. **Confirmación de comparabilidad:** un solo campo: "¿Coinciden el alcance y la base de precio?" con las opciones **Sí / No / No sé**.
4. **Comparación y clasificación:** según las reglas de las secciones 7 y 8.
5. **Comentario:** cada resultado muestra un comentario predefinido según su clasificación (sección 8). No se usa inteligencia artificial.
6. **Tabla resumen:** lista todas las partidas ingresadas, permite eliminar una fila y muestra los totales (sección 7).
7. **Aviso fijo en pantalla:** "Los precios de referencia son ficticios y sirven solo para demostración. Esta herramienta hace una revisión preliminar: un precio dentro del rango no significa que la cotización sea razonable. Deben verificarse alcance, cantidades y condiciones del trabajo."
8. **PDF (etapa 3):** el usuario puede cargar y ver un PDF digital como apoyo mientras ingresa las partidas. Se muestra con el visor integrado del navegador, sin librerías como pdf.js. El archivo no se envía a ningún servidor. La aplicación debe funcionar completamente sin PDF.

No se guardan datos: al recargar la página se pierde la información ingresada, y es intencional.

## 6. Catálogo de referencia
Cinco partidas iniciales:

| Partida | Unidad | Método de medición |
|---|---|---|
| Pintura interior de paredes | SF | Superficie de pared |
| Pintura de cielos rasos | SF | Superficie de cielo raso |
| Sustitución de drywall | SF | Superficie de pared o cielo; nivel de acabado especificado |
| Sustitución de paneles acústicos de cielo raso | SF | Superficie de cielo raso |
| Sustitución de suspensión metálica de cielo raso | SF | Superficie de cielo raso |

Cada partida del catálogo debe incluir:
- Identificador, nombre y descripción
- Alcance: qué incluye y qué excluye
- Unidad y método de medición
- Precio de referencia, límite inferior y límite superior (inferior ≤ referencia ≤ superior)
- Ubicación geográfica
- Fecha del precio
- Fuente
- Base de precio: si incluye mano de obra, materiales, equipos, impuestos y O&P

Todos los precios serán ficticios y se identificarán así en el catálogo y en la interfaz (fuente: "Dato demostrativo ficticio"). Los datos del catálogo deben estar separados de la lógica, de modo que puedan reemplazarse sin modificar `app.js`.

## 7. Reglas de cálculo
Antes de calcular, validar que la cantidad y el precio cotizado sean números mayores que cero. Si no lo son, mostrar un mensaje de error y no agregar la partida.

Solo para partidas comparables:
- Total cotizado = Cantidad × Precio unitario cotizado
- Total de referencia = Cantidad × Precio unitario de referencia
- Diferencia unitaria = Precio unitario cotizado − Precio unitario de referencia
- Desviación % = (Diferencia unitaria ÷ Precio unitario de referencia) × 100

Formato: montos en dólares con 2 decimales y porcentajes con 1 decimal y signo (+/−).

**Totales de la tabla resumen:** el total cotizado, el total de referencia y la diferencia total se calculan solo con las partidas comparables, las mismas en ambos totales. Las partidas no comparables permanecen visibles en la tabla, identificadas como tales, pero se excluyen de los totales y las diferencias. Se muestra además cuántas partidas quedaron como "No comparable".

## 8. Reglas de comparabilidad y clasificación
Una partida es **No comparable** si se cumple cualquiera de estas condiciones:
- La unidad elegida por el usuario no coincide con la unidad de la referencia.
- La respuesta a "¿Coinciden el alcance y la base de precio?" es **No** o **No sé**.
- Falta algún dato necesario.

No se hacen conversiones de unidades ni ajustes de impuestos u O&P. A las partidas no comparables no se les calcula desviación ni clasificación de precio.

Para las partidas comparables, los límites son inclusivos:

| Condición | Clasificación | Comentario predefinido |
|---|---|---|
| Precio < límite inferior | Por debajo del rango | El precio está por debajo del rango de referencia. Un precio bajo puede indicar alcance incompleto, cantidades distintas o partidas omitidas. Verificar antes de aceptarlo. |
| Límite inferior ≤ precio ≤ límite superior | Dentro del rango | El precio está dentro del rango de referencia. Esto no confirma por sí solo que sea razonable; verificar alcance y cantidades. |
| Precio > límite superior | Por encima del rango | El precio supera el rango de referencia. Verificar preparación de superficies, condiciones de acceso, cantidades y alcance antes de concluir. |
| No comparable | No comparable | La partida no se compara porque la unidad, el alcance o la base de precio no coinciden o no están confirmados. |

## 9. Fuera de alcance
- Interpretación automática de cotizaciones o uso de IA
- Reconocimiento de texto en PDFs escaneados
- Precios en línea o APIs de costos
- Ajustes por país
- Cuentas de usuario y guardado de expedientes o historiales
- Exportación a Excel

## 10. Etapas de desarrollo
1. **Etapa 1:** estructura de la página, catálogo demostrativo, ingreso de partidas y cálculos.
2. **Etapa 2:** reglas de comparabilidad, clasificaciones, comentarios, tabla resumen con totales y aviso fijo.
3. **Etapa 3:** carga y visualización del PDF (opcional: en una rama aparte con pull request).
4. **Etapa 4:** pruebas, corrección de errores, publicación conectada a GitHub y preparación de la presentación.

Terminar y probar cada etapa antes de pasar a la siguiente.

## 11. Repositorio y datos
- Repositorio Git desde el inicio, sincronizado con GitHub. Rama principal `main`.
- El repositorio será público: no incluir cotizaciones reales, documentos de clientes ni precios de fuentes con licencia.
- La cotización de ejemplo para la demostración debe ser ficticia.

## 12. Criterios de aceptación
El MVP está terminado cuando el usuario puede:
1. Abrir la aplicación desde una URL pública.
2. Ingresar al menos tres partidas sin cargar un PDF.
3. Seleccionar referencias del catálogo y responder la confirmación de comparabilidad.
4. Obtener cálculos correctos, clasificaciones y comentarios predefinidos.
5. Ver la tabla resumen con totales calculados solo sobre partidas comparables.
6. Cargar y ver un PDF digital de ejemplo sin enviarlo a un servidor.

El código y su historial de desarrollo deben estar en GitHub.

**Casos de prueba** (con una referencia ficticia de $3.00/SF, límite inferior $2.50 y superior $3.50):

| Cantidad | Unidad | Precio cotizado | Confirmación | Resultado esperado |
|---|---|---|---|---|
| 2,000 | SF | $4.50 | Sí | Total cotizado $9,000.00; total de referencia $6,000.00; diferencia +$1.50; +50.0 %; Por encima del rango |
| 2,000 | SF | $3.50 | Sí | +16.7 %; Dentro del rango (límite inclusivo) |
| 2,000 | SF | $2.00 | Sí | −33.3 %; Por debajo del rango |
| 2,000 | SF | $3.00 | No sé | No comparable; sin desviación |
| 200 | SY | $27.00 | Sí | No comparable (unidad distinta) |
