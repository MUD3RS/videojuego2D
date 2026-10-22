# Videojuego 2D: Pacific Rim (Operación Brecha) - Examen Unidades III y IV

**Instituto Tecnológico de Pachuca**  
**Materia:** Graficación (I.S.C.)  
**Profesor:** M.T.I. Luis Alejandro Santana Valadez  
**Alumnos:** Abraham Uriel Zavala Osorio 23201052
             Cesar Ramses Hurtado Rios	24200090
**Fecha:** 21 de Octubre de 2026  

---

## 1. Contexto
El presente proyecto consiste en el desarrollo de un videojuego en 2D interactivo desarrollado mediante la API Canvas de HTML5, JavaScript vanilla y Bootstrap. La aplicación está ambientada en el universo cinematográfico de **Titanes del Pacífico (Pacific Rim)**, emulando la interfaz del visor táctico en primera persona desde la cabina (Conk-pit) de un mecha Jaeger de la PPDC durante una incursión de Kaijus en la Tierra.

---

## 2. Objetivo
Desarrollar un videojuego 2D aplicando la API Canvas de HTML5 que cumpla estrictamente con las reglas de negocio establecidas, aplicando dinámicas de movimiento, detección de colisiones elásticas, animaciones de impacto, control de audio interactivo y despliegue web mediante Git y GitHub Pages.

---

## 3. Justificación
La elección de la temática de Pacific Rim permite integrar de forma orgánica y estética todos los requerimientos técnicos exigidos por la rúbrica del examen:
- El entorno simulado del visor de cabina contextualiza el uso de un puntero personalizado como mira láser de targeting.
- La presencia continua de 25 amenazas móviles justifica el comportamiento aleatorio y las direcciones variadas (arriba, abajo, diagonal y circular).
- La Web Audio API e integración de medios potencian la inmersión visual y auditiva requerida sin comprometer el rendimiento.

---

## 4. Reglas de Negocio Implementadas

1. **Objetos 2D y Desplazamiento (25 Elementos):**
   - El lienzo renderiza de manera continua **25 objetos 2D** (sprites de Kaijus).
   - Movimiento autónomo en 4 direcciones distintas: **arriba, abajo, diagonal y circular**.
   - Cada objeto cuenta con velocidad variable independiente.
   - Algoritmo de **colisión elástica y separación vectorial**: cuando dos objetos colisionan, rebotan sin traslaparse y generan una **animación breve de choque** (partículas holográficas de chispa).

2. **Carga de Imágenes y Temática:**
   - Carga dinámica de imágenes de la temática elegida (`assets/objeto1.png`, `assets/objeto2.png`, `assets/objeto3.png`).

3. **Eliminación y Regeneración Aleatoria:**
   - Detección de clics por coordenadas del mouse sobre la máscara del objeto.
   - Al ser destruido un objeto, reaparece de forma aleatoria en otra zona del canvas, manteniendo siempre un total constante de **25 objetos**.

4. **Multimedia y Favicon:**
   - Escenario con imagen de fondo temática (`assets/fondo.jpg`).
   - Sonido táctico de disparo/láser al destruir objetivos mediante la Web Audio API.
   - Música de fondo con activación interactiva (`assets/musica.mp3`).
   - Favicon temático configurado en el documento web.

5. **Puntero Personalizado:**
   - Mouse configurado con un cursor SVG de retícula táctica holográfica azul neón.

6. **Contador de Elementos:**
   - Etiqueta dinámica HUD en la interfaz que contabiliza en tiempo real los Kaijus neutralizados.

7. **Estructura Web y Layout:**
   - Secciones HTML5 normadas: `Header` (con título y logo), `Main` (con el canvas dentro de la cabina Jaeger) y `Footer` (con créditos del desarrollador).
   - Uso de Bootstrap en línea para la distribución responsiva.

8. **Instrucciones de Usuario:**
   - Panel HUD compacto visible en pantalla que guía al usuario sobre la lógica operativa del juego.

---

## 5. Operación del Videojuego

1. **Inicio:** Al abrir la aplicación web, el bucle principal (`gameLoop`) inicializa los 25 objetos en coordenadas aleatorias visibles dentro de la ventana de la cabina.
2. **Interacción:** El usuario utiliza la mira táctica personalizada para hacer clic sobre cualquier Kaiju en movimiento.
3. **Feedback Visual y Sonoro:** 
   - Al acertar un clic, se emite un efecto de sonido de disparo láser, se generan partículas de explosión y el objeto reaparece instantáneamente en otra coordenada aleatoria.
   - El contador superior incrementa en +1 por cada amenaza neutralizada.
4. **Colisiones Autónomas:** Los Kaijus rebotan automáticamente entre sí y contra los límites del visor, emitiendo destellos de colisión.

---

## 6. Conclusiones

- **Desarrollo Técnico (Canvas API):** La implementación del motor 2D mediante la API Canvas demostró la eficiencia de JavaScript para procesar vectores de velocidad, renderizado por fotogramas (`requestAnimationFrame`) y resolución de traslapes en tiempo real para 25 entidades simultáneas.
- **Control de Versiones:** El seguimiento del proyecto mediante Git permitió controlar la evolución incremental de la aplicación, solucionando errores de colisión y capas CSS mediante commits estructurados, culminando con el despliegue remoto en GitHub Pages.