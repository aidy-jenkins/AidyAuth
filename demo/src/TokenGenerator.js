import { Binary } from "./Binary.js";
export class TokenGenerator {
    constructor(secret) {
        this.secret = secret;
        this.ready = (async () => {
            this.key = await window.crypto.subtle.importKey("raw", this.secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
        })();
    }
    async getToken(timestep) {
        if (!this.key)
            await this.ready;
        let timestep_binary = Binary.toBinary(timestep);
        let bytes = [0, 0, 0, 0].map((_, idx) => Binary.binaryToInt(timestep_binary.slice(idx * 8, (idx + 1) * 8)));
        bytes = [0, 0, 0, 0].concat(bytes);
        let hmacResult = await window.crypto.subtle.sign("HMAC", this.key, new Uint8Array(bytes));
        let hotp = this.getHOTP(new Uint8Array(hmacResult));
        return hotp;
    }
    getHOTP(hmac_result) {
        let offset = hmac_result[19] & 0xf;
        let bin_code = (hmac_result[offset] & 0x7f) << 24
            | (hmac_result[offset + 1] & 0xff) << 16
            | (hmac_result[offset + 2] & 0xff) << 8
            | (hmac_result[offset + 3] & 0xff);
        let hotp = bin_code % (Math.pow(10, 6));
        return hotp;
    }
}
