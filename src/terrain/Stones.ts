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
        const material = new THREE.PointsMaterial({
            size: 1.5,
            sizeAttenuation: true,
            map: sprite,
            alphaTest: 0.5,
            transparent: true
        });

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

        this.object = new THREE.Points(geometry, material);
        this.object.translateY(-4.7);
    }

    update() {

    }
}