# Aprendiendo Matemáticas

Aplicaciones educativas en HTML, CSS y JavaScript, sin dependencias ni backend.

## Cómo abrirlas

Abre `index.html` en tu navegador para acceder a la lección de fracciones y al enlace del nuevo juego. También puedes abrir directamente `negativos/index.html`: **Al otro lado del cero**, para Elia. Funciona localmente, sin instalar nada ni conectarse a Internet.

El juego incluye cuatro niveles, seis contextos, recta numérica con pasos y pausa, feedback sobre la confusión entre distancia y resultado, y el modo «¿Distancia o resultado?» con preguntas emparejadas. En móvil puedes recorrer la recta horizontalmente y usar el botón **+/−** para introducir negativos.

Los aciertos y la racha cuentan el primer intento de cada ejercicio; se permite corregir la respuesta sin duplicar el progreso. El progreso dura la sesión y se reinicia con «Empezar otra partida» o al recargar. El nivel se cambia libremente.

## Dónde modificar el juego

- `negativos/questions.js`: escenarios (`label`, `story(a,b)`, `meaning(resultado)`) y generación según nivel. Añade objetos a `scenarios` para incorporar temas.
- `negativos/numberLine.js`: recta SVG, marcador y saltos.
- `negativos/app.js`: interacción, explicaciones, progreso y animación (850 ms por paso; pausa de 1.700 ms al llegar a cero).
- `negativos/styles.css`: diseño adaptable a móvil y escritorio.
- `negativos/index.html`: estructura accesible del juego.

La lección de fracciones mantiene sus archivos originales en la raíz. GitHub Pages está configurado para desplegar al hacer push a `main`.

## Verificación

Con Node.js instalado, ejecuta `node --test tests/negativos.test.cjs`.

Las pruebas usan un DOM simulado y temporizadores controlados: verifican los casos 5 − 8, 3 − 5, 8 − 3 y 0 − 4; el número exacto de saltos; pausa y reinicio; error de valor absoluto; niveles y progreso; y los límites del generador. No sustituyen una revisión visual en navegador.
