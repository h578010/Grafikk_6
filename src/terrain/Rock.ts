import { Mesh, MeshLambertMaterial, MeshStandardMaterial, Object3D, Scene, SphereGeometry, TextureLoader } from "three";
import Entity from "src/entity";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";

export class Rock implements Entity {
    public object: Object3D;
    public scene: Scene;

    constructor() {
        // this.object = new Object3D();
        // let rockGeometry = new SphereGeometry(0.7, 48, 48);
        // let rockTexture = new TextureLoader().load('/resources/rock/rock_texture.jpg');
        // let rockMaterial = new MeshStandardMaterial({
        //     map: rockTexture,
        //     color: 0xffffff,
        //     roughness: 0.9
        // });

        // rockMaterial.bumpMap = new TextureLoader().load('/resources/rock/rock_normal.jpg');
        // rockMaterial.bumpScale = 10;

        // this.object = new Mesh(rockGeometry, rockMaterial);

        this.object = new Object3D();
        this.scene = new Scene();

        let loader = new OBJLoader();
        loader.load('/resources/rock2/Rock_1.OBJ', (obj) => {
            obj.scale.multiplyScalar(0.1);
            this.object.position.x = 0;
            this.object.position.y = -5;
            this.object.position.z = 40;
            this.object.rotation.z = 40;

            let rockTexture = new TextureLoader().load('./resources/Rock2/rock/rock_base.jpg');
            
            // OBJLoader returns a object with children
            obj.traverse(function (child) {
                if (child instanceof Mesh) {
                    child.material.map = rockTexture;
                }
            });
            this.object.add(obj);

            // let rockBumpMap = new TextureLoader().load('./resources/Rock2/rock/Rock_normal.jpg');
            let rockMaterial = new MeshStandardMaterial({
                map: rockTexture,
                color: 0xffffff,
                roughness: 0.9,
                // bumpMap: new TextureLoader().load('/resources/Rock2/rock/Rock_normal.jpg'),
                // bumpScale: 100
            });

            rockMaterial.bumpMap = new TextureLoader().load('/resources/Rock2/rock/Rock_normal.jpg');
            rockMaterial.bumpScale = 1000;
        });
        
    }
    update() {

    }
}

export default Rock;