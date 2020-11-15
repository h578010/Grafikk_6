import Entity from 'src/entity';
import * as THREE from 'three'
import { Geometry, Group, InstancedMesh, MeshLambertMaterial, Object3D } from 'three';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import TerrainBufferGeometry from './TerrainBufferGeometry'

export class Trees implements Entity {
    public object: Object3D;
    terrain: TerrainBufferGeometry;
    count: number;
    limit: number;

    constructor(terrainBufferGeometry: TerrainBufferGeometry, count: number, limit: number, tree: Object3D) {
        this.terrain = terrainBufferGeometry;
        this.count = count;
        this.limit = limit;
        this.object = new Group();


        for (let i = 0; i < count; i++) {

            let y = limit;
            let x = 0;
            let z = 0;
            while (y >= limit) {
                x = -100 + Math.random() * 200;
                z = -100 + Math.random() * 200;
                y = terrainBufferGeometry.getHeightAt(x, z);
            }
            const treeClone = tree.clone();

            treeClone.traverse((child: any) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            treeClone.position.x = x;
            treeClone.position.y = y-0.4;
            treeClone.position.z = z;

            treeClone.rotation.y = Math.random() * (2 * Math.PI);

            treeClone.scale.multiplyScalar(1.5 + Math.random() * 1);

            this.object.add(treeClone);
        }
    }

    update() {
    }
}