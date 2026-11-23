// Interface for camera data.
export interface KameraPodatki {
  fov: number;
  near: number;
  far: number;
  position: [number, number, number]; // an array of exactly three numbers
  rotation: [number, number, number]; //           --||--
}

// Defines the type for a triangle model, which is an array of dots, where each dot is a 3D vector.
export type TrikotnikModel = [number, number, number][];

// Descrbies an individual transformation in a scene
export interface TransformacijaPodatki {
  type: "scale" | "translate" | "rotate"; // type can only have one of these three values
  parameters: [number, number, number];
}

// Connects the model number (0 or 1) with an array of transformations that should be applied to it in the scene.
export interface ScenaElement {
  model: number;
  transforms: TransformacijaPodatki[];
}

// Connects all the pieces of data. Describes the whole JSON file that we are loading.
export interface PodatkiPrizora {
  camera: KameraPodatki;
  models: TrikotnikModel[];
  scene: ScenaElement[];
}

// Loads the file from the given path/server and returns the data as a TypeScript object.
export async function preberiDatoteko(pot: string): Promise<PodatkiPrizora> {
  const podatki: PodatkiPrizora = await fetch(pot).then((datoteka) => datoteka.json());
  return podatki;
}

// Loads a local file (Drag-and-drop) and returns the data as a TypeScript object.
export async function preberiNalozenoDatoteko(file: File): Promise<PodatkiPrizora> {
  const text = await file.text();
  const podatki: PodatkiPrizora = JSON.parse(text);
  return podatki;
}