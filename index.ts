import { Base32 } from "./src/Base32.js";
import { TokenGenerator } from "./src/TokenGenerator.js";

export class Index {
    constructor() {
        const SECRET = "JBSWY3DPEHPK3PXP";
        let decoded = Base32.decode(SECRET);
        let gen = new TokenGenerator(decoded);

        let timerSpan = Index.getElement<HTMLSpanElement>("timer");
        let codeSpan = Index.getElement<HTMLSpanElement>("code");
        let secretBox = Index.getElement<HTMLInputElement>("secret");
        let updateButton = Index.getElement<HTMLInputElement>("updateButton");

        let current_timestep = 0;

        let func = async () => {
            let timestamp = Math.floor(Date.now() / 1000);
            let timestep = Math.floor(timestamp / 30);

            if(timestep !== current_timestep) {
                let token = await gen.getToken(timestep);

                let tokenStr = token.toString();
                if(tokenStr.length < 6) //left pad with 0s
                    tokenStr = Array(6 - tokenStr.length).fill(0).map(x => x.toString()).join('') + tokenStr;

                codeSpan.textContent = `${tokenStr.substr(0, 3)} ${tokenStr.substr(3)}`;
                current_timestep = timestep;
            }
            
            let validity_s = ((timestep + 1) * 30) - timestamp;
            timerSpan.textContent = `Valid for ${validity_s} seconds`;

        };
        gen.ready.then(() => setInterval(func, 1000));

        updateButton.onclick = async e => {
            let newSecret = secretBox.value;
            while(newSecret.includes(' '))
                newSecret = newSecret.replace(' ', '');

            let newGenerator = new TokenGenerator(Base32.decode(newSecret));
            await newGenerator.ready;
            gen = newGenerator;
            current_timestep = 0;
        }

    }

    static getElement<T extends HTMLElement>(className: string){ 
        return document.getElementsByClassName(className)[0] as T;
    }
}

new Index();