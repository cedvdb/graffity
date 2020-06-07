import { wallet } from 'nanocurrency-web';



export function createWallet();
const wlt = wallet.generate();
const encryptedWallet = encrypt(JSON.stringify(wlt), uid).toString();
