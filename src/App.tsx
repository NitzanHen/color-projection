import Color from 'color';
import { Component, createEffect, createMemo } from 'solid-js';
import styles from './app.module.css';
import { projectImage } from './projectImage';
import { Simulation } from './Simulation';
import { addColor, colorBasis, colors, numColors, removeColor, setColor } from './state/colors';
import { imageData, setImageData } from './state/image';

type SubmitEvent = InputEvent & {
  currentTarget: HTMLInputElement;
  target: Element;
};

type ColorEvent = Event & {
  currentTarget: HTMLInputElement;
  target: Element;
};

const App: Component = () => {
  let source: HTMLCanvasElement | undefined;
  let target: HTMLCanvasElement | undefined;

  const projectOntoCanvas = createMemo(() => imageData() && projectImage(imageData()!, numColors()));

  const handleColor = (e: ColorEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const input = e.currentTarget;
    const index = parseInt((input.name as string).slice(-1));

    setColor(index, new Color(input.value));
  }

  const handleImage = (e: SubmitEvent) => {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    const image = document.createElement('img');
    image.src = URL.createObjectURL(file);

    image.addEventListener('load', function () {
      const width = Math.min(this.width, 500);
      const height = width * (this.height / this.width);
      if (source) {
        source.width = width;
        source.height = height;

        const sourceCtx = source.getContext('2d')!;
        sourceCtx.drawImage(this, 0, 0, width, height);

        setImageData(sourceCtx.getImageData(0, 0, width, height));
      }
    })
  }

  let container: HTMLDivElement | undefined;
  let currentCanvas: HTMLCanvasElement | null = null;
  const projectedCanvas = createMemo(() => projectOntoCanvas()?.(colorBasis()));

  createEffect(() => {
    const canvas = projectedCanvas();
    if (!canvas) {
      return;
    }

    if (currentCanvas) {
      currentCanvas.replaceWith(canvas);
    }
    else {
      container?.appendChild(canvas);
    }
    currentCanvas = canvas;
  })

  return (
    <div class={styles.app}>
      <p>Pick an image and some colors</p>
      <input type='file' accept='image/*' multiple onInput={handleImage} />
      <div class={styles.colors}>
        <button onClick={removeColor} disabled={numColors() <= 1}>-</button>
        {[...Array(numColors()).keys()].map(i => (
          <input type='color' name={`color${i}`} value={new Color(colors()[i]).hex()} onInput={handleColor} />
        ))}
        <button onClick={addColor} disabled={numColors() >= 3}>+</button>
      </div>
      <div class={styles.images} ref={container}>
        <canvas ref={source} />
        <canvas ref={target} />
      </div>
      <Simulation />
    </div>
  );
};

export default App;
