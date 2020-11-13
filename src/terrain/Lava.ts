import Entity from 'src/entity';
import LavaMaterial from '../../src/materials/lava/LavaMaterial';
import * as THREE from 'three'
import { Group, Mesh, Object3D } from 'three';

export class Lava implements Entity{
    public object: Object3D;
    private lavaMaker: LavaMaterial;

    constructor() {
        this.object = new Group();
        let sphereGeometry = new THREE.SphereBufferGeometry(9.5, 20, 20);
        sphereGeometry.scale(1, 1, 0.05);
        sphereGeometry.translate(0, 0, -4);
        this.lavaMaker = new LavaMaterial();
        let sphereMaterial = this.lavaMaker.getMaterial();
        let sphere = new Mesh(sphereGeometry, sphereMaterial);
        this.object.add(sphere);
        this.object.rotateX(Math.PI/2);
    }

    update(time: number) {
        this.lavaMaker.updateTime(time/100);
    }
}