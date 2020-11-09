import { Camera, Vector3 } from "three";
import MouseLookController from "./mouselookcontroller";

const mouseSensitivity = 0.001;

export class Controller {
    camera: Camera;
    mouseLookController: MouseLookController;
    canvas: HTMLCanvasElement;
    yaw = 0;
    pitch = 0;
    move = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        up: false,
        down: false,
        speed: 0.01
    };
    velocity = new Vector3(0.0, 0.0, 0.0);
    mouseControl = false;

    constructor(camera:Camera, canvas:HTMLCanvasElement) {
        this.camera = camera;
        this.mouseLookController = new MouseLookController(camera);
        this.canvas = canvas;

        this.canvas.addEventListener('click', () => {
            this.canvas.requestPointerLock();
        });
        canvas.addEventListener('mousemove', (event: MouseEvent) => {
            if (this.mouseControl) {
                this.yaw += event.movementX * mouseSensitivity;
                this.pitch += event.movementY * mouseSensitivity;
            }
            
        });

        document.addEventListener('pointerlockchange', () => {
            this.mouseControl = !this.mouseControl;
        });

        window.addEventListener('keydown', (ev) => {
            ev.preventDefault;
            if (ev.key === 'w') {
                this.move.forward = true;
            } else if (ev.key === 's') {
                this.move.backward = true;
            } else if (ev.key === 'a') {
                this.move.left = true;
            } else if (ev.key === 'd') {
                this.move.right = true;
            } else if (ev.key === 'z') {
                this.move.down = true;
            } else if (ev.key === 'x') {
                this.move.up = true;
            }
        }, true);

        window.addEventListener('keyup', (ev) => {
            ev.preventDefault;
            if (ev.key === 'w') {
                this.move.forward = false;
            } else if (ev.key === 's') {
                this.move.backward = false;
            } else if (ev.key === 'd') {
                this.move.right = false;
            } else if (ev.key === 'a') {
                this.move.left = false;
            } else if (ev.key === 'z') {
                this.move.down = false;
            } else if (ev.key === 'x') {
                this.move.up = false;
            }
        }, true);

    }

    updateCameraRotation(event: MouseEvent) {
        console.log("kamera");
        console.log(event);
        console.log(event.movementX);
        console.log(this.yaw);
        this.yaw += event.movementX * mouseSensitivity;
        console.log(this.yaw);
        this.pitch += event.movementY * mouseSensitivity;
    }

    update(delta: number) {
        const moveSpeed = this.move.speed * delta;
        this.velocity.set(0.0, 0.0, 0.0);

        if (this.move.left) {
            this.velocity.x -= moveSpeed;
        }
        if (this.move.right) {
            this.velocity.x += moveSpeed;
        }
        if (this.move.forward) {
            this.velocity.z -= moveSpeed;
        }
        if (this.move.backward) {
            this.velocity.z += moveSpeed;
        }
        if (this.move.up) {
            this.velocity.y += moveSpeed;
        }
        if (this.move.down) {
            this.velocity.y -= moveSpeed;
        }

        // update controller rotation.
        this.mouseLookController.update(this.pitch, this.yaw);
        this.yaw = 0;
        this.pitch = 0;

        // apply rotation to velocity vector, and translate moveNode with it.
        this.velocity.applyQuaternion(this.camera.quaternion);
        this.camera.position.add(this.velocity);
    }
}