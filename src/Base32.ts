import { Binary } from "./Binary.js";

export module Base32 {
    const dictionary = {"2":26,"3":27,"4":28,"5":29,"6":30,"7":31,"A":0,"B":1,"C":2,"D":3,"E":4,"F":5,"G":6,"H":7,"I":8,"J":9,"K":10,"L":11,"M":12,"N":13,"O":14,"P":15,"Q":16,"R":17,"S":18,"T":19,"U":20,"V":21,"W":22,"X":23,"Y":24,"Z":25};
    const encodeDictionary = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","2","3","4","5","6","7"];

    /**
     * Decodes a Base32 encoded string as a Uint8Array of bytes
     * @param data 
     * @returns 
     */
    export function decode(data: string) {
        let numbers = (Array.from(data) as (keyof (typeof dictionary))[]).map(char => dictionary[char.toUpperCase()]);

        let binary = numbers.flatMap(num => Binary.toBinary(num, 5));
        let numBytes = Math.floor(binary.length / 8);

        let buffer = Array(numBytes).fill(0).map((_, idx) => binary.slice(idx * 8, (idx + 1) * 8));
        let bytes = buffer.map(Binary.binaryToInt);

        return new Uint8Array(bytes);
    }

    /** 
     * Encodes a series of bytes as a Base32 string. Does not currently support padding, data must be a multiple of 5 in length
     * @param data The bytes to be encoded as a Base32 string
     */
    export function encode(data: Uint8Array) {
        let binary = Array.prototype.flatMap.call(data, byte => Binary.toBinary(byte)) as number[];
        if(binary.length % 5 !== 0)
            throw new TypeError("Padding support not yet implemented, number of bytes must be divisible by 5");

        let numChars = binary.length / 5;

        let buffer = Array(numChars).fill(0).map((_, idx) => binary.slice(idx * 5, (idx + 1) * 5));
        let base32Array = buffer.map(Binary.binaryToInt).map(chunk => encodeDictionary[chunk]);

        return base32Array.join('');
    }

    
}