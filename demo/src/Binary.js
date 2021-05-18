export var Binary;
(function (Binary) {
    function binaryToInt(binaryString) {
        if (binaryString.length > 32)
            throw new TypeError("Data too large to be converted to 32-bit integer");
        return binaryString.reduce((prev, value, idx) => value === 0 ? prev : (prev + Math.pow(2, (binaryString.length - 1) - idx)), 0);
    }
    Binary.binaryToInt = binaryToInt;
    function parseBinary(str) {
        return binaryToInt(Array.from(str).map(parseInt));
    }
    Binary.parseBinary = parseBinary;
    function toBinary(val, wordSize = 32) {
        if (val > Math.pow(2, wordSize))
            throw new TypeError("unexpected number size");
        return Array(wordSize).fill(1).map((_, idx) => (val & Math.pow(2, idx)) >> idx).reverse();
    }
    Binary.toBinary = toBinary;
})(Binary || (Binary = {}));
