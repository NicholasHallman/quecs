import {World} from './index.js';

export type System = (World) => World;

export class Phase {
    private _systems: System[];
    constructor() {
        this._systems = [];
    }

    addSystem(system: System) {
        this._systems.push(system);
        return this;
    }

    setSystems(systems: System[]) {
        this._systems = systems;
    }

    run(world : World) {
        let result = world;
        for(let i = 0; i < this._systems.length; i++){
            result = this._systems[i](result);
        }
    }
}