import { Component, createEffect } from 'solid-js';
import { ArrowHelper, BoxGeometry, DoubleSide, EdgesGeometry, Group, LineBasicMaterial, LineSegments, Mesh, MeshBasicMaterial, PerspectiveCamera, Plane, PlaneGeometry, Scene, Vector3, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RGB } from './logic';
import { colors, numColors } from './state/colors';

export const Simulation: Component = () => {

  const handleCanvas = (canvas: HTMLCanvasElement) => {
    const scene = new Scene();
    const camera = new PerspectiveCamera(50, 1, 0.1, 1000);

    const renderer = new WebGLRenderer({ canvas, alpha: true });
    renderer.localClippingEnabled = true;
    renderer.setSize(300, 300);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0.5, 0.5, 0.5);

    const outline = new LineSegments(
      new EdgesGeometry(new BoxGeometry(1, 1, 1)),
      new LineBasicMaterial({ color: 'white', transparent: true, opacity: 0.4 })
    );
    outline.position.set(0.5, 0.5, 0.5);
    
    scene.add(outline);

    const redAxis = new ArrowHelper(
      new Vector3(1, 0, 0), new Vector3(0, 0, 0),
      1, 0xff0000, 0.1, 0.05
    );
    scene.add(redAxis);

    const blueAxis = new ArrowHelper(
      new Vector3(0, 0, 1), new Vector3(0, 0, 0),
      1, 0x0000ff, 0.1, 0.05
    );
    scene.add(blueAxis);

    const greenAxis = new ArrowHelper(
      new Vector3(0, 1, 0), new Vector3(0, 0, 0),
      1, 0x00ff00, 0.1, 0.05
    );
    scene.add(greenAxis);


    camera.position.set(0.75, 0.75, 2.25);

    const group = new Group();
    scene.add(group);

    createEffect(() => {
      group.clear();

      const n = numColors();
      const vecs = colors().map(color =>
        new Vector3()
          .fromArray(color.rgb().array() as RGB)
          .multiplyScalar(1 / 256)
      );
      for (let i = 0; i < n; i++) {
        const vec = vecs[i];
        const color = colors()[i];

        const arrow = new ArrowHelper(
          vec.clone().normalize(),
          new Vector3(0, 0, 0),
          vec.length(),
          color.hex(),
          0.1,
          0.075
        );

        group.add(arrow)
      }

      if (n === 2) {
        const clippingPlanes = [
          new Plane(new Vector3(1, 0, 0), 0.01),
          new Plane(new Vector3(-1, 0, 0), 0.99),
          new Plane(new Vector3(0, 1, 0), 0.01),
          new Plane(new Vector3(0, -1, 0), 0.99),
          new Plane(new Vector3(0, 0, 1), 0.01),
          new Plane(new Vector3(0, 0, -1), 0.99),
        ];

        const geometry = new PlaneGeometry(5, 5);


        const material = new MeshBasicMaterial({
          color: 0xffffff,
          opacity: 0.3,
          transparent: true,
          side: DoubleSide,
          clippingPlanes,
        });

        const plane = new Mesh(geometry, material);
        const normal = new Vector3().crossVectors(vecs[0], vecs[1]).normalize();

        plane.lookAt(normal);
        group.add(plane);
      }
    });

    createEffect(() => {
      function animate() {
        requestAnimationFrame(animate);
        controls.update()
        renderer.render(scene, camera);
      }
      animate();
    });
  }


  return (
    <canvas ref={handleCanvas} />
  );
};