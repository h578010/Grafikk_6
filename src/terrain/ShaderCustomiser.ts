import { ShaderChunk } from 'three';

export default class ShaderCustomiser {

    static customise(code: string, chunks:{ [key: string]: any; } = {}) {

        for (let name in chunks) {
            const chunk = chunks[name];
            
            if (typeof chunk === 'string') {
                code = this.replace(code, name, chunk);
            } else if (chunk.prepend) {
                code = this.prepend(code, name, chunk.text);
            } else if (chunk.append) {
                code = this.append(code, name, chunk.text);
            } else {
                code = this.replace(code, name, chunk.text);
            }
        }
        return code;
    }

    static prepend(code:string, name:string, text:string) {
        const chunk = ShaderChunk[name];

        if (typeof chunk !== 'undefined') {
            return code.replace(`#include <${name}>`,
            `
            ${text}
            #include <${name}>
            `
            );

        } else {
            console.warn(`Chunk: "${name}", was not found.`);
            return code;
        }
    }

    static replace(code:string, name:string, text:string) {
        const chunk = ShaderChunk[name];

        if (typeof chunk !== 'undefined') {
            return code.replace(`#include <${name}>`, text);
        } else {
            console.warn(`Chunk: "${name}", was not found.`);
            return code;
        }
    }

    static append(code:string, name:string, text:string) {
        const chunk = ShaderChunk[name];
        if (typeof chunk !== 'undefined') {       
            return code.replace(`#include <${name}>`,
            `
            #include <${name}>
            ${text}
            `
            );

        } else {
            console.warn(`Chunk: "${name}", was not found.`);
            return code;
        }
    }
};