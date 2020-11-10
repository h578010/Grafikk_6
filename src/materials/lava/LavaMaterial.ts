import THREE, { ShaderMaterial, TextureLoader, Vector2, Vector3, RepeatWrapping, Texture } from "three";
import vertexshader from './VertexShader'
import fragmentshader from './FragmentShader'

export class LavaMaterial {
   
    private uniforms: any = null;

    constructor() {
        
        
    }

    async loadTexture(url: string): Promise <Texture> {
        const textureLoader = new TextureLoader();
        return new Promise((accept, reject) => {
            textureLoader.load(url, (texture) => {
                if (texture) {
                    accept(texture);
                } 
                reject();
            });
        });
    }

    async getMaterial() {
        const cloudTexture = 
        
        this.uniforms = {
            "fogDensity": { value: 0.45 },
            "fogColor": { value: new Vector3( 0, 0, 0 ) },
            "time": { value: 1.0 },
            "uvScale": { value: new Vector2( 3.0, 1.0 ) },
            "texture1": { value: await this.loadTexture('./resources/Lava/cloud.png') },
            "texture2": { value: await this.loadTexture( './resources/Lava/lavatile.jpg') }
        };

        this.uniforms[ "texture1" ].value.wrapS = this.uniforms[ "texture1" ].value.wrapT = RepeatWrapping;
        this.uniforms[ "texture2" ].value.wrapS = this.uniforms[ "texture2" ].value.wrapT = RepeatWrapping;

        const size = 0.65;

        let material = new ShaderMaterial( {
            uniforms: this.uniforms,
            vertexShader: vertexshader,
            fragmentShader: fragmentshader
        });

        return material;
    }

    updateTime(delta: number) {
        this.uniforms['time'].value += 0.2 * delta;
    }
}