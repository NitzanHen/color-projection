import { Component, createEffect, createMemo, createSignal } from 'solid-js';
import styles from './app.module.css';
import { RGB, fromRGB, gramschmidt, project as logicProject } from './logic';
import Color from 'color';
import { projectImage } from './projectImage';

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

  const [numColors, setNumColors] = createSignal<number>(2);
  const addColor = () => setNumColors(n => n + 1);
  const removeColor = () => setNumColors(n => n - 1);
  const [colors, setColors] = createSignal<(string | undefined)[]>(['#ff0000', '#00ff00', '#0000ff']);
  const basis = createMemo(
    () => gramschmidt(colors().map(c => new Color(c).rgb().array() as RGB))
  );

  const [imageData, setImageData] = createSignal<ImageData>();
  const project = createMemo(
    () => imageData() && projectImage(imageData()!, numColors())
  );

  const handleColor = (e: ColorEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const input = e.currentTarget;
    const index = parseInt((input.name as string).slice(-1));

    setColors(
      colors => colors.map(
        (c, i) => i === index ? input.value : c)
    );
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
  const projectedCanvas = createMemo(() => project()?.(basis()));
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
          <input type='color' name={`color${i}`} value={colors()[i]} onInput={handleColor} />
        ))}
        <button onClick={addColor} disabled={numColors() >= 3}>+</button>
      </div>
      <div class={styles.images} ref={container}>
        <canvas ref={source} />
        <canvas ref={target} />
      </div>
    </div>
  );
};

export default App;
