# C++ Mapa (PWA)

App instalable en el celular para practicar C++ cada día: mapa mental de 23 skills, glosario (180 términos), quiz de definiciones, predicción de salida de código, racha diaria y recordatorios. Es JavaScript vanilla sin build ni `package.json` (igual que `deu-fehlerfrei`). La reescritura en Rust/Leptos queda en prioridad baja (ver [TASKS.md](TASKS.md)).

## Estructura

| Ruta | Qué es |
|---|---|
| `index.html`, `styles.css` | Shell, pestañas y tema oscuro |
| `src/data.js` | Datos (skills, glosario, preguntas de código), extraídos de `reference/cpp-mapa.html` |
| `src/app.js` | Mapa, glosario, quizzes, navegación por hash, idioma ES/EN |
| `src/streak.js` | Racha y meta diaria. Lógica pura, probada y compartida con el service worker |
| `src/today.js` | Pestaña **Hoy**: meta, racha, historial de 14 días, aviso de actualización |
| `src/settings.js` | Pestaña **Ajustes**: recordatorios, instalar, exportar/importar progreso |
| `src/boot.js` | Registro del service worker |
| `sw.js` | Caché offline y notificaciones |
| `manifest.webmanifest`, `icons/` | Datos de instalación e íconos |
| `reference/` | HTML original, solo lectura |

## Correr en local

```bash
python3 -m http.server 8000   # luego abre http://localhost:8000
node --test                   # tests de la racha (Node 20+)
```

Los service workers funcionan en `localhost`. Para probar en el celular necesitas HTTPS (GitHub Pages).

## Publicar (GitHub Pages)

1. Sube el repo a GitHub (sin `reference/` si prefieres, no se usa en runtime).
2. Settings, Pages, "Deploy from a branch", `main`, carpeta `/ (root)`.
3. En Chrome Android abre la URL, menú ⋮, "Instalar app". Al mantener presionado el ícono salen los atajos Quiz y Código.

Todas las rutas son relativas, así que funciona en un subpath (`usuario.github.io/cpp-mapa/`).

## Actualizar

Sube `CACHE_VERSION` en `sw.js` en cada release (y agrega archivos nuevos a `ASSETS`). La app instalada muestra el aviso "Nueva versión disponible" en **Hoy**; al tocar "Actualizar" se recarga con la versión nueva.

## Racha, meta y recordatorios

- Cada respuesta en cualquiera de los dos quizzes suma a la meta del día (por defecto 10, configurable en **Hoy**). Los días son fechas locales del dispositivo. Hoy pendiente no rompe la racha hasta medianoche.
- **Ajustes**: 2 recordatorios al día (hora + tipo: quiz o código). Si hay algo pendiente y abres la app, sale un banner arriba con "Empezar". Terminar una ronda marca ese pendiente como hecho.
- La notificación en segundo plano usa Periodic Background Sync de Chrome: **Android decide cuándo despertar la app**, puede llegar tarde o no llegar. Si la racha está en riesgo, el texto lo menciona. Para una alarma exacta usa una alarma o evento recurrente del celular.

## Datos

Todo vive en el dispositivo: `localStorage` (`cppmap.v1`: archivados, prioritarios, idioma; `cppmap.act.v1`: actividad por día, meta, recordatorios) e IndexedDB `cppmap` (copia para el service worker). Para pasar el progreso a otro dispositivo o URL: Ajustes, "Mostrar y copiar progreso", y pégalo en "Importar progreso" del otro.
