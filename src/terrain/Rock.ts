import { Mesh, MeshStandardMaterial, Object3D, SphereGeometry, TextureLoader } from "three";
import Entity from "src/entity";


export class Rock implements Entity {
    public object: Object3D;

    constructor() {
        this.object = new Object3D();
        let rockGeometry = new SphereGeometry(0.7, 48, 48);
        let rockTexture = new TextureLoader().load('/resources/rock/rock_texture.jpg');
        let rockMaterial = new MeshStandardMaterial({
            map: rockTexture,
            color: 0xffffff,
            roughness: 0.9
        });
        
        rockMaterial.bumpMap = new TextureLoader().load('/resources/rock/rock_normal.jpg');
        rockMaterial.bumpScale = 10;

        this.object = new Mesh(rockGeometry, rockMaterial);
        this.object.position.x = 1;
        this.object.position.y = 5.5;
        this.object.position.z = 12;

        this.object.rotation.z = 20;
        
    }
    update() {

    }
}

export default Rock;