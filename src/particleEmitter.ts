import { AdditiveBlending, Group, Material, MultiplyBlending, NormalBlending, Object3D, Sprite, SpriteMaterial, Texture, TextureLoader, Vector3 } from "three";
import Entity from "./entity";

class Particle {
    private velocity: Vector3;
    public sprite: Sprite;
    public age = 0;
    private rotation: number;
    private growth: number;

    constructor(velocity: Vector3, material: SpriteMaterial, rotation: number, growth:number) {
        this.velocity = velocity;
        this.sprite = new Sprite(material);
        this.rotation = rotation;
        this.growth = growth;
    }

    update(delta: number) {
        let move = this.velocity.clone();
        move.multiplyScalar(delta/1000);
        this.sprite.position.add(move);
        this.age += delta;
        this.sprite.material.rotation += this.rotation*delta/100000;
        this.sprite.scale.x = 1 + this.age/1000 * this.growth;
        this.sprite.scale.y = 1 + this.age/1000 * this.growth;
        this.sprite.scale.z = 1 + this.age/1000 * this.growth;
    }
}

export class ParticleEmitter implements Entity{
    private spriteMaterial: SpriteMaterial;
    public object: Object3D;
    private particles: Particle[] = [];
    private i = 0;
    private maxAge: number;
    private angle: number;
    private growth: number;

    constructor(textureURL: string, pos: Vector3, maxAge: number, angle: number, growth: number) {
        const texture = new TextureLoader().load(textureURL);
        this.spriteMaterial = new SpriteMaterial(
            {
                map: texture, 
                blending: NormalBlending
            });
        this.maxAge = maxAge;
        this.angle = angle;
        this.growth = growth;
        this.object = new Group();
        this.object.position.x = pos.x;
        this.object.position.y = pos.y;
        this.object.position.z = pos.z;
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
            let velocity = new Vector3(0, 1, 0);
            velocity.applyAxisAngle(new Vector3(0, 0, 1), this.angle * (Math.random()-0.5));
            velocity.applyAxisAngle(new Vector3(1, 0, 0), this.angle * (Math.random()-0.5));
            let p = new Particle(velocity, this.spriteMaterial, Math.random(), this.growth);
            this.particles.push(p);
            this.object.add(p.sprite);
        }
    }
}