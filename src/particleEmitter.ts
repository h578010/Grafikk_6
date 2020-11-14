import { AdditiveBlending, Group, Material, MultiplyBlending, NormalBlending, Object3D, Sprite, SpriteMaterial, Texture, TextureLoader, Vector3 } from "three";
import Entity from "./entity";

class Particle {
    private velocity: Vector3;
    public sprite: Sprite;
    public age = 0;
    private rotation: number;
    private growth: number;
    private maxAge: number;
    private gravity: number;

    constructor(velocity: Vector3, texture: Texture, rotation: number, growth:number, maxAge: number, gravity: number) {
        this.velocity = velocity;
        let spriteMaterial = new SpriteMaterial(
            {
                map: texture, 
                blending: NormalBlending, 
                transparent: true
            });
        this.sprite = new Sprite(spriteMaterial);
        this.rotation = rotation;
        this.growth = growth;
        this.maxAge = maxAge;
        this.gravity = gravity;
    }

    update(delta: number) {
        let move = this.velocity.clone();
        move.multiplyScalar(delta/1000);
        this.sprite.position.add(move);
        this.age += delta;
        this.sprite.material.rotation += this.rotation*delta/1000;
        this.sprite.scale.x = 1 + this.age/1000 * this.growth;
        this.sprite.scale.y = 1 + this.age/1000 * this.growth;
        this.sprite.scale.z = 1 + this.age/1000 * this.growth;
        this.sprite.material.opacity = (1 - this.age/this.maxAge);
        this.velocity.add(new Vector3(0, this.gravity*delta/1000, 0));
    }
}

interface EmitterParams {
    velocity: Vector3, 
    textureURL: string, 
    pos: Vector3, 
    maxAge: number, 
    angle?: number, 
    growth: number, 
    gravity?: number, 
    width?: number
}

export class ParticleEmitter implements Entity{
    private texture: Texture;
    public object: Object3D;
    private particles: Particle[] = [];
    private i = 0;
    private maxAge: number;
    private angle: number;
    private growth: number;
    private gravity: number;
    private velocity: Vector3;
    private width: number;

    constructor(params: EmitterParams) {
        this.velocity = params.velocity;
        this.texture = new TextureLoader().load(params.textureURL);
        this.maxAge = params.maxAge;
        this.angle = params.angle? params.angle:0;
        this.growth = params.growth;
        this.gravity = params.gravity? params.gravity:0;
        this.width = params.width? params.width: 0;
        this.object = new Group();
        this.object.position.x = params.pos.x;
        this.object.position.y = params.pos.y;
        this.object.position.z = params.pos.z;
    }

    update(delta: number) {
        
        this.particles.forEach((p) => {
            p.update(delta);
            if (p.age >= this.maxAge) {
                this.object.remove(p.sprite);
            }
        });
        this.particles = this.particles.filter((p) => {
            return p.age < this.maxAge;
        });

        if (this.i++ % 2 == 0) {
            let velocity = this.velocity.clone();
            velocity.applyAxisAngle(new Vector3(0, 0, 1), this.angle * (Math.random()-0.5));
            velocity.applyAxisAngle(new Vector3(1, 0, 0), this.angle * (Math.random()-0.5));
            let p = new Particle(velocity, this.texture, (Math.random()-0.5)*0.5, this.growth, this.maxAge, this.gravity);
            p.sprite.position.x = (Math.random()-0.5) * this.width;
            p.sprite.position.z = (Math.random()-0.5) * this.width;
            this.particles.push(p);
            this.object.add(p.sprite);
        }
    }
}