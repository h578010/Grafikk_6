import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { Group, Mesh, MeshBasicMaterial, MeshLambertMaterial, PCFSoftShadowMap, PointLight, RepeatWrapping, SphereGeometry, TextureLoader, Vector3 } from 'three';
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

class Animation {
    private scene: THREE.Scene;
    private camera: THREE.Camera;
    private renderer: THREE.WebGLRenderer;
    private loop: (timestamp: number) => void;
    private entities: Entity[] = [];
    private controller: Controller;
    //private composer: EffectComposer;

    constructor() {
        this.scene = new THREE.Scene();
        let width = window.innerWidth;
        let height = window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        this.camera.position.z = 50;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x202050, 1);

        this.controller = new Controller(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        //let light = new THREE.PointLight(0xffffff, 10, 100);
        //light.position.set(50, 50, 50);
        //cathis.scene.add(light);

        new Skybox(this.scene);
        new Sun(this.scene);

        const params = {
            enableFog: false
        };

        let lava = new Lava();
        this.addEntity(lava);

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
        this.addTerrain();

        const gui = new dat.GUI();
        let fogController = gui.add(params, 'enableFog').name('Enable fog');
        fogController.onChange((fog) => {
            if (fog) {
                const color = 0xFFFFFF;
                const near = 10;
                const far = 200;
                this.scene.fog = new THREE.Fog(color, near, far);
            } else {
                this.scene.fog = null;
            }
        });

        const emit = new ParticleEmitter('./resources/Particles/smoke3.png', new Vector3(0, 0, 45), 10000, Math.PI/2, 0.2);
        emit.object.scale.x = 1;
        emit.object.scale.y = 1;
        emit.object.scale.z = 1;
        this.addEntity(emit);
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

        // const stoneTexture = new TextureLoader().load('resources/stone.png');
        // stoneTexture.wrapS = RepeatWrapping;
        // stoneTexture.wrapT = RepeatWrapping;
        // stoneTexture.repeat.set(5000 / width, 5000 / width);

        const splatMap = new TextureLoader().load('resources/volcano.png');

        const terrainMaterial = new TextureSplattingMaterial(0xffffff, 0, [grassTexture, snowyRockTexture], [splatMap]);

        let terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
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