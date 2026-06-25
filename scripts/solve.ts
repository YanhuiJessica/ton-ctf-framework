import { keyPairFromSeed } from "@ton/crypto";
import { TonClient, WalletContractV3R2, Address, toNano, OpenedContract } from "@ton/ton";
import { Challenge } from "../wrappers-ts/Challenge.gen";
import { ChallengeChild } from "../wrappers-ts/ChallengeChild.gen";

const API_URL = process.env.API_URL;
const SEED = process.env.SEED;
const WALLET_ID = process.env.WALLET_ID;
const CHALL = Address.parse(process.env.CHALL!);

async function waitForSeqnoIncrease(wallet: OpenedContract<WalletContractV3R2>, seqno: number) {
    let currentSeqno = await wallet.getSeqno();
    while (currentSeqno <= seqno) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentSeqno = await wallet.getSeqno();
    }
}

(async () => {
    const client = new TonClient({
        endpoint: `${API_URL}/jsonRPC`,
    });
    const keyPair = keyPairFromSeed(Buffer.from(SEED!, 'hex'));
    const wallet = client.open(WalletContractV3R2.create({
        workchain: -1,
        publicKey: keyPair.publicKey,
        walletId: Number(WALLET_ID),
    }));

    const challenge = client.open(Challenge.fromAddress(CHALL!));

    let currentSeqno = await wallet.getSeqno();
    await challenge.sendDeployChild(wallet.sender(keyPair.secretKey), toNano(0.4), {});
    await waitForSeqnoIncrease(wallet, currentSeqno);

    let childAddress = await challenge.getChildAddress();
    while (true) {
        if (childAddress == null) {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            childAddress = await challenge.getChildAddress();
            continue;
        }
        break;
    }
    const child = client.open(ChallengeChild.fromAddress(childAddress!));
    currentSeqno = await wallet.getSeqno();
    await child.sendAllowedChallengeChildMessage(wallet.sender(keyPair.secretKey), toNano(0.2), {
        $: 'SolveChild'
    });
    await waitForSeqnoIncrease(wallet, currentSeqno);
})();