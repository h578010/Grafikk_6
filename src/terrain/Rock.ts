import { Mesh, MeshStandardMaterial, Object3D, TextureLoader } from "three";
import Entity from "src/entity";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'

export class Rock implements Entity {
    public object: Object3D;

    constructor() {
        this.object = new Object3D();

        let loader = new OBJLoader();
        loader.load('/resources/rock2/Rock_1.OBJ', (obj) => {
            obj.scale.multiplyScalar(0.1);
            this.object.position.x = 0;
            this.object.position.y = -5;
            this.object.position.z = 40;
            this.object.rotation.z = 40;

            let rockTexture = new TextureLoader().load('./resources/Rock2/rock/rock_base.jpg');

            let rockMaterial = new MeshStandardMaterial({
                map: rockTexture,
                color: 0xffffff,
                roughness: 0.9,
                bumpMap: new TextureLoader().load('/resources/Rock2/rock/Rock_normal.jpg'),
                bumpScale: 1
            });

            // OBJLoader returns a object with children
            obj.traverse(function (child) {
                if (child instanceof Mesh) {
                    child.material = rockMaterial;
                }
            });
            this.object.add(obj);

        });

    }
    update() {

    }
}

export default Rock;