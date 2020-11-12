
import { Mesh, MeshBasicMaterial, PointLight, SphereGeometry, TextureLoader } from 'three';

class Sun extends SphereGeometry { 

constructor(scene: THREE.Scene) {
    super();
    let sunGeometry = new SphereGeometry(5, 128, 128);
    let sunTaxture = new TextureLoader().load('resources/texture_sun.jpg');
    let sunMaterial = new MeshBasicMaterial({map: sunTaxture});
    let sun = new Mesh(sunGeometry, sunMaterial);
    sun.position.x = 100;
    sun.position.y = 100;
    sun.position.z = -10;
    scene.add(sun);

    let sunlight = new PointLight(0xffffff, 2);
    sun.add(sunlight);

    }
}

export default Sun;