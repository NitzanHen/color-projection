import Color from 'color';
import { createMemo, createSignal } from 'solid-js';
import { gramschmidt, RGB } from '../logic';

const [numColors, setNumColors] = createSignal<number>(2);
export { numColors };
export const addColor = () => setNumColors(n => n + 1);
export const removeColor = () => setNumColors(n => n - 1);

const [colors, setColors] = createSignal<(string | undefined)[]>(['#ff0000', '#00ff00', '#0000ff']);
export { colors };

export const setColor = (index: number, color: string) => 
  setColors(
    colors => colors.map(
      (c, i) => i === index ? color : c)
  );


export const colorBasis = createMemo(
  () => gramschmidt(colors().map(c => new Color(c).rgb().array() as RGB))
);