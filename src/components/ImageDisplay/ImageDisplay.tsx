import { createEffect, createMemo } from 'solid-js';
import { projectImage } from '../../projectImage';
import { colorBasis, numColors } from '../../state/colors';
import { imageData } from '../../state/image';
import styles from './image-display.module.css';

export interface ImageDisplayProps { }

export const ImageDisplay = (props: ImageDisplayProps) => {
	let container: HTMLDivElement | undefined;
	let currentCanvas: HTMLCanvasElement | null = null;

	const handleCanvas = (canvas: HTMLCanvasElement) => {
		createEffect(() => {
			const data = imageData();
			if (data) {
				console.log('!', data, canvas);
				canvas.width = data.width;
				canvas.height = data.height;

				const ctx = canvas.getContext('2d')!;
				ctx.putImageData(data, 0, 0);
			}
		})
	}

	const projectOntoCanvas = createMemo(() => imageData() && projectImage(imageData()!, numColors()));

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
		<div class={styles.imageDisplay}>
			<div>
				<h1>Original</h1>
				<canvas ref={handleCanvas} class={styles.canvas}/>
			</div>
			<div ref={container}>
				<h1>Filtered</h1>
			</div>
		</div>
	);
};