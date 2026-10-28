# Auditoría UX/UI: Calculadora Interactiva

**Alumno:** Arizapana Flores John Ricardo · **Grupo:** E · **Curso:** Diseño de Interfaces de Programación Avanzado
**Pantalla auditada:** Calculadora interactiva (Laboratorio 05)

## 1. Auditoría con las cinco heurísticas de Nielsen

| Heurística | Problema de la pantalla original | Solución aplicada | Gravedad |
|---|---|---|---|
| Visibilidad del estado | Al calcular, el resultado cambiaba sin ningún aviso. No se sabía si el cálculo se guardó ni qué operación estaba elegida. | Un mensaje visible tras cada acción (`role="status"`): «Resultado: 8. Guardado en el historial.», «Operación elegida: +». La operación activa se resalta en la tecla. | Alta |
| Coincidencia con el mundo real | Las teclas usaban `*` y `/`, símbolos de programación. El botón de resultado no explicaba qué hacía. | Se usan `×` y `÷` como en una calculadora real, el botón dice «Calcular» y los mensajes están en lenguaje cotidiano. | Media |
| Control y libertad | No había forma de corregir un dígito ni de recuperar datos. Cualquier borrado era definitivo. | Botón `⌫` para borrar el último dato, `C` para limpiar y botón **Deshacer** tras «Borrar historial». | Alta |
| Prevención de errores | Se podía pulsar `=` con datos incompletos o dividir entre 0, y el error se mostraba después (o no se mostraba). | El botón «Calcular» está desactivado hasta que hay dos números y una operación. Si se divide entre 0 se avisa y no se permite calcular. No se acepta un segundo punto decimal. | Alta |
| Reconocer, no recordar | El usuario debía recordar el primer número y la operación al escribir el segundo. No había historial visible. | La pantalla muestra toda la expresión (`12 + 5`). El historial de los últimos 7 cálculos queda a la vista y se guarda en el navegador. | Media |

## 2. Leyes de usabilidad aplicadas

| Ley | Cambio concreto | Por qué ayuda |
|---|---|---|
| **Fitts** | El botón «Calcular» ocupa todo el ancho (56 px de alto), todas las teclas miden al menos 48 px y el botón «Borrar historial» está lejos del teclado. | Los objetivos grandes se aciertan más rápido y los destructivos quedan lejos de los de uso frecuente. |
| **Hick** | Las teclas se agrupan por tipo y color: números (gris), operaciones (azul claro) y acciones (blanco). Solo hay 4 operaciones y 2 acciones. | Menos opciones por grupo y clasificadas por color reducen el tiempo para decidir. |
| **Miller** | El historial muestra solo los últimos 7 cálculos. | Recordamos unos 7 elementos a la vez; una lista corta se lee sin esfuerzo. |

## 3. Principios visuales

- **Jerarquía:** un solo `h1` de 28 px, pantalla destacada y botón «Calcular» relleno, mientras las acciones secundarias solo tienen borde.
- **Color:** variables en `:root`. Azul para acciones principales, rojo solo para errores y verde solo para éxito.
- **Tipografía:** Arial a 16 px o más con `line-height: 1.5`.
- **Espaciado:** múltiplos de 8 px (8, 16, 24, 32) en todo el diseño.

## 4. Accesibilidad

- Cada botón con símbolo tiene `aria-label` («Dividir», «Borrar último dígito») y la pantalla tiene `aria-label`. La calculadora no tiene campos de texto, por eso no usa `<label>`.
- No se usan imágenes, por lo que no se necesita `alt`.
- Foco visible con `:focus-visible` (borde naranja de 3 px), sin `outline: none`.
- Contraste mayor a 4.5:1 en todo el texto (texto `#1f2933` sobre blanco ≈ 14.7:1; texto de apoyo `#52606d` ≈ 6.4:1).
- Se puede usar entera solo con el teclado: dígitos, `+ - * /`, `Enter`, `Backspace` y `Esc`, además de Tab sobre los botones.

## 5. Lighthouse (Accesibilidad)

| Versión | Puntaje | Captura |
|---|---|---|
| Antes | _[escribe tu puntaje]_ | _[pega aquí tu captura del antes]_ |
| Después | _[escribe tu puntaje, debe ser 90 o más]_ | _[pega aquí tu captura del después]_ |

## 6. Cumplimiento de los requisitos de la tarea

| Requisito | Dónde se cumple |
|---|---|
| Mensaje visible tras cada acción | `decir()` en `app.js` y `<p id="mensaje" role="status">` |
| Cancelar una acción destructiva | Botón «Deshacer» tras «Borrar historial» |
| Error prevenido, no reportado | Botón «Calcular» desactivado si faltan datos o se divide entre 0 |
| Variables CSS en `:root` y un solo `h1` | `estilos.css` e `index.html` |
| Botones de al menos 44 px | `min-height: 48px` en `button` |
| Foco visible | `:focus-visible` en `estilos.css` |

## 7. Enlaces

- Repositorio: https://github.com/johnarizapana/laboratorio-readme
- Página publicada: https://johnarizapana.github.io/laboratorio-readme/
