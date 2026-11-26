# TASKS.md

Migración de `reference/cpp-mapa.html` a Rust + Leptos (CSR) + Trunk.

Reglas: una tarea a la vez, en orden. Al terminar una, marca `[x]` y anota debajo una línea con lo que se hizo y lo que se aprendió. Cada fase termina con una revisión de David antes de pasar a la siguiente.

Leyenda de aprendizaje: el tag `Rust:` indica el concepto principal que se practica en la tarea.

---

## WBS (estructura de desglose del trabajo)

```
CppMindMap
├── 0. Entorno y análisis ........ 0.1 toolchain · 0.2 repo · 0.3 análisis · 0.4 capturas
├── 1. Esqueleto ................. 1.1 hola mundo · 1.2 CSS · 1.3 fmt/clippy
├── 2. Modelo de datos ........... 2.1 JSON · 2.2 model.rs · 2.3 tests · 2.4 carga
├── 3. Estado y persistencia ..... 3.1 i18n · 3.2 signals · 3.3 storage · 3.4 tests
├── 4. Interfaz base ............. 4.1 pestañas · 4.2 glosario · 4.3 quiz · 4.4 resto
├── 5. Mapa mental SVG ........... 5.1 layout · 5.2 render · 5.3 interacciones
├── 6. Calidad y paridad ......... 6.1 revisión · 6.2 clippy · 6.3 tamaño wasm · 6.4 navegador
├── 7. Despliegue ................ 7.1 build · 7.2 CI · 7.3 README
├── 8. PWA / Android ............. 8.1 manifest · 8.2 iconos · 8.3 service worker
│                                  8.4 móvil · 8.5 rutas · 8.6 Lighthouse · 8.7 prueba real
└── 9. Extras (opcional) ......... 9.1 – 9.5
```

Dependencias clave: 8 requiere 7 (HTTPS y `--public-url`); 6.1 ya incluye revisión móvil; 5 y 4 requieren 2 y 3.

---

## Fase 0. Entorno y análisis del original

- [x] 0.1 Instalar el toolchain: `rustup`, target `wasm32-unknown-unknown`, `trunk`, y la extensión rust-analyzer en VS Code.
  - Estado: rustc 1.100.0, cargo 1.100.0, trunk 0.22.2 y el target wasm instalados. rust-analyzer verificado (botón Run en un proyecto de prueba).
  - Aceptación: `rustc --version`, `trunk --version` y rust-analyzer funcionando en un archivo de prueba.
- [x] 0.2 Crear el repo, copiar el HTML original a `reference/cpp-mapa.html`, y crear `CLAUDE.md` y `TASKS.md`.
  - Aceptación: estructura de carpetas creada, `git init` hecho.
- [ ] 0.3 Analizar el HTML original y documentar en `docs/analisis.md`: pestañas, estructuras de datos, funciones de JS, claves de `localStorage`, textos de interfaz, dependencias externas, tamaño.
  - Aceptación: lista completa de funciones a migrar y de datos a extraer. Aquí se completa o corrige esta lista de tareas.
- [ ] 0.4 Abrir el HTML original en el navegador y tomar capturas de cada pestaña y del estado vacío y con progreso, como referencia visual.
  - Aceptación: capturas guardadas en `docs/capturas/`.

## Fase 1. Esqueleto "hola mundo"

- [ ] 1.1 `cargo new` con Leptos CSR, `index.html` de Trunk y un componente `App` que muestre un título.
  - Rust: crates, `Cargo.toml`, `main.rs`, macros (`view!`).
  - Aceptación: `trunk serve` muestra el título en el navegador.
- [ ] 1.2 Migrar `style.css` desde el original (variables de color, tema oscuro, tipografías) y enlazarlo desde `index.html`.
  - Aceptación: la página vacía ya tiene el fondo y la tipografía del original.
- [ ] 1.3 Configurar `cargo fmt`, `cargo clippy` y un script o alias para correr todo.
  - Aceptación: los tres comandos corren sin warnings.

## Fase 2. Modelo de datos

- [ ] 2.1 Extraer los datos del HTML original a `data/*.json` (skills o ramas del mapa, glosario, preguntas del quiz), conservando ES y EN.
  - Aceptación: JSON válido y conteo de elementos igual al del original.
- [ ] 2.2 Definir en `model.rs` los `struct` y `enum` que representan esos datos, con `#[derive(Deserialize, Clone, Debug)]`.
  - Rust: structs, enums, derives, `serde`, ownership de datos.
  - Aceptación: compila y un test carga los JSON sin error.
- [ ] 2.3 Escribir tests de integridad: sin ids duplicados, todas las referencias existen, ningún campo `es` o `en` vacío.
  - Rust: `#[cfg(test)]`, iteradores, `HashSet`.
  - Aceptación: `cargo test` en verde.
