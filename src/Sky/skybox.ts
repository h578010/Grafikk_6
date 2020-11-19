import * as THREE from 'three' 

class Skybox {

    constructor(scene: THREE.Scene) {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'resources/sky/skybox2.png',
            'resources/sky/skybox2.png',
            'resources/sky/skybox.png',
            'resources/sky/skybox.png',
            'resources/sky/skybox.png',
            'resources/sky/skybox2.png',
        ]);
        scene.background = texture;
    }
}

export default Skybox;