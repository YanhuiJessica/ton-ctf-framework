import { Address } from '@ton/core';
import { TonClient } from '@ton/ton';
import { Challenge } from '../wrappers-ts/Challenge.gen';
import { WalletContext } from './types';

export type ChallengeDeployment = {
    address: Address;
    nonce: bigint;
};

export async function deployChallengeInstance(client: TonClient, deployer: WalletContext, deployValue: bigint): Promise<ChallengeDeployment> {
    const currentSeqno = await deployer.wallet.getSeqno();
    const nonce = BigInt(currentSeqno);
    const challenge = client.open(Challenge.fromStorage({
        nonce,
        childAddress: null,
        childDeployer: null,
        isSolved: false,
    }));

    await challenge.sendDeploy(deployer.sender, deployValue);

    return {
        address: challenge.address,
        nonce,
    };
}

export async function isChallengeInstanceSolved(client: TonClient, addr: Address): Promise<boolean> {
    const challenge = client.open(Challenge.fromAddress(addr));
    return challenge.getIsSolved();
}