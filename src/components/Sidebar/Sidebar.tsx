import { Simulation } from '../../Simulation';
import { addColor, numColors, removeColor } from '../../state/colors';
import { ColorPicker } from '../ColorPicker';
import styles from './sidebar.module.css';

export interface SidebarProps { }

export const Sidebar = (props: SidebarProps) => {

	return (
		<div class={styles.sidebar}>
			<header class={styles.title}>
				<h1>Color Projection Demo</h1>
			</header>

			<div class={styles.colorPicker}>
				<ColorPicker />
			</div>
			<div class={styles.colorControls}>
				<button class={styles.button} disabled={numColors() <= 1} onClick={removeColor}>Remove Color</button>
				<button class={styles.button} disabled={numColors() >= 3} onClick={addColor}>Add Color</button>
			</div>

			<Simulation />
		</div>
	);
};