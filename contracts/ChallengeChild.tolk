import "types"

contract ChallengeChild {
    storage: ChallengeChildStorage
    incomingMessages: AllowedChallengeChildMessage
}

type AllowedChallengeChildMessage = SolveChild

fun onInternalMessage(in: InMessage) {
    val msg = lazy AllowedChallengeChildMessage.fromSlice(in.body);

    match (msg) {
        SolveChild => {
            val storage = ChallengeChildStorage.load();
            val solvMsg = createMessage({
                bounce: false,
                value: 0,
                dest: storage.parentAddress,
                body: SolveChallenge {
                    caller: in.senderAddress
                },
            });
            solvMsg.send(SEND_MODE_CARRY_ALL_REMAINING_MESSAGE_VALUE);
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