import { Address, ContractProvider, Sender } from '@ton/core';
import { TonClient, WalletContractV3R2 } from '@ton/ton';
import { Challenge } from '../wrappers-ts/Challenge.gen';

export type ChallengeDeployment = {
    address: Address;
    nonce: bigint;
};

export type ChallengeDeployerContext = {
    wallet: WalletContractV3R2;
    provider: ContractProvider;
    sender: Sender;
};

export async function deployChallengeInstance(client: TonClient, deployer: ChallengeDeployerContext, deployValue: bigint): Promise<ChallengeDeployment> {
    const currentSeqno = await deployer.wallet.getSeqno(deployer.provider);
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