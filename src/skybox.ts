import * as THREE from 'three' 

class Skybox {

    constructor(scene: THREE.Scene) {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            'resources/skybox2.png',
            'resources/skybox2.png',
            'resources/skyboxx.png',
            'resources/skyboxx.png',
            'resources/skyboxx.png',
            'resources/skybox2.png',
        ]);
        scene.background = texture;
    }
}

export default Skybox;