- [ ] 2.4 Cargar los datos al arrancar con `include_str!` y exponerlos de forma que los componentes los lean sin copiarlos de más.
  - Rust: `&'static`, `OnceLock` o `Rc`, préstamos.
  - Aceptación: la app imprime en consola el número de elementos cargados.

## Fase 3. Estado, idioma y persistencia

- [ ] 3.1 Módulo `i18n.rs` con los textos de interfaz ES y EN y un `enum Lang`.
  - Rust: enums, `match`, `impl`.
  - Aceptación: una función devuelve el texto correcto según el idioma.
- [ ] 3.2 Signals globales de estado: idioma, pestaña activa, elementos completados, prioridades.
  - Rust: closures, `Clone` de signals, contexto de Leptos (`provide_context`).
  - Aceptación: cambiar el idioma actualiza el título al instante.
- [ ] 3.3 `storage.rs`: leer y escribir el estado en `localStorage` con clave versionada y manejo de errores.
  - Rust: `Result`, `?`, `Option`, errores propios, `web-sys` o `gloo-storage`.
  - Aceptación: recargar la página conserva idioma y progreso; si `localStorage` falla, la app sigue funcionando.
- [ ] 3.4 Tests de la lógica de (de)serialización del estado, incluyendo datos corruptos.
  - Aceptación: un JSON roto devuelve el estado por defecto, sin pánico.

## Fase 4. Interfaz base

- [ ] 4.1 Componente de pestañas y barra superior con selector de idioma.
  - Rust: componentes, props, eventos.
  - Aceptación: se puede cambiar de pestaña y de idioma.
- [ ] 4.2 Componente de glosario: lista, búsqueda, filtros por categoría, y marcas de progreso si existen en el original.
  - Rust: `For`, iteradores (`filter`, `map`), `Memo` o señales derivadas.
  - Aceptación: filtrar y buscar funciona igual que en el original, también en EN.
- [ ] 4.3 Componente de quiz: preguntas, opciones, puntaje, reinicio.
  - Rust: estado local, lógica pura de puntaje en una función con tests.
  - Aceptación: la lógica de puntaje tiene tests y el flujo completo funciona.
- [ ] 4.4 Resto de las pestañas o secciones que el análisis de la 0.3 haya encontrado.
  - Aceptación: paridad funcional con el original en cada pestaña.

## Fase 5. Mapa mental SVG

- [ ] 5.1 Función pura que calcula posiciones de ramas y hojas (ángulos, radios, saltos de línea de etiquetas), portada del JS original.
  - Rust: `f64`, `struct` de coordenadas, funciones puras, tests numéricos.
  - Aceptación: tests que comparan posiciones con valores del original.
- [ ] 5.2 Componente `MindMap` que dibuja el SVG con `view!`: nodo central, ramas, líneas y etiquetas.
  - Rust: generación de vistas desde iteradores, `viewBox`.
  - Aceptación: el mapa se ve igual que la captura de la 0.4, sin etiquetas solapadas ni fuera del `viewBox`.
- [ ] 5.3 Interacciones: seleccionar un nodo, panel de detalle, marcar como completado, hover y foco con teclado.
  - Rust: eventos, estado compartido, accesibilidad básica.
  - Aceptación: el comportamiento coincide con el original y se puede navegar con teclado.

## Fase 6. Calidad y paridad

- [ ] 6.1 Revisión pantalla por pantalla contra las capturas del original, ES y EN, escritorio y móvil.
  - Aceptación: lista de diferencias, cada una corregida o justificada.
- [ ] 6.2 Pasar `clippy` en modo estricto y revisar cada `unwrap`, `clone` y `to_string` innecesario.
  - Aceptación: cero warnings y cero `unwrap` fuera de tests.
- [ ] 6.3 Optimizar tamaño del wasm: perfil `release` con `opt-level = "z"`, `lto`, `codegen-units = 1`, y `wasm-opt` si Trunk lo permite. Medir antes y después.
  - Aceptación: tabla con el tamaño antes y después, y el tiempo de carga comparado con el HTML original.
- [ ] 6.4 Prueba en navegador real con el build de producción (consola sin errores, `localStorage` funcionando).
  - Aceptación: sin errores en consola en Chrome y Firefox.

## Fase 7. Despliegue

- [ ] 7.1 `trunk build --release` con `--public-url` correcto para el destino elegido.
  - Aceptación: `dist/` abre bien servido desde una subruta local.
- [ ] 7.2 Workflow de GitHub Actions: instalar toolchain, target y trunk, compilar, y publicar en GitHub Pages (o desplegar en Cloudflare Pages).
  - Aceptación: un push a `main` actualiza el sitio publicado.
