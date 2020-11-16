import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { AmbientLight, ByteType, Group, Material, Mesh, MeshBasicMaterial, MeshLambertMaterial, PCFSoftShadowMap, PlaneBufferGeometry, PointLight, RepeatWrapping, SphereGeometry, TextureLoader, Vector3 } from 'three';
import MouseLookController from './controls/mouselookcontroller';
import TextureSplattingMaterial from './terrain/SplattingMaterial';
import { Controller } from './controls/controller';
import { Trees } from './terrain/Trees';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Grass } from './terrain/Grass';
import { Lava } from './terrain/Lava';
import * as dat from 'dat.gui';
import Sun from './sun';
import { Stones } from './terrain/Stones';
import { ParticleEmitter } from './particleEmitter';
import Bat from './bat';
import Unicorn from './unicorn';
import Rock from './terrain/Rock';

class Animation {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private loop: (timestamp: number) => void;
    private entities: Entity[] = [];
    private controller: Controller;
    private unicorn: Unicorn;
    private uniEnabled = false;

    constructor() {
        this.scene = new THREE.Scene();
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x202050, 1);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        this.controller = new Controller(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        let self = this;

        // Raycaster that moves around a unicorn in the scene:
        const raycaster = new THREE.Raycaster();
        const onclick = function (event: any) {
            if (self.uniEnabled) {
                let x = (event.clientX / window.innerWidth) * 2 - 1;
                let y = - (event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera(new THREE.Vector2(x, y), self.camera);
                const intersects = raycaster.intersectObjects(self.scene.children);
                if (intersects.length > 0) {
                    let point = intersects[0].point;
                    self.moveUnicorn(point);
                }
            }
        }
        window.addEventListener('click', onclick, false);

        // Skybox:
        new Skybox(this.scene);
        let sun = new Sun();
        this.addEntity(sun);

        // Light:
        let light = new AmbientLight('0xffffff', 0.6);
        this.scene.add(light);

        // Lava:
        let lava = new Lava();
        this.addEntity(lava);

        // Animated bat flying around the volcano:
        let bat = new Bat()
        this.addEntity(bat);

        // A rock with bumpmap/normalmap:
        let rock = new Rock();
        this.addEntity(rock);

        // Unicorn:
        this.unicorn = new Unicorn();
        this.addEntity(this.unicorn);

        // Button for fog and raycaster:
        const params = {
            enableFog: false,   
            enableUni: false
        };
        const gui = new dat.GUI();
        let fogController = gui.add(params, 'enableFog').name('Enable fog');
        fogController.onChange((fog) => {
            if (fog) {
                const color = 0xFFFFFF;
                const near = 10;
                const far = 100;
                this.scene.fog = new THREE.Fog(color, near, far);
            } else {
                this.scene.fog = null;
            }
        });
        let uniController = gui.add(params, 'enableUni').name('Enable raycaster');
        uniController.onChange((uni) => {
            this.uniEnabled = uni;
        });

        // Smoke from the vulcano:
        const smoke = new ParticleEmitter({
            amount: 10,
            velocity: new Vector3(0, 1, 0),
            textureURL: './resources/Particles/smoke3.png',
            pos: new Vector3(-4, 10, 0),
            maxAge: 50000,
            angle: Math.PI / 2,
            growth: 0.4,
            gravity: 0,
            width: 6,
            startOpacity: 0.6,
            endOpacity: 0,
            fadeInTime: 1000
        });
        this.addEntity(smoke);

        // Sparks from the lava:
        const sparks = new ParticleEmitter({
            amount: 50,
            velocity: new Vector3(0, 50, 0),
            textureURL: './resources/Particles/spark.png',
            pos: new Vector3(-2, 6, 0),
            maxAge: 10000,
            angle: Math.PI / 4,
            growth: 0,
            gravity: -25,
            width: 10
        });
        sparks.object.scale.x = 0.4;
        sparks.object.scale.y = 0.4;
        sparks.object.scale.z = 0.4;
        this.addEntity(sparks);

        // Ash erupting from the volcano:
        const ash = new ParticleEmitter({
            amount: 1,
            velocity: new Vector3(0, 2, 0),
            textureURL: './resources/Particles/ash4.png',
            pos: new Vector3(-4, 6, 0),
            maxAge: 120000,
            growth: 0,
            angle: Math.PI / 2,
            gravity: -0.03,
            width: 20
        });
        ash.object.scale.x = 0.2;
        ash.object.scale.y = 0.2;
        ash.object.scale.z = 0.2;
        this.addEntity(ash);

        // Add terrain:
        this.addTerrain();

        // Loop:
        let then = performance.now();
        this.loop = function (time: number) {
            let now = performance.now();
            self.draw(now - then);
            self.controller.update(now - then);
            then = now;
            requestAnimationFrame(self.loop);
        }.bind(this);
        window.requestAnimationFrame(this.loop);
    }

    // Function for moving the unicorn with the raycaster:
    moveUnicorn(point: Vector3) {
        this.unicorn.object.position.x = point.x;
        this.unicorn.object.position.y = point.y;
        this.unicorn.object.position.z = point.z;
    }

    // Function for adding terrain to the scene:
    async addTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/volcano.png');
        const width = 100;
        const terrainGeometry = new TerrainBufferGeometry(heightmapImage, width, 128, 20);
        const bacgroundGeometry = new PlaneBufferGeometry(500, 500);

        const grassTexture = new TextureLoader().load('resources/grass_02.png');
        grassTexture.wrapS = RepeatWrapping;
        grassTexture.wrapT = RepeatWrapping;
        grassTexture.repeat.set(5000 / width, 5000 / width);

        const snowyRockTexture = new TextureLoader().load('resources/rock_02.png');
        snowyRockTexture.wrapS = RepeatWrapping;
        snowyRockTexture.wrapT = RepeatWrapping;
        snowyRockTexture.repeat.set(1500 / width, 1500 / width);

        const splatMap = new TextureLoader().load('resources/volcano.png');

        const backgroundTexture = new TextureLoader().load('resources/grass_02.png');
        backgroundTexture.wrapS = RepeatWrapping;
        backgroundTexture.wrapT = RepeatWrapping;
        backgroundTexture.repeat.set(25000 / width, 25000 / width);

        const terrainMaterial = new TextureSplattingMaterial(0x999999, 0, [grassTexture, snowyRockTexture], [splatMap]);
        const grassMaterial = new MeshBasicMaterial({ map: backgroundTexture });

        const terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        const backgroundMesh = new Mesh(bacgroundGeometry, grassMaterial);
        terrainMesh.receiveShadow = true;
        backgroundMesh.receiveShadow = true;

        this.scene.add(terrainMesh);
        terrainMesh.translateY(-5);
        this.scene.add(backgroundMesh);
        backgroundMesh.rotateX(-Math.PI / 2);
        backgroundMesh.translateZ(-4.8);

        // GLTF loader for trees:
        const loader = new GLTFLoader();
        let self = this;
        loader.load('./resources/Trees/scene.gltf', function (gltf) {
            gltf.scene.scale.x = 0.03;
            gltf.scene.scale.y = 0.03;
            gltf.scene.scale.z = 0.03;
            gltf.scene.translateY(-2);

            let group = new Group();
            group.add(gltf.scene);
            let trees = new Trees(terrainGeometry, 40, 1, group);
            self.addEntity(trees);
        });

        // Adding grass:
        let grass = new Grass(terrainGeometry, 10000, 1);
        self.addEntity(grass);

        // Adding stones:
        let stones = new Stones(terrainGeometry, 100, 1);
        self.addEntity(stones);
    }

    // Function for adding entities to the scene:
    addEntity(entity: Entity) {
        this.scene.add(entity.object);
        this.entities.push(entity);
    }

    // Draw function:
    draw(time: number) {
        this.renderer.render(this.scene, this.camera);
        this.entities.forEach((e) => {
            e.update(time)
        });
    }
}

export default Animation;