import Entity from 'src/entity';
import * as THREE from 'three'
import { Geometry, InstancedMesh, MeshLambertMaterial } from 'three';
import TerrainBufferGeometry from './TerrainBufferGeometry'

export class Trees implements Entity {
    public object: InstancedMesh;
    terrain: TerrainBufferGeometry;
    count: number;
    limit: number;

    constructor(terrainBufferGeometry: TerrainBufferGeometry, count: number, limit: number, treeGeometry: Geometry) {
        this.terrain = terrainBufferGeometry;
        this.count = count;
        this.limit = limit;
        this.object = new InstancedMesh(treeGeometry, new MeshLambertMaterial(), count);
        this.object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

        const dummy = new THREE.Object3D();
        for (let i = 0; i < count; i++) {
            
            let y = limit;
            let x = 0;
            let z = 0;
            while (y >= limit) {
                x = -50 + Math.random()*100;
                z = -50 + Math.random()*100;
                y = terrainBufferGeometry.getHeightAt(x, z);
            }
            dummy.position.set(x, y, z);
            dummy.updateMatrix();
			this.object.setMatrixAt(i, dummy.matrix);
        }
    }

    update() {        
    }
}