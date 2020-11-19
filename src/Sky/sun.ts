
import { DirectionalLight, Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import Entity from '../entity';

class Sun implements Entity { 
    public object: Object3D;

constructor() {
    let sunGeometry = new SphereGeometry(5, 128, 128);
    let sunTaxture = new TextureLoader().load('resources/sky/texture_sun.jpg');
    let sunMaterial = new MeshBasicMaterial({map: sunTaxture});
    this.object = new Mesh(sunGeometry, sunMaterial);
    this.object.position.x = 80;
    this.object.position.y = 80;
    this.object.position.z = -10;

    let sunlight = new DirectionalLight(0xffffff, 1.5);
    const targetObject = new Object3D();
    sunlight.target = targetObject;
    sunlight.add(targetObject);
    sunlight.shadow.camera.left = - 400;
    sunlight.shadow.camera.right = 400;
    sunlight.shadow.camera.top = 400;
    sunlight.shadow.camera.bottom = -400;

    targetObject.position.x = -5;
    targetObject.position.y = -128;
    targetObject.position.z = -128;
    sunlight.castShadow = true; 
    sunlight.shadow.mapSize.width = 2048; // default
    sunlight.shadow.mapSize.height = 2048; // default   
    this.object.add(sunlight);

    }
    update() {}
}

export default Sun;