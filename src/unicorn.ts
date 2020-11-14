import { Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class Unicorn { 

constructor(scene: THREE.Scene) {

    let orbitNode = new Object3D();
    orbitNode.position.x = 20;
    orbitNode.position.y = 0;
    orbitNode.position.z = -20;

    scene.add(orbitNode);

    let loader = new GLTFLoader();
    loader.load('resources/unicorn.glb', (object) => {
        const unicorn = object.scene.children[0];
        orbitNode.add(unicorn);
    });

    }
}

export default Unicorn;