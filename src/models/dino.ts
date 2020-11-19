import THREE, { AnimationClip, AnimationMixer, Group, Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Entity from '../entity';

class Dino implements Entity {
    public object: Object3D;
    private mixer: AnimationMixer | undefined;

constructor() {

    this.object = new Object3D();

    let loader = new GLTFLoader();
    loader.load('resources/dino/scene.gltf', (gltf) => {

        this.object.add(gltf.scene);
        this.object.scale.multiplyScalar(0.2);
        this.mixer = new AnimationMixer(gltf.scene);
        const clip = AnimationClip.findByName(gltf.animations, 'Take 01' );
        const action = this.mixer.clipAction( clip );
        action.play();

        gltf.scene.traverse((child) => {
            if (child instanceof Mesh) {
                child.castShadow = true;
            }
        });
    });

    }
    update(delta: number) {
        if(this.mixer) {
            this.mixer.update(delta/1000);
        }
    }
}

export default Dino;