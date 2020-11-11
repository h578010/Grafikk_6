import THREE, { ShaderMaterial, TextureLoader, Vector2, Vector3, RepeatWrapping, Texture } from "three";
import vertexshader from './VertexShader'
import fragmentshader from './FragmentShader'

export default class LavaMaterial {
    private uniforms: any = null;

    constructor() {
        
    }

    getMaterial() {
        const textureLoader = new TextureLoader();
        
        this.uniforms = {
            "fogDensity": { value: 0.015 },
			"fogColor": { value: new Vector3( 1, 1, 1 ) },
            "time": { value: 1.0 },
            "uvScale": { value: new Vector2( 3.0, 1.0 ) },
            "texture1": { value: textureLoader.load('./resources/Lava/cloud.png') },
            "texture2": { value: textureLoader.load( './resources/Lava/lavatile.jpg') }
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