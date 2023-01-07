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

		handleImage(file);
	}

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setDragHover(true);
	}

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		setDragHover(false);
	}

	const handleImage = (file: File | undefined) => {
		if (!file) {
			return;
		}

		const image = document.createElement('img');
		image.src = URL.createObjectURL(file);

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
				Or, <a role='button' onClick={() => input?.click()}>browse</a> for one manually
			</p>
			<input ref={input} type='file' accept='image/*' onChange={e => handleImage(e.currentTarget.files?.[0])} />
		</div>
	);
};