import { Vektor, Matrika } from "./matematika";
import type { ScenaElement } from "./bralnik";

// The function receives a list of transformations for a single object from the scene and returns a combined matrix.
export function zgradiMatrikoObjekta(transforms: ScenaElement["transforms"]): Matrika {
    let matrika = Matrika.identiteta(); // We start with the identity matrix.
    for (let t of transforms) {
        const rad = (deg: number) => (deg * Math.PI) / 180; // Converts degrees to radians.
        if (t.type === "scale") { // If the transformation is scaling by X, Y, Z.
            let mRazteg = Matrika.razteg(t.parameters[0], t.parameters[1], t.parameters[2]);
            matrika = mRazteg.pomnozi(matrika);
        }
        else if (t.type === "translate") { // If the transformation is translation by X, Y, Z.
            let mPomik = Matrika.pomik(t.parameters[0], t.parameters[1], t.parameters[2]);
            matrika = mPomik.pomnozi(matrika); 
        }
        else if (t.type === "rotate") { // If the transformation is rotation by X, Y, Z.
            // The task explicitly states that we should first rotate around X, then Y, then Z: R = Rz * Ry * Rx.
            let zasukX = Matrika.zasukX(rad(t.parameters[0]));
            let zasukY = Matrika.zasukY(rad(t.parameters[1]));
            let zasukZ = Matrika.zasukZ(rad(t.parameters[2]));

            // We multiply them in the specified order.
            let mZasuk = zasukZ.pomnozi(zasukY).pomnozi(zasukX);
            matrika = mZasuk.pomnozi(matrika);
        }
    }
    return matrika;
}

// Projection of the vector and perspective division.
export function projicirajVektor(vektor: Vektor, projMatrika: Matrika): Vektor {
    let proj = vektor.transformiraj(projMatrika); // We transform the vector with the projection matrix.
    if (proj.koordinate[3] !== 0) { // If the fourth coordinate is not zero, we perform perspective division.
        proj.koordinate[0] /= proj.koordinate[3];
        proj.koordinate[1] /= proj.koordinate[3];
        proj.koordinate[2] /= proj.koordinate[3];
        proj.koordinate[3] = 1; // We set the fourth coordinate to 1 after perspective division.
    }
    return proj; // We return the projected vector.
}

// Function that converts normalized coordinates from screen space into real pixels of our canvas.
export function preslikajVZaslon(vektor: Vektor, sirina: number, visina: number): Vektor {
    let x = (vektor.koordinate[0] + 1) * 0.5 * sirina; // It changes the range from [-1, 1] to [0, width].
    let visinaObrnjena = visina - 1; // We subtract from height because the Y-axis is inverted in screen space.
    let y = (1 - (vektor.koordinate[1] + 1) * 0.5) * visinaObrnjena; // We have inverted Y-axis with 1 - (...), so that our objects aren't upside down.
    let z = vektor.koordinate[2]; // We keep the Z coordinate as is.
    return new Vektor(x, y, z, 1);
}

// Draws a triangle while checking if it's too far or too near.
export function izrisiTrikotnik (ctx: CanvasRenderingContext2D, v1: Vektor, v2: Vektor, v3: Vektor, near: number, far: number) {
    const jeZVeljaven = (z: number) => z >= near && z <= far; // Checks if the Z coordinate is within bounds.
    if (!jeZVeljaven(v1.koordinate[2]) || !jeZVeljaven(v2.koordinate[2]) || !jeZVeljaven(v3.koordinate[2])) {
        return; // If any vertex is out of bounds, we don't draw the triangle.
    }
    // Drawing the triangle.
    ctx.beginPath();
    ctx.moveTo(v1.koordinate[0], v1.koordinate[1]);
    ctx.lineTo(v2.koordinate[0], v2.koordinate[1]);
    ctx.lineTo(v3.koordinate[0], v3.koordinate[1]);
    ctx.closePath();
    ctx.strokeStyle = "black";
    ctx.stroke();
}