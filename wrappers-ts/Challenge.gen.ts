// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a Challenge contract in Tolk.
/* eslint-disable */

import * as c from '@ton/core';
import { beginCell, ContractProvider, Sender, SendMode } from '@ton/core';

// ————————————————————————————————————————————
//   predefined types and functions
//

type StoreCallback<T> = (obj: T, b: c.Builder) => void
type LoadCallback<T> = (s: c.Slice) => T

export type CellRef<T> = {
    ref: T
}

function makeCellFrom<T>(self: T, storeFn_T: StoreCallback<T>): c.Cell {
    let b = beginCell();
    storeFn_T(self, b);
    return b.endCell();
}

function loadAndCheckPrefix32(s: c.Slice, expected: number, structName: string): void {
    let prefix = s.loadUint(32);
    if (prefix !== expected) {
        throw new Error(`Incorrect prefix for '${structName}': expected 0x${expected.toString(16).padStart(8, '0')}, got 0x${prefix.toString(16).padStart(8, '0')}`);
    }
}

function lookupPrefix(s: c.Slice, expected: number, prefixLen: number): boolean {
    return s.remainingBits >= prefixLen && s.preloadUint(prefixLen) === expected;
}

function throwNonePrefixMatch(fieldPath: string): never {
    throw new Error(`Incorrect prefix for '${fieldPath}': none of variants matched`);
}

function storeCellRef<T>(cell: CellRef<T>, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    let b_ref = c.beginCell();
    storeFn_T(cell.ref, b_ref);
    b.storeRef(b_ref.endCell());
}

function loadCellRef<T>(s: c.Slice, loadFn_T: LoadCallback<T>): CellRef<T> {
    let s_ref = s.loadRef().beginParse();
    return { ref: loadFn_T(s_ref) };
}

function storeTolkNullable<T>(v: T | null, b: c.Builder, storeFn_T: StoreCallback<T>): void {
    if (v === null) {
        b.storeUint(0, 1);
    } else {
        b.storeUint(1, 1);
        storeFn_T(v, b);
    }
}

// ————————————————————————————————————————————
//   parse get methods result from a TVM stack
//

class StackReader {
    constructor(private tuple: c.TupleItem[]) {
    }

    static fromGetMethod(expectedN: number, getMethodResult: { stack: c.TupleReader }): StackReader {
        let tuple = [] as c.TupleItem[];
        while (getMethodResult.stack.remaining) {
            tuple.push(getMethodResult.stack.pop());
        }
        if (tuple.length !== expectedN) {
            throw new Error(`expected ${expectedN} stack width, got ${tuple.length}`);
        }
        return new StackReader(tuple);
    }

    private popExpecting<ItemT>(itemType: string): ItemT {
        const item = this.tuple.shift();
        if (item?.type === itemType) {
            return item as ItemT;
        }
        throw new Error(`not '${itemType}' on a stack`);
    }

    private popCellLike(): c.Cell {
        const item = this.tuple.shift();
        if (item && (item.type === 'cell' || item.type === 'slice' || item.type === 'builder')) {
            return item.cell;
        }
        throw new Error(`not cell/slice on a stack`);
    }

    readBigInt(): bigint {
        return this.popExpecting<c.TupleItemInt>('int').value;
    }

    readBoolean(): boolean {
        return this.popExpecting<c.TupleItemInt>('int').value !== 0n;
    }

    readCell(): c.Cell {
        return this.popCellLike();
    }

    readSlice(): c.Slice {
        return this.popCellLike().beginParse();
    }

