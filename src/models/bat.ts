import THREE, { AnimationClip, AnimationMixer, Group, Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Entity from '../entity';

class Bat implements Entity {
    public object: Object3D;
    private mixer: AnimationMixer | undefined;

constructor() {

    this.object = new Group();

    let loader = new GLTFLoader();
    loader.load('resources/bat/scene.gltf', (gltf) => {

        this.object.add(gltf.scene);

        gltf.scene.scale.multiplyScalar(0.2);
        gltf.scene.position.x = 30;
        gltf.scene.position.y = 5;
        gltf.scene.position.z = 10;
        gltf.scene.rotation.y = Math.PI/2;

        this.mixer = new AnimationMixer(gltf.scene);
        const clip = AnimationClip.findByName(gltf.animations, 'ArmatureAction' );
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
        this.object.rotation.y += 0.02;
    }
}

export default Bat;