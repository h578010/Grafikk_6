import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import { forEachChild } from 'typescript';
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { Mesh, PCFSoftShadowMap, RepeatWrapping, TextureLoader, Vector3 } from 'three';
import MouseLookController from './controls/mouselookcontroller';
import TextureSplattingMaterial from './terrain/SplattingMaterial';
import { Controller } from './controls/controller';

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

        this.controller = new Controller(this.camera, this.renderer.domElement);

        document.body.appendChild(this.renderer.domElement);

        let light = new THREE.PointLight(0xffffff, 10, 100);
        light.position.set(50, 50, 50);
        this.scene.add(light);

        new Skybox(this.scene);

        let then = performance.now(); 

        let self = this;
        this.loop = function (time: number) {
            self.draw(time);
            let now = performance.now();
            self.controller.update(now-then);
            then = now;
            requestAnimationFrame(self.loop);
        }.bind(this);
        window.requestAnimationFrame(this.loop);
        this.addTerrain();
    }

    async addTerrain() {
        const heightmapImage = await Utilities.loadImage('resources/volcano.png');
        const width = 100;
        const terrainGeometry = new TerrainBufferGeometry(heightmapImage, width, 128, 20);
        const grassTexture = new TextureLoader().load('resources/grass_02.png');
        grassTexture.wrapS = RepeatWrapping;
        grassTexture.wrapT = RepeatWrapping;
        grassTexture.repeat.set(5000 / width, 5000 / width);

        const snowyRockTexture = new TextureLoader().load('resources/snowy_rock_01.png');
        snowyRockTexture.wrapS = RepeatWrapping;
        snowyRockTexture.wrapT = RepeatWrapping;
        snowyRockTexture.repeat.set(1500 / width, 1500 / width);

        const splatMap = new TextureLoader().load('resources/volcano.png');

        const terrainMaterial = new TextureSplattingMaterial(0xffffff, 0, [grassTexture, snowyRockTexture], [splatMap]);
    
        let terrainMesh = new Mesh(terrainGeometry, terrainMaterial);
        this.scene.add(terrainMesh);
        terrainMesh.translateY(-5);
    }

    addEntity(entity: Entity) {
        this.scene.add(entity.mesh);
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