import { Component } from "./index.js"
import { TypedArray } from "./types.js";
import { SplitSharedArrayView } from './SharedSplitArray.js';


export const checkStoreSize = (component: Component, eid: number) => {
    Object.entries(component).forEach(([key, store]) => {
        if(store instanceof SplitSharedArrayView) {
            while(!store.hasRoom(eid)) {
                store.grow();
            }
        } else {
            let maxEntity = store.byteLength / (store as TypedArray).BYTES_PER_ELEMENT;
            while(maxEntity < eid) {
                store = grow(store);
                component[key] = store;
                maxEntity = store.byteLength / (store as TypedArray).BYTES_PER_ELEMENT;
            }
        }
    }); 
}

const grow = (store): TypedArray => {
    const newStore = new (store.constructor as any)(store.byteLength + (1000 * (store as TypedArray).BYTES_PER_ELEMENT));
    newStore.set(store);
    return newStore;
}