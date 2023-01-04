
export type RGB = [r: number, g: number, b: number];

// Inner product
const prod = (x: RGB, y: RGB) => {
    const [x1, x2, x3] = x;
    const [y1, y2, y3] = y;

    return x1 * y1 + x2 * y2 + x3 * y3;
}
const norm = (x: RGB) => Math.sqrt(prod(x, x));

const add = (c1: RGB, c2: RGB): RGB => {
    const [x1, x2, x3] = c1;
    const [y1, y2, y3] = c2;

    return [x1 + y1, x2 + y2, x3 + y3];
}

const scale = (t: number, c: RGB): RGB => {
    const [x1, x2, x3] = c;
    return [t * x1, t * x2, t * x3];
}

const subtract = (c1: RGB, c2: RGB): RGB => {
    const [x1, x2, x3] = c1;
    const [y1, y2, y3] = c2;

    return [x1 - y1, x2 - y2, x3 - y3];
}

const sum = (...colors: RGB[]): RGB => colors.reduce(add);

// Projection of color onto space spanned by the basis
export function project(basis: RGB[], c: RGB): RGB {
    return sum(
        ...basis.map(b => scale(prod(c, b), b))
    );
}

export const fromRGB = (str: string): RGB => {
    const r = parseInt(str.substring(0, 2), 16);
    const g = parseInt(str.substring(2, 4), 16);
    const b = parseInt(str.substring(4, 6), 16);

    return [r, g, b];
}

const padZeroes = (s: string, d: number) => {
    const n = s.length;
    return n <= d ? '0'.repeat(d - n) + s : s;
}

export const toRGB = (color: RGB): string => {
    const [r, g, b] = color
        .map(x => Math.round(x))
        .map(n => padZeroes(n.toString(16), 2)
        );
    return r + g + b;
}

export const proj = (v: RGB, u: RGB) => scale(
    prod(u, v) / prod(u, u), u
);

export function gramschmidt(basis: RGB[]): RGB[] {

    const u: RGB[] = basis.slice();
    for (let i = 0; i < u.length; i++) {
        // normalize u_i 
        u[i] = scale(1 / norm(u[i]), u[i]);
        for (let j = i + 1; j < u.length; j++) {
            // u_j -= <u_j, u_i>*u_i
            u[j] = subtract(
                u[j],
                scale(prod(u[j], u[i]), u[i])
            )
        }
    }

    return u.map(v => scale(1 / norm(v), v));
}