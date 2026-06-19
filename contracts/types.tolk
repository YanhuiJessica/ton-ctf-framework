enum Errors {
    ChildAlreadyDeployed = 100
    ChildNotDeployed = 101
    InvalidChildSender = 102
    InvalidTxnCaller = 103
}

struct ChallengeStorage {
    nonce: uint64
    childAddress: address?
    childDeployer: address?
    isSolved: bool
}

fun ChallengeStorage.load(): ChallengeStorage {
    return ChallengeStorage.fromCell(contract.getData());
}

fun ChallengeStorage.save(self) {
    contract.setData(self.toCell());
}

struct ChallengeChildStorage {
    parentAddress: address
}

fun ChallengeChildStorage.load(): ChallengeChildStorage {
    return ChallengeChildStorage.fromCell(contract.getData());
}

struct (0x13370001) DeployChild {}

struct (0x13370002) SolveChallenge {
    caller: address
}

struct (0x13370003) SolveChild {}
