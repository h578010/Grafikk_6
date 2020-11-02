import * as THREE from 'three'
import Skybox from './skybox'
import Entity from './entity'
import { forEachChild } from 'typescript';
import Utilities from './lib/Utilities';
import TerrainBufferGeometry from './terrain/TerrainBufferGeometry';
import { Mesh } from 'three';

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