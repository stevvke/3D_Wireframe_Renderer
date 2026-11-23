# 3D Wireframe Renderer (TypeScript)

A lightweight 3D wireframe rendering pipeline implemented in TypeScript without external rendering libraries, rendering JSON-defined scenes onto a 2D HTML5 canvas.

## Features
- **Transformations & Camera Math (`matematika.ts`):** 4x4 matrices and 4D vectors supporting translation, rotation (X, Y, Z), scaling, view matrix calculation, and perspective projection.
- **Scene & File Loading (`branje.ts`):** Parses JSON scene definitions (`camera`, `models`, `scene`) from files or user-selected/drag-and-drop `File` inputs.
- **Wireframe Rendering (`izris.ts`):** Applies object transformations, transforms vertices into view/clip/screen space, filters triangles outside `[near, far]`, and draws wireframes on the 2D canvas.
- **Interactive Entry Point (`main.ts`):** Loads a default scene on startup and supports drag-and-drop or file picker uploads.

## Running Locally
1. Install project dependencies and start the development/build setup provided by the template.
2. Open the app in a browser, or load a JSON scene via drag-and-drop or the canvas file picker.
