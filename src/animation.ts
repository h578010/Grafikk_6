import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { AmbientLight, ByteType, Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, PCFSoftShadowMap, PointLight, RepeatWrapping, SphereGeometry, TextureLoader, Vector3 } from 'three';
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

class Animation {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private loop: (timestamp: number) => void;
    private entities: Entity[] = [];
    private controller: Controller;

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

        new Skybox(this.scene);
        let sun = new Sun();
        this.addEntity(sun);

        let light = new AmbientLight('0xffffff', 0.6);
        this.scene.add(light);

        let lava = new Lava();
        this.addEntity(lava);

        let bat = new Bat()
        this.addEntity(bat);

        let unicorn = new Unicorn();
        this.addEntity(unicorn);

        // Button for fog:
        const params = {
            enableFog: false
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

        // Add smoke from the vulcano:
        const smoke = new ParticleEmitter({
            velocity: new Vector3(0, 1, 0),
            textureURL: './resources/Particles/smoke3.png', 
            pos: new Vector3(-4, 10, 0), 
            maxAge: 50000, 
            angle: Math.PI/2, 
            growth: 0.4, 
            gravity: 0, 
            width: 6,
            startOpacity: 0.6,
            endOpacity: 0,
            fadeInTime: 1000
        });
        this.addEntity(smoke);

        // Add sparks from the lava:
        const sparks = new ParticleEmitter({
            velocity: new Vector3(0, 10, 0),
            textureURL: './resources/Particles/spark.png', 
            pos: new Vector3(-4, 8, 0), 
            maxAge: 10000, 
            angle: Math.PI/2, 
            growth: 0.2, 
            gravity: -5, 
            width: 20
        });
        sparks.object.scale.x = 0.05;
        sparks.object.scale.y = 0.05;
        sparks.object.scale.z = 0.05;
        this.addEntity(sparks);

        // Add ash rain:
        const ash = new ParticleEmitter({
            velocity: new Vector3(0, 0, 0),
            textureURL: './resources/Particles/ash2.png', 
            pos: new Vector3(-4, 40, 0),
            maxAge: 10000,
            growth: 0,
            gravity: -1,
            width: 200
        });
        ash.object.scale.x = 2;
        ash.object.scale.y = 2;
        ash.object.scale.z = 2;
        this.addEntity(ash);

        // Add terrain:
        this.addTerrain();

        // Loop:
        let then = performance.now();
        let self = this;
        this.loop = function (time: number) {
            let now = performance.now();
            self.draw(now - then);
            self.controller.update(now - then);
            then = now;
            requestAnimationFrame(self.loop);
        }.bind(this);
        window.requestAnimationFrame(this.loop);
    }

    async addTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/volcano.png');
        const width = 100;
        const terrainGeometry = new TerrainBufferGeometry(heightmapImage, width, 128, 20);
        const grassTexture = new TextureLoader().load('resources/grass_02.png');
        grassTexture.wrapS = RepeatWrapping;
        grassTexture.wrapT = RepeatWrapping;
        grassTexture.repeat.set(5000 / width, 5000 / width);

        const snowyRockTexture = new TextureLoader().load('resources/rock_02.png');
        snowyRockTexture.wrapS = RepeatWrapping;
        snowyRockTexture.wrapT = RepeatWrapping;
        snowyRockTexture.repeat.set(1500 / width, 1500 / width);

        const splatMap = new TextureLoader().load('resources/volcano.png');

        const terrainMaterial = new TextureSplattingMaterial(0xffffff, 0, [grassTexture, snowyRockTexture], [splatMap]);

        let terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        terrainMesh.receiveShadow = true;
        this.scene.add(terrainMesh);
        terrainMesh.translateY(-5);

        const loader = new GLTFLoader();
        let self = this;
        loader.load('./resources/Trees/scene.gltf', function (gltf) {
            gltf.scene.scale.x = 0.03;
            gltf.scene.scale.y = 0.03;
            gltf.scene.scale.z = 0.03;
            gltf.scene.translateY(-2);

            let group = new Group();
            group.add(gltf.scene);
            let trees = new Trees(terrainGeometry, 20, 1, group);
            self.addEntity(trees);
        });

        let grass = new Grass(terrainGeometry, 10000, 1);
        self.addEntity(grass);

        let stones = new Stones(terrainGeometry, 100, 1);
        self.addEntity(stones);
    }

    addEntity(entity: Entity) {
        this.scene.add(entity.object);
        this.entities.push(entity);
    }

    draw(time: number) {
        this.renderer.render(this.scene, this.camera);
        this.entities.forEach((e) => {
            e.update(time)
        });
    }
}

export default Animation;