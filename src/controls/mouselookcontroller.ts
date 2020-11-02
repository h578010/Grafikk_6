import * as THREE from 'three'
import { Quaternion, Vector3 } from 'three';

class MouseLookController {
    static domElement: any;
    static update(pitch: number, yaw: number) {
        throw new Error('Method not implemented.');
    }
    camera: any;
    pitchQuaternion: any;
    yawQuaternion: any;
    FD: THREE.Vector3;
    UD: THREE.Vector3;
    LD: THREE.Vector3;

    static toDegrees(radians: number) {
        return radians * (180 / Math.PI);
    }

    static toRadians(degrees: number) {
        return degrees / (180 / Math.PI);
    }

    constructor(camera: any) {
        this.camera = camera;

        this.FD = new Vector3(0, 0, 1);
        this.UD = new Vector3(0, 1, 0);
        this.LD = new Vector3(1, 0, 0);

        this.pitchQuaternion = new Quaternion();
        this.yawQuaternion = new Quaternion();
    }
    update(pitch: number, yaw: number) {

        this.pitchQuaternion.setFromAxisAngle(this.LD, -pitch);
        this.yawQuaternion.setFromAxisAngle(this.UD, -yaw);
        this.camera.setRotationFromQuaternion(this.yawQuaternion.multiply(this.camera.quaternion.multiply(this.pitchQuaternion)));
    }

}

export default MouseLookController;