    readNullable<T>(readFn_T: (r: StackReader) => T): T | null {
        if (this.tuple[0].type === 'null') {
            this.tuple.shift();
            return null;
        }
        return readFn_T(this);
    }
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

type uint64 = bigint

/**
 > struct ChallengeStorage {
 >     nonce: uint64
 >     childAddress: address?
 >     childDeployer: address?
 >     isSolved: bool
 > }
 */
export interface ChallengeStorage {
    readonly $: 'ChallengeStorage'
    nonce: uint64
    childAddress: c.Address | null
    childDeployer: c.Address | null
    isSolved: boolean
}

export const ChallengeStorage = {
    create(args: {
        nonce: uint64
        childAddress: c.Address | null
        childDeployer: c.Address | null
        isSolved: boolean
    }): ChallengeStorage {
        return {
            $: 'ChallengeStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): ChallengeStorage {
        return {
            $: 'ChallengeStorage',
            nonce: s.loadUintBig(64),
            childAddress: s.loadMaybeAddress(),
            childDeployer: s.loadMaybeAddress(),
            isSolved: s.loadBoolean(),
        }
    },
    store(self: ChallengeStorage, b: c.Builder): void {
        b.storeUint(self.nonce, 64);
        b.storeAddress(self.childAddress);
        b.storeAddress(self.childDeployer);
        b.storeBit(self.isSolved);
    },
    toCell(self: ChallengeStorage): c.Cell {
        return makeCellFrom<ChallengeStorage>(self, ChallengeStorage.store);
    }
}

/**
 > struct (0x13370001) DeployChild {
 > }
 */
export interface DeployChild {
    readonly $: 'DeployChild'
}

export const DeployChild = {
    PREFIX: 0x13370001,

    create(): DeployChild {
        return {
            $: 'DeployChild',
        }
    },
    fromSlice(s: c.Slice): DeployChild {
        loadAndCheckPrefix32(s, 0x13370001, 'DeployChild');
        return {
            $: 'DeployChild',
        }
    },
    store(self: DeployChild, b: c.Builder): void {
        b.storeUint(0x13370001, 32);
    },
    toCell(self: DeployChild): c.Cell {
        return makeCellFrom<DeployChild>(self, DeployChild.store);
    }
}

/**
 > struct (0x13370002) SolveChallenge {
 >     caller: address
 > }
 */
export interface SolveChallenge {
    readonly $: 'SolveChallenge'
    caller: c.Address
}

export const SolveChallenge = {
    PREFIX: 0x13370002,

    create(args: {
        caller: c.Address
    }): SolveChallenge {
        return {
            $: 'SolveChallenge',
            ...args
        }
    },
    fromSlice(s: c.Slice): SolveChallenge {
        loadAndCheckPrefix32(s, 0x13370002, 'SolveChallenge');
        return {
            $: 'SolveChallenge',
            caller: s.loadAddress(),
        }
    },
    store(self: SolveChallenge, b: c.Builder): void {
        b.storeUint(0x13370002, 32);
        b.storeAddress(self.caller);
    },
    toCell(self: SolveChallenge): c.Cell {
        return makeCellFrom<SolveChallenge>(self, SolveChallenge.store);
    }
}

// ————————————————————————————————————————————
//    class Challenge
//

interface ExtraSendOptions {
    bounce?: boolean                    // default: false
    sendMode?: SendMode                 // default: SendMode.PAY_GAS_SEPARATELY
    extraCurrencies?: c.ExtraCurrency   // default: empty dict
}

interface DeployedAddrOptions {
    workchain?: number                  // default: 0 (basechain)
    toShard?: { fixedPrefixLength: number; closeTo: c.Address }
    overrideContractCode?: c.Cell
}

function calculateDeployedAddress(code: c.Cell, data: c.Cell, options: DeployedAddrOptions): c.Address {
    const stateInitCell = beginCell().store(c.storeStateInit({
        code,
        data,
        splitDepth: options.toShard?.fixedPrefixLength,
        special: null,
        libraries: null,
    })).endCell();

    let addrHash = stateInitCell.hash();
    if (options.toShard) {
        const shardDepth = options.toShard.fixedPrefixLength;
        addrHash = beginCell()
            .storeBits(new c.BitString(options.toShard.closeTo.hash, 0, shardDepth))
            .storeBits(new c.BitString(stateInitCell.hash(), shardDepth, 256 - shardDepth))
            .endCell()
            .beginParse().loadBuffer(32);
    }

    return new c.Address(options.workchain ?? 0, addrHash);
}

export class Challenge implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgECCwEAAUYAART/APSkE/S88sgLAQIBYgIDBPjQ+JGRMOAg1ywgmbgADI7lW+1E0NM/+lD6UDHSANEBbvLgZIj4KMj6UslTAcjPhNDMzPkWyM+KAEDL/89QghAdzWUAyM+JCAFTNMjPhNDMzPkWzwv/AfoCgQCMzwtwE8zMyXD7APiSA8jLP/pUEvpUygDJ7VTgidcn4wIwBAUGBwIBIAkKART/APSkE/S88sgLCAAIEzcAAgBkMe1E0NM/+lD6UNIAMdEhbvLQZfiSIscF8uBmA/pIMCPHBfLgZwHIyz/6VPpUz4PJ7VQADscA3IQP8vAActP4kZEw4CDXLCCZuAAcMY4gMO1E0PpI0fiSyM+FCBL6UoIQEzcAAs8LjvpSyYBA+wDgxwDchA/y8AAXvdmPaiaGmfmP0oGEACO/dbdqJoaZ+Y/SgY/SgY64UAQ=');

    static Errors = {
        'Errors.ChildAlreadyDeployed': 100,
        'Errors.ChildNotDeployed': 101,
        'Errors.InvalidChildSender': 102,
        'Errors.InvalidTxnCaller': 103,
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new Challenge(address);
    }

    static fromStorage(emptyStorage: {
        nonce: uint64
        childAddress: c.Address | null
        childDeployer: c.Address | null
        isSolved: boolean
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? Challenge.CodeCell,
            data: ChallengeStorage.toCell(ChallengeStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new Challenge(address, initialState);
    }

    static createCellOfDeployChild(body: {
    }) {
        return DeployChild.toCell(DeployChild.create());
    }

    static createCellOfSolveChallenge(body: {
        caller: c.Address
    }) {
        return SolveChallenge.toCell(SolveChallenge.create(body));
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendDeployChild(provider: ContractProvider, via: Sender, msgValue: coins, body: {
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: DeployChild.toCell(DeployChild.create()),
            ...extraOptions
        });
    }

    async sendSolveChallenge(provider: ContractProvider, via: Sender, msgValue: coins, body: {
        caller: c.Address
    }, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: SolveChallenge.toCell(SolveChallenge.create(body)),
            ...extraOptions
        });
    }

    async getChildAddress(provider: ContractProvider): Promise<c.Address | null> {
        const r = StackReader.fromGetMethod(1, await provider.get('childAddress', []));
        return r.readNullable<c.Address>(
            (r) => r.readSlice().loadAddress()
        );
    }

    async getIsSolved(provider: ContractProvider): Promise<boolean> {
        const r = StackReader.fromGetMethod(1, await provider.get('isSolved', []));
        return r.readBoolean();
    }
}