- [ ] 7.3 README del repo: qué es, cómo correrlo, cómo desplegarlo, qué aprendiste.
  - Aceptación: otra persona puede clonar y correr `trunk serve` solo con el README.

## Fase 8. PWA e instalación en Android

Se instala como PWA (Chrome en Android: "Instalar app"). Requiere HTTPS, así que depende de la Fase 7. Alternativa más pesada, fuera de alcance por ahora: empaquetar con TWA/Bubblewrap para publicar en Play Store.

- [ ] 8.1 Crear `manifest.webmanifest` (name, short_name, start_url, scope, display `standalone`, theme_color y background_color del tema oscuro, lang) y enlazarlo en `index.html` con `data-trunk rel="copy-file"` o `rel="copy-dir"`.
  - Rust: cómo Trunk copia assets estáticos a `dist/`.
  - Aceptación: DevTools > Application > Manifest sin errores.
- [ ] 8.2 Iconos: 192x192, 512x512 y versión `maskable`, más `apple-touch-icon` y favicon.
  - Aceptación: iconos listados en el manifest y visibles en DevTools sin recortes.
- [ ] 8.3 Service worker (JS plano en `sw.js`, registrado desde `index.html`) con precache del shell: HTML, wasm, JS, CSS, JSON. Estrategia cache-first con versión de caché.
  - Aceptación: la app abre en modo avión tras la primera visita.
- [ ] 8.4 Ajustes móviles: `<meta name="viewport">`, `theme-color`, áreas táctiles de 44 px o más, sin hover como única vía de interacción en el mapa.
  - Aceptación: usable con un dedo en 360 px de ancho.
- [ ] 8.5 Rutas relativas al `--public-url` en manifest, `start_url`, `scope` y service worker.
  - Aceptación: instala bien desde la subruta de producción.
- [ ] 8.6 Lighthouse (categoría PWA / installable) en el sitio desplegado.
  - Aceptación: pasa los criterios de instalabilidad.
- [ ] 8.7 Prueba en un Android real: instalar desde Chrome, abrir desde el launcher, modo avión, actualizar versión y confirmar que el service worker refresca.
  - Aceptación: checklist de la prueba anotada en la bitácora.

---

## Fase 9. Extras opcionales

- [ ] 9.1 Buscador global entre mapa, glosario y quiz.
- [ ] 9.2 Exportar e importar el progreso como JSON.
- [ ] 9.3 Modo claro y oscuro con preferencia guardada.
- [ ] 9.4 Reusar el mismo código base para la página de Rust: separar los componentes comunes en un crate propio (un workspace de Cargo) y cargar los datos de cada tema desde su JSON.
  - Rust: workspaces, crates de librería, módulos y visibilidad (`pub`).
- [ ] 9.5 Mover la lógica pura (posiciones del mapa, puntaje) a un crate sin dependencias de Leptos y probar que también compila para el target nativo.

---

## Bitácora

Anota aquí, por fecha, lo que se terminó y lo que se aprendió.

| Fecha | Tarea | Notas y aprendizajes |
|---|---|---|
| 2026-11-23 | 0.1 | Toolchain instalado. En WSL falló la red por IPv6 (se resolvió con `RUSTUP_USE_CURL=1` e IPs IPv4 en `/etc/hosts`). VS Code no veía `cargo` hasta reiniciar con `wsl --shutdown`: el servidor hereda el `PATH` de cuando arrancó. |
| 2026-11-23 | 0.2 | Repo `cpp-mindmap` creado y conectado a GitHub. HTML original movido con `git mv` a `reference/cpp-mapa.html` (conserva el historial), carpetas `data/` y `docs/`, y `.gitignore` con `/target` y `/dist`. |

---

## Cambio de prioridad: PWA vanilla JS primero (2026-11-26)

La migración a Rust/Leptos queda en prioridad muy baja. Ahora la app es una PWA vanilla JS (sin build), basada en `deu-fehlerfrei`, instalable en Android.

- [x] Partir `reference/cpp-mapa.html` en `index.html`, `styles.css`, `src/data.js`, `src/app.js` (sin cambiar contenido).
- [x] Racha y meta diaria (`src/streak.js`, probada con `node --test`), pestaña Hoy (`src/today.js`), service worker offline (`sw.js`).
- [x] Manifest e iconos (claude.ai) en la raíz. Fusionado con la versión generada por claude.ai: pestaña Ajustes, 2 recordatorios al día, Periodic Sync, deep links `#quiz-go`/`#codigo-go`, exportar/importar progreso.
- [ ] Publicar en GitHub Pages (HTTPS) y probar la instalación en el celular.
- [ ] Recordatorio push con la app cerrada (Cloudflare Worker, como `deu-fehlerfrei/worker/push`).
