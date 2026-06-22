// AUTO-GENERATED, do not edit
// It's a TypeScript wrapper for a ChallengeChild contract in Tolk.
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
}

// ————————————————————————————————————————————
//   auto-generated serializers to/from cells
//

type coins = bigint

/**
 > type AllowedChallengeChildMessage = SolveChild
 */
export type AllowedChallengeChildMessage = SolveChild

export const AllowedChallengeChildMessage = {
    fromSlice(s: c.Slice): AllowedChallengeChildMessage {
        return SolveChild.fromSlice(s);
    },
    store(self: AllowedChallengeChildMessage, b: c.Builder): void {
        SolveChild.store(self, b);
    },
    toCell(self: AllowedChallengeChildMessage): c.Cell {
        return makeCellFrom<AllowedChallengeChildMessage>(self, AllowedChallengeChildMessage.store);
    }
}

/**
 > struct ChallengeChildStorage {
 >     parentAddress: address
 > }
 */
export interface ChallengeChildStorage {
    readonly $: 'ChallengeChildStorage'
    parentAddress: c.Address
}

export const ChallengeChildStorage = {
    create(args: {
        parentAddress: c.Address
    }): ChallengeChildStorage {
        return {
            $: 'ChallengeChildStorage',
            ...args
        }
    },
    fromSlice(s: c.Slice): ChallengeChildStorage {
        return {
            $: 'ChallengeChildStorage',
            parentAddress: s.loadAddress(),
        }
    },
    store(self: ChallengeChildStorage, b: c.Builder): void {
        b.storeAddress(self.parentAddress);
    },
    toCell(self: ChallengeChildStorage): c.Cell {
        return makeCellFrom<ChallengeChildStorage>(self, ChallengeChildStorage.store);
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

/**
 > struct (0x13370003) SolveChild {
 > }
 */
export interface SolveChild {
    readonly $: 'SolveChild'
}

export const SolveChild = {
    PREFIX: 0x13370003,

    create(): SolveChild {
        return {
            $: 'SolveChild',
        }
    },
    fromSlice(s: c.Slice): SolveChild {
        loadAndCheckPrefix32(s, 0x13370003, 'SolveChild');
        return {
            $: 'SolveChild',
        }
    },
    store(self: SolveChild, b: c.Builder): void {
        b.storeUint(0x13370003, 32);
    },
    toCell(self: SolveChild): c.Cell {
        return makeCellFrom<SolveChild>(self, SolveChild.store);
    }
}

// ————————————————————————————————————————————
//    class ChallengeChild
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

export class ChallengeChild implements c.Contract {
    static CodeCell = c.Cell.fromBase64('te6ccgEBAgEASAABFP8A9KQT9LzyyAsBAHLT+JGRMOAg1ywgmbgAHDGOIDDtRND6SNH4ksjPhQgS+lKCEBM3AALPC476UsmAQPsA4McA3IQP8vA=');

    static Errors = {
    }

    readonly address: c.Address
    readonly init: { code: c.Cell, data: c.Cell } | undefined

    protected constructor(address: c.Address, init?: { code: c.Cell, data: c.Cell }) {
        this.address = address;
        this.init = init;
    }

    static fromAddress(address: c.Address) {
        return new ChallengeChild(address);
    }

    static fromStorage(emptyStorage: {
        parentAddress: c.Address
    }, deployedOptions?: DeployedAddrOptions) {
        const initialState = {
            code: deployedOptions?.overrideContractCode ?? ChallengeChild.CodeCell,
            data: ChallengeChildStorage.toCell(ChallengeChildStorage.create(emptyStorage)),
        };
        const address = calculateDeployedAddress(initialState.code, initialState.data, deployedOptions ?? {});
        return new ChallengeChild(address, initialState);
    }

    static createCellOfAllowedChallengeChildMessage(body: AllowedChallengeChildMessage) {
        return AllowedChallengeChildMessage.toCell(body);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, msgValue: coins, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: c.Cell.EMPTY,
            ...extraOptions
        });
    }

    async sendAllowedChallengeChildMessage(provider: ContractProvider, via: Sender, msgValue: coins, body: AllowedChallengeChildMessage, extraOptions?: ExtraSendOptions) {
        return provider.internal(via, {
            value: msgValue,
            body: AllowedChallengeChildMessage.toCell(body),
            ...extraOptions
        });
    }
}
