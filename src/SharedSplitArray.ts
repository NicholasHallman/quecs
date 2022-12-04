import { TYPES, Types, TypedArray } from './types.js';

/*
    Manages arrays of buffers using a single shared array buffer
*/

interface ViewLookup {
    [eid: number]: TypedArray
}

export class SplitSharedArrayView {

    private _store: TypedArray ;
    private _buffer: SharedArrayBuffer;
    private _type: Types;
    private _arrSize: number;
    private _size: number;
    private _views: ViewLookup;

    constructor(arrSize: number, type: Types) {
        this._arrSize = arrSize;
        this._size = 10000;
        this._buffer = new SharedArrayBuffer(TYPES[type].BYTES_PER_ELEMENT * arrSize * 10000);
        this._store = new TYPES[type](this._buffer);
        this._type = type;
        this._views = {};
        const offset = arrSize * TYPES[type].BYTES_PER_ELEMENT;
        return new Proxy(this, {
            get: function(target, prop) {
                if(!isNaN(Number(prop))) {
                    const eid = Number(prop);
                    if(target._views[eid] !== undefined) return target._views[eid];
                    const start: number = eid * offset;
                    target._views[eid] = new TYPES[type](target.buffer, start, TYPES[type].BYTES_PER_ELEMENT * arrSize);
                    return target._views[eid];
                } else if (typeof target[prop] === 'function') {
                    return function (...args) {
                        return target[prop](...args);
                    }
                } else {
                    return target[prop];
                }
            }
        });
    }

    hasRoom(eid: number): boolean {
        return eid < this._size;
    }

    grow() {
        this._buffer = new SharedArrayBuffer(this._buffer.byteLength + (TYPES[this._type].BYTES_PER_ELEMENT * this._arrSize * 1000));
        const newStore = new TYPES[this._type](this._buffer);
        newStore.set(this.store as any);
        this._store = newStore;
    }

    get buffer(): SharedArrayBuffer  {
        return this._buffer;
    }

    get storeType(): Types {
        return this._type;
    }

    get store(): TypedArray {
        return this._store;
    }
}