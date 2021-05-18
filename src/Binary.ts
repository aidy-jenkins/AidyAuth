export module Binary {
    /** 
     * Converts an array of 0s and 1s to its integer representation, e.g. [1,0,1] -> 5 
     * @param binaryString the array of binary digits to convert into an integer, supports max length of 32
    */
     export function binaryToInt(binaryString: number[]) {
        if(binaryString.length > 32) 
            throw new TypeError("Data too large to be converted to 32-bit integer");

        return binaryString.reduce((prev, value, idx) => value === 0 ? prev : (prev + Math.pow(2, (binaryString.length - 1) - idx)), 0);
    }

    /** 
     * Parses a binary string to a 32-bit integer, e.g. "101" -> 5
     * @param str the string to be parsed into an integer
     */
    export function parseBinary(str: string) {
        return binaryToInt(Array.from(str).map(parseInt));
    }

    /**
     * Converts an integer number to an array of binary digits with configurable word size (defaulting to 32-bit)
     * e.g. 5 -> [0,0,....,1,0,1]
     * @param val The value to be converted to binary
     * @param wordSize The length (in digits) of the binary number (defaults to 32-bit)
     */
    export function toBinary(val: number, wordSize = 32) {
        if(val > Math.pow(2, wordSize)) 
            throw new TypeError("unexpected number size");

        return Array(wordSize).fill(1).map((_, idx) => (val & Math.pow(2, idx)) >> idx).reverse();
    }
}