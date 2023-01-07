import iro from '@jaames/iro';
import Color from 'color';
import { Component, createEffect, createSignal } from 'solid-js';
import { colors, numColors, setColor } from '../state/colors';

interface ColorPickerProps {
  className?: string;
}

export const ColorPicker: Component = (props: ColorPickerProps) => {
  const [picker, setPicker] = createSignal<iro.ColorPicker>();

  const handleRoot = (el: HTMLDivElement) => {
    const picker = iro.ColorPicker(el, {
      borderWidth: 1,
      width: 250,
      layout: [
        {
          component: iro.ui.Wheel,
          options: {
            borderColor: '#ffffff'
          }
        },
        {
          component: iro.ui.Slider,
          options: {
            borderColor: '#000000',
            sliderType: 'value'
          }
        }
      ]
    });

    picker.on('color:change',
      (color: any) => setColor(color.index, new Color(color.hexString))
    );

    setPicker(picker);
  }

  createEffect(() => {
    const p = picker();
    const n = numColors();
    if (!p) {
      return;
    }

    const activeIndex = p.color.index;
    p.setColors(colors().slice(0, n).map(c => c.hex()));
    p.setActiveColor(
      Math.min(activeIndex, n - 1)
    );
  });

  return (
    <div ref={handleRoot}/>
  )
}