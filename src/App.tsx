import { Component } from 'solid-js';
import styles from './app.module.css';
import { ImageDisplay } from './components/ImageDisplay';
import { ImagePicker } from './components/ImagePicker';
import { Sidebar } from './components/Sidebar';
import { imageData } from './state/image';

const App: Component = () => {

  return (
    <div class={styles.app}>
      <Sidebar />
      <main class={styles.main}>
        {
          !imageData()
            ? <ImagePicker />
            : <ImageDisplay />
        }
      </main>
    </div>
  );
};

export default App;
