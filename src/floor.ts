import * as THREE from 'three'
import Entity from './entity';

class Floor implements Entity {
    public mesh: THREE.Mesh;
    private geometry = new THREE.PlaneGeometry(10, 10);
    private material = new THREE.MeshLambertMaterial();
        

    constructor(pos: THREE.Vector3) {
        this.mesh = new THREE.Mesh();
        let geomesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.set(pos.x, pos.y, pos.z);
        geomesh.rotation.x = -Math.PI/2;
        this.mesh.add(geomesh);
    }
    update(time: number): void {
        this.mesh.rotation.y += 0.001;
    }
}

export default Floor;