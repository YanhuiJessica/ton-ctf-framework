import "@acton/emulation/network"
import "@acton/emulation/testing"
import "@acton/testing/expect"

import "@contracts/types"
import "@wrappers/Challenge.gen"
import "@wrappers/ChallengeChild.gen"

get fun `test initial value`() {
    val (challenge, _, _) = setupTest();
    expect(challenge.childAddress()).toBeNull();
    expect(challenge.isSolved()).toBeFalse();
}

get fun `test solve challenge`() {
    val (challenge, _, notDeployer) = setupTest();

    // Deploy child contract
    val deployRes = challenge.sendDeployChild(notDeployer.address, { value: ton("1") });
    expect(deployRes).toHaveSuccessfulTx({
        from: notDeployer.address,
        to: challenge.address,
    });

    val childAddr = challenge.childAddress();
    expect(childAddr).toBeNotNull();
    val child = ChallengeChild.fromAddress(childAddr!);
    val solveRes = child.sendSolveChild(notDeployer.address, { value: ton("0.5") });
    expect(solveRes).toHaveSuccessfulTx({
        from: childAddr,
        to: challenge.address,
        body: SolveChallenge {
            caller: notDeployer.address
        }.toCell(),
    });

    expect(challenge.isSolved()).toBeTrue();
}

fun setupTest(): (Challenge, Treasury, Treasury) {
    val deployer = testing.treasury("deployer");
    val notDeployer = testing.treasury("notDeployer");

    val contract = Challenge.fromStorage({
        nonce: 0,
        childAddress: null,
        childDeployer: null,
        isSolved: false,
    });
    val res = contract.deploy(deployer.address, { value: ton("1") });
    expect(res).toHaveSuccessfulDeploy({
        to: contract.address,
    });

    return (contract, deployer, notDeployer);
}