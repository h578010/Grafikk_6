import Entity from 'src/entity';
import * as THREE from 'three'
import { Geometry, Group, InstancedMesh, Material, MeshLambertMaterial, MeshStandardMaterial, Object3D, PlaneGeometry, Scene } from 'three';
import TerrainBufferGeometry from './TerrainBufferGeometry'

export class Stones implements Entity {
    public object: Object3D;
    terrain: TerrainBufferGeometry;
    count: number;
    limit: number;

    constructor(terrainBufferGeometry: TerrainBufferGeometry, count: number, limit: number) {
        this.terrain = terrainBufferGeometry;
        this.count = count;
        this.limit = limit;
        const vertices = [];

        // this.object = new Group();

        for (let i = 0; i < count; i++) {
            let y = limit;
            let x = 0;
            let z = 0;
            while (y >= limit) {
                x = -50 + Math.random() * 100;
                z = -50 + Math.random() * 100;
                y = terrainBufferGeometry.getHeightAt(x, z);
            }
            vertices.push(x, y, z);

        }
        const sprite = new THREE.TextureLoader().load('./resources/stone.png');
        const material = new THREE.PointsMaterial({ size: 1.5, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true });
        // material.color.setRGB(0.5, 0.5, 0.5);
        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        this.object = new THREE.Points(geometry, material);
        this.object.translateY(-4.7);
    }

    update() {

    }


    //     const stoneClone = stone.clone();

    //     stoneClone.traverse((child: any) =>{
    //         if (child.isMesh) {
    //             child.castShadow = true;
    //             child.receiveShadow = true;
    //         }
    //     });

    //     stoneClone.position.x = x;
    //     stoneClone.position.y = y - 0.4;
    //     stoneClone.position.z = z;

    //     stoneClone.rotation.y = Math.random() * (2 * Math.PI);
    //     stoneClone.scale.multiplyScalar(1.5 + Math.random() * 1);
    //     this.object.add(stoneClone);
    // }




    // const material = new THREE.MeshPhongMaterial();
    // const texture = new THREE.TextureLoader().load('/resources/stone.png');
    // material.map = texture;

    // const displacementMap = new THREE.TextureLoader().load('/resources/stone_heightmap.png');
    // material.displacementMap = displacementMap;

    // const plane = new THREE.Mesh(PlaneGeometry, material);
    // scene.add(plane);



    // const textureBump = () => {
    //     let texture1 = new THREE.TextureLoader().load('/resources/stone3.jpg');
    //     let texture2 = new THREE.TextureLoader().load('/resources/stone1.jpg');
    //     let geometry = new THREE.BoxGeometry(10, 10, 10, 30, 30, 30);
    //     let material = new THREE.MeshPhongMaterial({
    //         map: texture2,
    //         bumpMap: texture1,
    //         bumpScale: 0.3
    //     });

    //     const boxMesh = new THREE.Mesh(geometry, material);
    //     this.scene.add(boxMesh);
    // }



}