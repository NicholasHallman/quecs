
import { checkStoreSize } from './storage.js';
import { TYPES, Types, TypeArray, TypedArray } from './types.js';
import { SplitSharedArrayView } from './SharedSplitArray.js';
import { Phase } from './phase.js';

export interface ComponentSchema {
    [keys: string]: Types | TypeArray
}

export interface Component {
    [keys: string]: ArrayBufferLike | SplitSharedArrayView,
}

interface PhaseLookup {
    [name: string]: Phase
}

export class World {
    private entityCount;
    private componentEntityMap: WeakMap<Component, number[]>;
    private componentMap: WeakMap<Component, any>;
    private _phases: PhaseLookup;

    constructor() {
        this.entityCount = 0;
        this.componentEntityMap = new WeakMap();
        this.componentMap = new WeakMap();
        this._phases = {};
    }

    private _makeEntityObject(eid: number) {
        return {
            id: eid,
            addComponent: (component: Component) => {
                this.addComponent(eid, component);
                return this._makeEntityObject(eid)
            }
        };
    }

    addEntity() {
        const eid = this.entityCount;
        this.entityCount += 1;
        return this._makeEntityObject(eid);
    }

    defineComponent(componentSchema: ComponentSchema): Component {
        const newComponent: Component = {};
        Object.entries(componentSchema).forEach(([key, type]) => {
            if (typeof type === 'string') {
                const buffer = new SharedArrayBuffer(TYPES[type].BYTES_PER_ELEMENT * 10000);
                newComponent[key] = new TYPES[type](buffer);
            } else {
                const buffer = new SplitSharedArrayView(type[1], type[0]);
                newComponent[key] = buffer;
            }
        })
        this.componentMap.set(newComponent, {});
        this.componentEntityMap.set(newComponent, []);
        return newComponent;
    }

    addComponent(eid: number, component: Component) {
        const compEids = this.componentEntityMap.get(component);
        if(compEids.includes(eid)) throw new Error("Entities may only contain one instance of a component");
        // make sure the component has enough allocated space to fit the new entity
        checkStoreSize(component, eid);
        compEids.push(eid);
        return this;
    }

    removeComponent(eid: number, component) {
        const compEids = this.componentEntityMap.get(component);
        // remove the entity component mapping, removing the entitiy from component queries of that type
        this.componentEntityMap.set(component, compEids.filter(mapEid => mapEid !== eid));
    }

    createPhase(name) {
        this._phases[name] = new Phase();
        return this._phases[name];
    }

    getPhase(name) {
        return this._phases[name];
    }

    runPhase(name) {
        this._phases[name].run(this);
    }

    defineQuery(...components: Component[]) {
        return () => {
            const eids = new Set<number>();
            for(let i = 0 ; i < components.length; i ++){
                const comp = components[i];
                const eidsInComp = this.componentEntityMap.get(comp);
                if(i === 0) {
                    // populate the set with all the eids to start
                    for(const eid of eidsInComp) {
                        eids.add(eid)
                    }
                } else {
                    // exclude entities that don't appear in later components
                    for(const eid of eids) {
                        if(!eidsInComp.includes(eid)) {
                            eids.delete(eid);
                        };
                    }
                }
                
            }
            return eids;
        }
    }
}



