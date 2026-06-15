import "@gen/ChallengeChild.code.tolk"
import "types"

contract Challenge {
    storage: ChallengeStorage
    incomingMessages: AllowedChallengeMessage
}

type AllowedChallengeMessage = DeployChild | SolveChallenge

fun challengeChildStateInit(): ContractState {
    return ContractState {
        code: challengeChildCompiledCode(),
        data: ChallengeChildStorage {
            parentAddress: contract.getAddress(),
        }.toCell(),
    };
}

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedChallengeMessage.fromSlice(in.body);

    match (msg) {
        DeployChild => {
            var storage = ChallengeStorage.load();
            assert (storage.childAddress == null) throw Errors.ChildAlreadyDeployed;

            val childInit = challengeChildStateInit();
            val childAddress = AutoDeployAddress { stateInit: childInit }.calculateAddress();

            val deployMsg = createMessage({
                bounce: false,
                value: ton("0.5"),
                dest: { stateInit: childInit }
            });
            deployMsg.send(SEND_MODE_REGULAR);

            storage.childAddress = childAddress;
            storage.childDeployer = in.senderAddress;
            storage.save();
        }
        SolveChallenge => {
            var storage = ChallengeStorage.load();
            assert (storage.childAddress != null) throw Errors.ChildNotDeployed;
            assert (in.senderAddress == storage.childAddress!) throw Errors.InvalidChildSender;
            assert (msg.caller == storage.childDeployer!) throw Errors.InvalidTxnCaller;
            storage.isSolved = true;
            storage.save();
        }
        else => {
            if (in.body.isEmpty()) {
                return;
            }
            throw 0xFFFF;
        }
    }
}

fun onBouncedMessage(_: InMessageBounced) {}

get fun childAddress(): address? {
    val storage = lazy ChallengeStorage.load();
    return storage.childAddress
}

get fun isSolved(): bool {
    val storage = lazy ChallengeStorage.load();
    return storage.isSolved
}