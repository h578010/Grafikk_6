import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import { forEachChild } from 'typescript';
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { Mesh, Vector3 } from 'three';
import MouseLookController from './controls/mouselookcontroller';

class Animation {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private loop: (timestamp: number) => void;
    private entities:Entity[] = [];

    constructor() {
        this.scene = new THREE.Scene();
        let width = window.innerWidth;
        let height = window.innerHeight - 200; 
        this.camera = new THREE.PerspectiveCamera( 50, width / height, 0.1, 1000 );
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( width, height );
        this.renderer.setClearColor (0x202050, 1);
        
        document.body.appendChild( this.renderer.domElement );

        let light = new THREE.PointLight( 0xffffff, 10, 100 );
        light.position.set( 50, 50, 50 );
        this.scene.add( light );

        new Skybox(this.scene);
        
        let self = this;
        this.loop = function(time:number) {
            self.draw(time);
            requestAnimationFrame(self.loop);
        }.bind(this);
        window.requestAnimationFrame(this.loop);

        this.renderer.domElement.addEventListener('mousemove', (ev) => {
            this.camera.rotation.y = ev.offsetX/100;
        }, true);

        this.addTerrain();
        
        const mouseLookController = new MouseLookController(this.camera);
        const canvas = this.renderer.domElement;

        canvas.addEventListener('click', () => {
            canvas.requestPointerLock();
        });

        let yaw = 0;
        let pitch = 0;
        const mouseSensitivity = 0.001;

        function updateCameraRotation(event: { movementX: number; movementY: number; }) {
            yaw += event.movementX * mouseSensitivity;
            pitch += event.movementY * mouseSensitivity;
        }

        document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === canvas) {
                canvas.addEventListener('mousemove', updateCameraRotation, false);
            } else {
                canvas.removeEventListener('mousemove', updateCameraRotation, false);
            }
        });

        let move = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            speed: 0.01
        };

        window.addEventListener('keydown', (ev) => {
            ev.preventDefault;
            if (ev.key === 'w') {
                move.forward = true;
            } else if (ev.key === 's') {
                move.backward = true;
            } else if (ev.key === 'a') {
                move.left = true;
            } else if (ev.key === 'd') {
                move.right = true;
            }
        }, true);

        window.addEventListener('keyup', (ev) => {
            ev.preventDefault;
            if (ev.key === 'w') {
                move.forward = false;
            } else if (ev.key === 's') {
                move.backward = false;
            } else if (ev.key === 'd') {
                move.right = false;
            } else if (ev.key === 'a') {
                move.left = false;
            }
        }, true);

        const velocity = new Vector3(0.0, 0.0, 0.0);

        let then = performance.now();
        const loop = (now: number) => {

            const delta = now - then;
            then = now;

            const moveSpeed = move.speed * delta;

            velocity.set(0.0, 0.0, 0.0);

            if (move.left) {
                velocity.x -= moveSpeed;
            }

            if (move.right) {
                velocity.x += moveSpeed;
            }

            if (move.forward) {
                velocity.z -= moveSpeed;
            }

            if (move.backward) {
                velocity.z += moveSpeed;
            }

            // update controller rotation.
            mouseLookController.update(pitch, yaw);
            yaw = 0;
            pitch = 0;

            // apply rotation to velocity vector, and translate moveNode with it.
            velocity.applyQuaternion(this.camera.quaternion);
            this.camera.position.add(velocity);

            // render scene:
            this.renderer.render(this.scene, this.camera);

            requestAnimationFrame(loop);

        };

        loop(performance.now());

    }

    async addTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/volcano.png');
        const width = 100;
        const terrainGeometry = new TerrainBufferGeometry(heightmapImage, width, 128, 20);
        let terrainMesh = new Mesh(terrainGeometry, new THREE.MeshLambertMaterial());
        this.scene.add(terrainMesh);
        terrainMesh.translateY(-5);
    }

    addEntity(entity:Entity) {
        this.scene.add(entity.mesh);
        this.entities.push(entity);
    }

    draw(time:number) {
        this.renderer.render( this.scene, this.camera );

        this.entities.forEach((e) => {
            e.update(time)
        });
    }
}

export default Animation;