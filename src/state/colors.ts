import Color from 'color';
import { createMemo, createSignal } from 'solid-js';
import { gramschmidt, RGB } from '../logic';

const [numColors, setNumColors] = createSignal<number>(2);
export { numColors };
export const addColor = () => setNumColors(n => n + 1);
export const removeColor = () => setNumColors(n => n - 1);

const [colors, setColors] = createSignal<Color[]>([
  new Color('#FF0000'),
  new Color('#00FF00'),
  new Color('#0000FF'),
]);
export { colors };

export const setColor = (index: number, color: Color) => 
  setColors(
    colors => colors.map(
      (c, i) => i === index ? color : c)
  );


export const colorBasis = createMemo(
  () => gramschmidt(colors().slice(0, numColors()).map(c => c.rgb().array() as RGB))
);