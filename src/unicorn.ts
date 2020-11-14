import { Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Entity from './entity';

class Unicorn implements Entity{ 
    public object: Object3D

constructor() {

    this.object = new Object3D();

    let loader = new GLTFLoader();
    loader.load('resources/unicorn.glb', (gltf) => {
        this.object.add(gltf.scene);
        this.object.position.x = 20;
        this.object.position.y = 0;
        this.object.position.z = -20;
    });

    }
    update() {
    }
}

export default Unicorn;