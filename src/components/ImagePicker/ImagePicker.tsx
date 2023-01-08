import { createSignal } from 'solid-js';
import { setImageData } from '../../state/image';
import styles from './image-picker.module.css';

export interface ImagePickerProps { }

type SubmitEvent = Event & {
	currentTarget: HTMLInputElement;
	target: Element;
}

export const ImagePicker = (props: ImagePickerProps) => {
	let input: HTMLInputElement | undefined;

	const [dragHover, setDragHover] = createSignal(false);

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setDragHover(false);
		const file = e.dataTransfer?.files[0];
		if (!file) {
			return;
		}

		const url = URL.createObjectURL(file);
		processImage(url);
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setDragHover(true);
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		setDragHover(false);
	}

	const handleUpload = (e: SubmitEvent) => {
		e.preventDefault();
		const file = e.currentTarget.files?.[0];
		if (!file) {
			return;
		}

		const url = URL.createObjectURL(file);
		processImage(url);
	}

	const getRandomImage = () => {
		const size = Math.floor(0.4 * Math.max(window.innerWidth - 250, window.innerHeight - 100))
		const src = `https://picsum.photos/${size}`
		processImage(src);
	}

	const processImage = (src: string) => {

		const image = document.createElement('img');
		image.src = src;
		image.crossOrigin = 'anonymous';

		image.addEventListener('load', function () {
			const width = this.width;
			const height = width * (this.height / this.width);
			const canvas = document.createElement('canvas');
			canvas.width = width;
			canvas.height = height;

			const ctx = canvas.getContext('2d')!;
			ctx.drawImage(this, 0, 0, width, height);

			setImageData(ctx.getImageData(0, 0, width, height));
		})
	}

	return (
		<div onDragOver={handleDragOver} onDrop={handleDrop} onDragLeave={handleDragLeave} classList={{ [styles.zone]: true, [styles.dragHover]: dragHover() }}>
			<p class={styles.prompt}>Drag and drop an image to get started!</p>
			<p class={styles.subprompt}>
				Alternatively, <a role='button' onClick={() => input?.click()}>browse</a> for an image file, or <a role='button' onClick={getRandomImage}>pick one at random</a>.
			</p>
			<input ref={input} type='file' accept='image/*' onChange={handleUpload} />
		</div>
	);
};