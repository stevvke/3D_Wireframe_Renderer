import { preberiDatoteko, preberiNalozenoDatoteko} from "./bralnik";
import { Vektor, Matrika } from "./matematika";
import { zgradiMatrikoObjekta, projicirajVektor, preslikajVZaslon, izrisiTrikotnik } from "./izris";

// Part which was there in the template.
const canvas = document.querySelector<HTMLCanvasElement>("#canvas")!;
if (!canvas) {
  throw new Error("Failed to get canvas context");
}
const ctx = canvas.getContext("2d");

// Tests from task 1.9.
console.log("--- Identitetna matrika in vektor ---");
let vektor = new Vektor(1, 2, 3, 1);
let id = Matrika.identiteta();
console.log("Vektor:\n" + vektor.toString());
console.log("Identitetna matrika:\n" + id.toString());

console.log("--- Transformacije (pomik, razteg, zasuk) ---");
let pomik = Matrika.pomik(5, 10, -2);
let razteg = Matrika.razteg(2, 2, 2);
let zasukX = Matrika.zasukX(Math.PI / 4);
let zasukY = Matrika.zasukY(Math.PI / 4);
let zasukZ = Matrika.zasukZ(Math.PI / 4);
console.log("Matrika pomika:\n" + pomik.toString());
console.log("Matrika raztega:\n" + razteg.toString());
console.log("Matrika zasuka po X:\n" + zasukX.toString());
console.log("Matrika zasuka po Y:\n" + zasukY.toString());
console.log("Matrika zasuka po Z:\n" + zasukZ.toString());

console.log("--- Mnozenje matrik in transformacija vektorja ---");
let kombinirano = pomik.pomnozi(razteg);
console.log("Rezultat mnozenja (pomik * razteg):\n" + kombinirano.toString());
let transformiraniVektor = vektor.transformiraj(kombinirano);
console.log("Transformirani vektor:\n" + transformiraniVektor.toString());

console.log("--- Perspektivna in matrika pogleda ---");
let fov = Math.PI / 3;
let aspectRatio = canvas.width / canvas.height;
let perspektivnaMatrika = Matrika.PpMatrika(fov, aspectRatio, 0.1, 100.0);
let matrikaPogleda = Matrika.matrikaPogleda(0, 0, 5, 0, 0, 0);
console.log("Perspektivna matrika:\n" + perspektivnaMatrika.toString());
console.log("Matrika pogleda:\n" + matrikaPogleda.toString());


// Read the data from the JSON file and log it to the console.
const privzetiPodatki = await preberiDatoteko("data/primer.json");
console.log("Privzeti podatki ob zagonu:", privzetiPodatki);
izrisiSceno(privzetiPodatki, canvas, ctx!);

// Used for file input and drag-and-drop functionality.
const fileInput = document.querySelector<HTMLInputElement>("#fileInput")!;

// Used to shorten the repetitive code. It takes the file that user has provided and uses preberiNalozenoDatoteko to read the data, waits for the result and logs it to the console.
async function obdelajDatoteko(file: File) {
  try {
    const nalozeniPodatki = await preberiNalozenoDatoteko(file);
    console.log("Nalozeni podatki prek datoteke:", nalozeniPodatki);
    izrisiSceno(nalozeniPodatki, canvas, ctx!); // Draw the scene with the loaded data.
  } catch (error) {
    console.error("Napaka pri branju datoteke:", error);
  }
}

// Start of drag-and-drop functionality.

// With event.preventDefault(), we allow to drop drag the file onto the canvas, because browsers by default don't allow that.
canvas.addEventListener("dragover", (event) => {
  event.preventDefault();
});

// It happens when the user drops the file onto the canvas.
canvas.addEventListener("drop", (event) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0]; // Takes exactly the first file that user has dropped onto the canvas.
  if (file) {  // If the file exists, we send it to obdelajDatoteko function.
    obdelajDatoteko(file);
  }
});

// End of drag-and-drop functionality.

// When the user clicks anywhere on the canvas, we trigger the file input click event, which opens the file selection window.
canvas.addEventListener("click", () => {
  fileInput.click();
});

// It happens when the user selects a file in that window.
fileInput.addEventListener("change", () => {
  const file = fileInput.files?.[0]; // Takes exactly the first file that user has selected in the file selection window.
  if (file) { // If the file exists, we send it to obdelajDatoteko function.
    obdelajDatoteko(file);
    fileInput.value = "";  // Resets file input value, so that the user can select the same file if needed.
  }
});

// Main function for drawing the scene.
function izrisiSceno(scenaData: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing.
  if(!scenaData || !scenaData.scene || !scenaData.models) { // Check if the scene contains objects and models.
    return;
  }

  const near = scenaData.camera?.near ?? 0.1; // Get near from camera data, default to 0.1.
  const far = scenaData.camera?.far ?? 100.0; // Get far from camera data, default to 100.0.
  const aspect = canvas.width / canvas.height; // Calculate aspect ratio from canvas dimensions.
  const fovDeg = scenaData.camera?.fov ?? 90; // Get fov from camera data, default to 90.
  const fovRad = fovDeg * (Math.PI / 180);
  const projMatrika = Matrika.PpMatrika(fovRad, aspect, near, far) // Create projection matrix.

  let viewMatrika = Matrika.identiteta(); // Initialize view matrix to identity.
  if(scenaData.camera?.position && scenaData.camera?.rotation) {
    const [px, py, pz] = scenaData.camera.position;
    const [rx, ry, rz] = scenaData.camera.rotation;
    const rxRad = rx * (Math.PI / 180);
    const ryRad = ry * (Math.PI / 180);
    const rzRad = rz * (Math.PI / 180);
    viewMatrika = Matrika.matrikaPogleda(px, py, pz, rxRad, ryRad, rzRad);
  }

  // Combined view matrix and projection matrix.
  const vpMatrika = projMatrika.pomnozi(viewMatrika);

  for(let element of scenaData.scene) {
    let model = scenaData.models[element.model];
    if(!model) {
      continue; // Skip if the model is not found.
    }
    let triangles = Array.isArray(model[0]) && Array.isArray(model[0][0]) && typeof model[0][0][0] === 'number' ? model : model[0];
    if(!Array.isArray(triangles)) {
      continue;
    }
    const matrikaObjekta = zgradiMatrikoObjekta(element.transforms); // Build the object matrix.

    // We go through each triangle of the model.
    for(let triangle of triangles) {
      const preoblikovanaOglisca = triangle.map((vKoord: number[]) => {
        const vektor = new Vektor(vKoord[0], vKoord[1], vKoord[2], 1);
        const transformiran = vektor.transformiraj(matrikaObjekta); // Transformation with the object matrix.

        const viewPoint = transformiran.transformiraj(viewMatrika);
        const cameraDepth = -viewPoint.koordinate[2]; // Actual depth of distance from the camera

        const projiciran = projicirajVektor(transformiran, vpMatrika); // Projection.
        const zaslonTocka = preslikajVZaslon(projiciran, canvas.width, canvas.height); // Mapping to screen coordinates.
        return new Vektor(zaslonTocka.koordinate[0], zaslonTocka.koordinate[1], cameraDepth, 1);
      });
      const v1 = preoblikovanaOglisca[0];
      const v2 = preoblikovanaOglisca[1];
      const v3 = preoblikovanaOglisca[2];
      if (v1 && v2 && v3) {
        izrisiTrikotnik(ctx, v1, v2, v3, near, far);
      }
    }
  }
}