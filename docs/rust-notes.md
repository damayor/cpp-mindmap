# Rust notes and glossary

Personal learning notes for the CppMindMap project. Add a row or section whenever a new Rust concept or tool shows up. Comparisons point to C++ or TypeScript.

## Toolchain

| Tool | What it is | Role in this project | Closest analogy |
|---|---|---|---|
| `rustup` | Toolchain manager | Installs and updates Rust versions and compilation targets (e.g. `wasm32-unknown-unknown`) | `nvm` |
| `rustc` | The Rust compiler | Turns `.rs` files into machine code or WebAssembly. You rarely call it directly, because `cargo` does | `g++` / `clang++` |
| `cargo` | Build system and package manager | Builds (`cargo build`), tests (`cargo test`), lints (`cargo clippy`), formats (`cargo fmt`), and downloads dependencies from crates.io. Config lives in `Cargo.toml` | CMake + vcpkg/Conan, or `npm` + `tsc` |
| `trunk` | Build tool and dev server for Rust web apps | Compiles the crate to `.wasm`, generates the JS glue, bundles `index.html` and CSS, serves with hot reload (`trunk serve`), and outputs a static `dist/` | Vite/webpack + Emscripten |

How they chain together: `trunk` calls `cargo`, which calls `rustc` with the `wasm32-unknown-unknown` target that `rustup` installed.

## Glossary

| Term | Meaning | Analogy |
|---|---|---|
| crate | A Rust package or compilation unit (library or binary) | npm package / C++ library target |
| target | The platform you compile for, e.g. `wasm32-unknown-unknown` | CMake toolchain / Emscripten |
| `Cargo.toml` | Manifest with metadata and dependencies | `package.json` / `CMakeLists.txt` |
| `Cargo.lock` | Exact resolved dependency versions | `package-lock.json` |
| crates.io | Public registry of crates | npm registry |
| PWA | Progressive Web App: a website installable on Android via a manifest and a service worker | n/a |
| WBS | Work Breakdown Structure: the task tree at the top of `TASKS.md` | n/a |

## Environment notes (WSL)

- Network problem in WSL: IPv6 routes were unreachable, so `rustup` and `cargo` failed to connect. Workaround used: `RUSTUP_USE_CURL=1`, pin IPv4 addresses for `static.rust-lang.org`, `index.crates.io` and `static.crates.io` in `/etc/hosts`, and `CARGO_HTTP_MULTIPLEXING=false`. The pinned IPs belong to a CDN and can change, so remove them when the network is fixed.
