import THREE, { Group, Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Entity from './entity';

class Bat implements Entity {
    public object: Object3D;

constructor() {

    this.object = new Object3D();

    let loader = new GLTFLoader();
    loader.load('resources/bat/scene.gltf', (gltf) => {
        const bat = gltf.scene.children[0];
        bat.scale.multiplyScalar(0.2);
        this.object.add(bat);
        this.object.position.x = 17;
        this.object.position.y = 5;
        this.object.position.z = 10;
    });

    }
    update() {
        this.rotateObject(this.object, [0.0, 0.0, 0.0]);
    }
    rotateObject(object: Object3D, rotation: number[]) {
        object.rotation.x += rotation[0];
        object.rotation.y += rotation[1];
        object.rotation.z += rotation[2];
    }
}

export default Bat;