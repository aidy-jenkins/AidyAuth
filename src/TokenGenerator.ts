import { Binary } from "./Binary.js";

export class TokenGenerator {
    private key: CryptoKey;
    /** A promise indicating when the TokenGenerator is ready to be used */
    public readonly ready: Promise<void>;

    constructor(private secret: Uint8Array) {
        this.ready = (async () => {
                this.key = await window.crypto.subtle.importKey("raw", this.secret, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
        })();
    }

    async getToken(timestep: number) {
        if(!this.key)
            await this.ready;

        let timestep_binary = Binary.toBinary(timestep);
        let bytes = Array(4).fill(0).map((_, idx) => Binary.binaryToInt(timestep_binary.slice(idx * 8, (idx + 1) * 8)));
        
        bytes = [0, 0, 0, 0].concat(bytes); //counter value must be 8-bytes, timestep is only 32-bit (4-bytes) so needs 4 bytes of padding

        let hmacResult = await window.crypto.subtle.sign("HMAC", this.key, new Uint8Array(bytes));
        let hotp = this.getHOTP(new Uint8Array(hmacResult));

        return hotp;
    }

    private getHOTP(hmac_result: Uint8Array) {
        let offset   =  hmac_result[19] & 0xf;
        let bin_code = (hmac_result[offset]  & 0x7f) << 24
           | (hmac_result[offset+1] & 0xff) << 16
           | (hmac_result[offset+2] & 0xff) <<  8
           | (hmac_result[offset+3] & 0xff);

        let hotp = bin_code % (Math.pow(10, 6));

        return hotp;
    }
}