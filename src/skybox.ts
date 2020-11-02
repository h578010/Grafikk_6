import * as THREE from 'three' 

class Skybox {

    constructor(scene: THREE.Scene) {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'resources/skybox.png',
            'resources/skybox.png',
            'resources/skybox.png',
            'resources/skybox.png',
            'resources/skybox.png',
            'resources/skybox.png',
        ]);
        scene.background = texture;
    }
}

export default Skybox;