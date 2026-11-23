// Task 1.1 class Vektor with its methods.
export class Vektor {

    // Coordinates of the vector
    public koordinate: number[];

    constructor (x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.koordinate = [x, y, z, w];
    }

    // Does multiplication of a vector with a matrix and returns the resulting vector.
    transformiraj(matrika: Matrika): Vektor {
        let x: number = matrika.elementi[0][0] * this.koordinate[0] +
                        matrika.elementi[0][1] * this.koordinate[1] +
                        matrika.elementi[0][2] * this.koordinate[2] +
                        matrika.elementi[0][3] * this.koordinate[3];

        let y: number = matrika.elementi[1][0] * this.koordinate[0] +
                        matrika.elementi[1][1] * this.koordinate[1] +
                        matrika.elementi[1][2] * this.koordinate[2] +
                        matrika.elementi[1][3] * this.koordinate[3];

        let z: number = matrika.elementi[2][0] * this.koordinate[0] +
                        matrika.elementi[2][1] * this.koordinate[1] +
                        matrika.elementi[2][2] * this.koordinate[2] +
                        matrika.elementi[2][3] * this.koordinate[3];

        let w: number = matrika.elementi[3][0] * this.koordinate[0] +
                        matrika.elementi[3][1] * this.koordinate[1] +
                        matrika.elementi[3][2] * this.koordinate[2] +
                        matrika.elementi[3][3] * this.koordinate[3];
        
        return new Vektor(x, y, z, w);
    }

    // Used to print the vector in a format readable to users.
    toString(): string {
        return this.koordinate.join(" ");
    }
}

// Task 1.1 class Matrika with its methods.
export class Matrika {

    // Elements of a 4x4 matrix
    public elementi: number[][];

    // Creates a zero matrix if no elements are provided.
    constructor (elementi?: number[][]) {
        if (elementi) {
            this.elementi = elementi
        } else {
            this.elementi = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
        }
    }

    // Used to print the matrix in a format readable to users.
    toString(): string {
        let vsebinaMatrike: string = "";
        for(let i: number = 0; i < 4; i++) {
            for(let j: number = 0; j < 4; j++) {
                if(j < 3)
                    vsebinaMatrike += this.elementi[i][j] + " ";
                else
                    vsebinaMatrike += this.elementi[i][j];
            }
            if(i < 3)
                vsebinaMatrike += "\n";
        }
        return vsebinaMatrike;
    }

    // Multiplies two matrices and returns the resulting matrix.
    pomnozi(matrikaB: Matrika): Matrika {
        let matrikaC: Matrika = new Matrika();
        for(let i: number = 0; i < 4; i++) {
            for(let j: number = 0; j < 4; j++) {
                matrikaC.elementi[i][j] = this.elementi[i][0] * matrikaB.elementi[0][j] +
                                          this.elementi[i][1] * matrikaB.elementi[1][j] +
                                          this.elementi[i][2] * matrikaB.elementi[2][j] +
                                          this.elementi[i][3] * matrikaB.elementi[3][j];
            }
        }
        return matrikaC;
    }

    // Method which returns the identity matrix.
    static identiteta(): Matrika {
        return new Matrika([
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the matrix for scaling.
    static razteg(sx: number, sy: number, sz: number): Matrika {
        return new Matrika([
            [sx, 0, 0, 0],
            [0, sy, 0, 0],
            [0, 0, sz, 0],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the matrix for translation.
    static pomik(tx: number, ty: number, tz: number): Matrika {
        return new Matrika([
            [1, 0, 0, tx],
            [0, 1, 0, ty],
            [0, 0, 1, tz],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the matrix for rotation around the X axis.
    static zasukX(kot: number): Matrika {
        return new Matrika([
            [1, 0, 0, 0],
            [0, Math.cos(kot), -Math.sin(kot), 0],
            [0, Math.sin(kot), Math.cos(kot), 0],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the matrix for rotation around the Y axis.
    static zasukY(kot: number): Matrika {
        return new Matrika([
            [Math.cos(kot), 0, Math.sin(kot), 0],
            [0, 1, 0, 0],
            [-Math.sin(kot), 0, Math.cos(kot), 0],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the matrix for rotation around the Z axis.
    static zasukZ(kot: number): Matrika {
        return new Matrika([
            [Math.cos(kot), -Math.sin(kot), 0, 0],
            [Math.sin(kot), Math.cos(kot), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ]);
    }

    // Method which returns the perspective projection matrix.
    static PpMatrika(fov: number, aspectRatio: number, near: number, far: number): Matrika {
        let f: number = 1 / (Math.tan(fov / 2));
        return new Matrika([
            [f, 0, 0, 0],
            [0, f / aspectRatio, 0, 0],
            [0, 0, (far + near) / (near - far), (2 * far * near) / (near - far)],
            [0, 0, -1, 0]
        ]);
    }

    // Method which returns the view matrix.
    static matrikaPogleda(x: number, y: number, z: number, kotX: number, kotY: number, kotZ: number): Matrika {
        let inverzniPomik = Matrika.pomik(-x, -y, -z);
        let inverzniZasukX = Matrika.zasukX(-kotX);
        let inverzniZasukY = Matrika.zasukY(-kotY);
        let inverzniZasukZ = Matrika.zasukZ(-kotZ);
        let inverzniZasuk = inverzniZasukX.pomnozi(inverzniZasukY).pomnozi(inverzniZasukZ);
        return inverzniZasuk.pomnozi(inverzniPomik);
    }
}