# CLAUDE.md

Proyecto: reescritura de `reference/cpp-mapa.html` (mapa mental, glosario y quiz de C++) como app web en **Rust + Leptos (CSR)**, compilada a WebAssembly con **Trunk**. Se despliega como sitio estático y se instala en Android como **PWA** (Fase 8 de `TASKS.md`; el WBS está al inicio de ese archivo).

## Contexto de la persona (importante)

- David es ingeniero de software con experiencia en frontend, React, TypeScript, Three.js y WebAssembly (C++ con Emscripten). Conoce C++ y JS muy bien.
- **Está aprendiendo Rust con este proyecto.** El objetivo principal es aprender, no solo terminar. Por eso:
  - Explica brevemente el porqué de cada concepto nuevo de Rust que aparezca (ownership, borrowing, lifetimes, traits, enums, `Option`/`Result`), y relaciónalo con C++ o TypeScript cuando ayude.
  - Cuando haya un error del compilador, explica qué dice y por qué ocurre antes de arreglarlo.
  - No reescribas grandes bloques de golpe. Avanza por tareas pequeñas de `TASKS.md`, una a la vez, y deja que David escriba o revise el código cuando él lo pida.
  - Si hay varias formas de hacer algo, muestra la idiomática en Rust y menciona la alternativa en una línea.
- Idioma de la conversación: español colombiano (registro bogotano, no argentino). Código, nombres de variables, commits y comentarios técnicos en inglés.

## Stack

- Rust estable, edición 2024 (Rust 1.85 o superior). Verifica con `rustc --version`.
- Leptos, modo CSR (`features = ["csr"]`). Antes de escribir código de Leptos, **revisa la versión instalada en `Cargo.lock` y su documentación en docs.rs**, porque la API ha cambiado entre versiones (por ejemplo, la forma de crear signals). No uses sintaxis de memoria si no estás seguro.
- Trunk para build y servidor de desarrollo.
- `serde` y `serde_json` para los datos, `web-sys` o `gloo-storage` para `localStorage`.
- Target: `wasm32-unknown-unknown`.

## Comandos

```bash
rustup target add wasm32-unknown-unknown   # una sola vez
cargo install trunk                        # una sola vez
trunk serve --open                         # desarrollo con recarga
trunk build --release                      # salida en dist/
cargo fmt                                  # formatear
cargo clippy --all-targets -- -D warnings  # lints, deben quedar en cero
cargo test                                 # tests de lógica pura
```

Antes de dar una tarea por terminada: `cargo fmt`, `cargo clippy` sin warnings, `cargo test` en verde y `trunk build` sin errores.

## Estructura prevista

```
cpp-mapa-leptos/
├── CLAUDE.md
├── TASKS.md
├── Cargo.toml
├── index.html            # entrada de Trunk (enlaza CSS y el wasm)
├── manifest.webmanifest  # manifest PWA (Fase 8)
├── sw.js                 # service worker (Fase 8)
├── style.css             # tema oscuro, migrado del HTML original
├── data/                 # JSON extraído del HTML original (skills, glosario, quiz)
├── reference/
│   └── cpp-mapa.html     # HTML original, SOLO lectura, es la fuente de verdad visual
└── src/
    ├── main.rs           # monta <App/>
    ├── app.rs            # componente raíz, pestañas, idioma
    ├── model.rs          # structs y enums de datos (serde)
    ├── i18n.rs           # textos de interfaz ES/EN
    ├── state.rs          # signals globales y persistencia
    ├── storage.rs        # envoltorio de localStorage
    └── components/
        ├── mind_map.rs   # mapa SVG
        ├── glossary.rs
        ├── quiz.rs
        └── ...
```

Es una guía, no un dogma. Si una estructura mejor aparece, propónla y explica por qué.

## Convenciones de código

- Un componente de Leptos por archivo cuando crezca, con nombres en `PascalCase` y funciones en `snake_case`.
- Separa la **lógica pura** (filtrar el glosario, calcular posiciones del mapa, puntaje del quiz) de los componentes, en funciones normales que se puedan probar con `cargo test` sin navegador.
- Los datos viven en `data/*.json` y se cargan con `include_str!` y `serde_json` al arrancar, o se definen como `const` si son pocos. Los textos son bilingües: cada campo visible tiene versión `es` y `en`.
- Nada de `unwrap()` ni `expect()` en código de la app, salvo en tests o con un comentario que justifique por qué no puede fallar. Usa `Result`, `Option` y `?`.
- Prefiere iteradores a bucles con índices. Prefiere `&str` en parámetros y `String` solo cuando haya que poseerlo.
- Evita `clone()` innecesarios. Si clonas, que sea consciente (por ejemplo, clonar un signal o un `Rc` es barato, clonar un `Vec` grande no).
- Comentarios solo donde el porqué no sea obvio. Si el concepto de Rust es el motivo de una decisión (por ejemplo, un lifetime), déjalo en un comentario corto.
- `localStorage` siempre dentro de un manejo de errores: puede fallar o estar vacío. Usa una clave con versión, por ejemplo `cppmap.v1`.

## Fidelidad al original

- El HTML en `reference/cpp-mapa.html` define el contenido, el comportamiento y el aspecto. **Lee ese archivo antes de planear** y no inventes contenido nuevo ni borres el existente sin avisar.
- Mantén las funciones del original: mapa mental, glosario, quiz, selector de idioma ES/EN, progreso guardado y tema oscuro. Si el original tiene más pestañas o funciones, inclúyelas en `TASKS.md` antes de implementarlas.
- La migración debe verse y comportarse igual. Las mejoras van en una fase aparte, al final.

## Reglas de trabajo con Claude Code

- Lee `TASKS.md` al empezar. Trabaja **una tarea a la vez**, márcala con `[x]` cuando cumpla su criterio de aceptación y anota en una línea qué se hizo y qué se aprendió.
- No avances a la siguiente fase sin confirmar con David.
- No instales dependencias nuevas sin explicar para qué sirven y ofrecer la alternativa de no usarlas.
- No toques `reference/`. No hagas commits ni pushes a menos que David lo pida. Si los haces, mensajes cortos en inglés, en imperativo.
- Si algo del original es ambiguo, pregunta en vez de adivinar.
- Cuando David pida "explícame", responde con el concepto, un ejemplo mínimo y la comparación con C++ o TypeScript, no con una clase larga.

## Despliegue

Sitio estático: el contenido de `dist/` se sube a GitHub Pages o Cloudflare Pages. Si va en un subpath (por ejemplo `usuario.github.io/cpp-mapa/`), usa `trunk build --release --public-url /cpp-mapa/`.
