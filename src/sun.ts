
import { Mesh, MeshBasicMaterial, Object3D, PointLight, SphereGeometry, TextureLoader } from 'three';
import Entity from './entity';

class Sun implements Entity { 
    public object: Object3D;

constructor() {

    this.object = new Object3D();
    let sunGeometry = new SphereGeometry(5, 128, 128);
    let sunTaxture = new TextureLoader().load('resources/texture_sun.jpg');
    let sunMaterial = new MeshBasicMaterial({map: sunTaxture});
    this.object = new Mesh(sunGeometry, sunMaterial);
    this.object.position.x = 80;
    this.object.position.y = 80;
    this.object.position.z = -10;

    let sunlight = new PointLight(0xffffff, 2);
    this.object.add(sunlight);

    }
    update() {}
}

export default Sun;