export var Base32;
(function (Base32) {
    const dictionary = { "2": 26, "3": 27, "4": 28, "5": 29, "6": 30, "7": 31, "A": 0, "B": 1, "C": 2, "D": 3, "E": 4, "F": 5, "G": 6, "H": 7, "I": 8, "J": 9, "K": 10, "L": 11, "M": 12, "N": 13, "O": 14, "P": 15, "Q": 16, "R": 17, "S": 18, "T": 19, "U": 20, "V": 21, "W": 22, "X": 23, "Y": 24, "Z": 25 };
    function decode(data) {
        let numbers = Array.from(data).map(char => dictionary[char.toUpperCase()]);
        let binary = numbers.flatMap(num => toBinary(num));
        let numBytes = Math.floor(binary.length / 8);
        let buffer = Array(numBytes).fill(0).map((_, idx) => binary.slice(idx * 8, (idx + 1) * 8).join(''));
        let bytes = buffer.map(parseBinary);
        return new Uint8Array(bytes);
    }
    Base32.decode = decode;
    function parseBinary(str) {
        return Array.from(str).reduce((prev, char, idx) => prev + (char === '0' ? 0 : Math.pow(2, (str.length - 1) - idx)), 0);
    }
    Base32.parseBinary = parseBinary;
    function toBinary(val, wordSize = 5) {
        if (val > Math.pow(2, wordSize))
            throw new TypeError("unexpected number size");
        return Array(wordSize).fill(1).map((_, idx) => (val & Math.pow(2, idx)) >> idx).reverse();
    }
    Base32.toBinary = toBinary;
})(Base32 || (Base32 = {}));
