import { GPU } from 'gpu.js';
import { proj, project, RGB } from './logic';

export const projectImage = (image: ImageData, basisSize: number): (basis: RGB[]) => HTMLCanvasElement => {
  const render = new GPU()
    .createKernel(function (data: number[], basis: number[]) {
      const x = this.thread.x;
      const y = this.thread.y;
      const w = this.constants.w as number;
      const h = this.constants.h as number;
      const basisSize = this.constants.basisSize as number;

      const n = 4 * (w * (h - y) + x);
      const c: RGB = [data[n], data[n + 1], data[n + 2]];

      // Project on basis
      let projected = [0, 0, 0];
      for (let i = 0; i < basisSize; i++) {
        const b = [basis[3 * i], basis[3 * i + 1], basis[3 * i + 2]];
        const p = (c[0] * b[0]) + (c[1] * b[1]) + (c[2] * b[2]);

        projected[0] += p * b[0];
        projected[1] += p * b[1];
        projected[2] += p * b[2];
      }

      this.color(projected[0] / 256, projected[1] / 256, projected[2] / 256, 1);
    })
    .setConstants({ w: image.width, h: image.height, basisSize })
    .setOutput([image.width, image.height])
    .setGraphical(true);

  return (basis: RGB[]) => {
    render(image.data, basis);
    
    return render.canvas;
  }
}