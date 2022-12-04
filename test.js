import { World } from './dist/index.js';
import test from 'ava';
import { Types } from './dist/types.js';

test("Should construct the world", t => {
    let world = new World();
    t.pass();
});

test("Should create entity", t => {
    let world = new World();
    const {id: eid} = world.addEntity();
    t.is(eid, 0);
});

test("Should allow for component definitions", t => {

    let schema = {
        x: Types.i8,
        y: Types.i8
    };

    let world = new World();
    const Position = world.defineComponent(schema);

    const {id: eid} = world.addEntity();

    world.addComponent(eid, Position);
    
    t.is(Position.x instanceof Int8Array, true);
    t.is(Position.y instanceof Int8Array, true);
});

test("Should allow for component setting", t => {

    let schema = {
        x: Types.i8,
        y: Types.i8
    };

    let world = new World();
    const Position = world.defineComponent(schema);

    const {id: eid} = world.addEntity()
        .addComponent(Position);

    Position.x[eid] = 10;
    Position.y[eid] = 10;

    t.is(Position.x[eid], 10)
    t.is(Position.y[eid], 10)
});


test("Should allow for defining component with array values", t => {

    let schema = {
        values: [Types.i8, 10],
    };

    let world = new World();
    const List = world.defineComponent(schema);

    const {id: eid} = world.addEntity()
        .addComponent(List);

    const {id: eid2} = world.addEntity()
        .addComponent(List);

    
    List.values[eid][0] = 1;
    List.values[eid][9] = 10;

    List.values[eid2][0] = 20;
    List.values[eid2][9] = 29;

    t.is(List.values[eid][0], 1);
    t.is(List.values[eid][9], 10);

    t.is(List.values[eid2][0], 20);
    t.is(List.values[eid2][9], 29);
    
});

test("Should create phase, add system, and run", t => {
    let world = new World();

    world.createPhase('test')
        .addSystem(world => {
            t.is(world === world, true)
            return {world, test: true}
        })
        .addSystem(({test}) => {
            t.is(test, true)
        });

    world.runPhase('test');
});

test("Should be able to create a query", t => {
    
    let world = new World();
    
    const Acomp = world.defineComponent({
        value: Types.i8
    })
    const Bcomp = world.defineComponent({
        value: Types.i8
    })


    const query = world.defineQuery(Acomp, Bcomp);
    t.is(query().size, 0);

})

test("Should be able to create a query and index entities", t => {
    
    let world = new World();
    
    const Acomp = world.defineComponent({
        value: Types.i8
    })
    const Bcomp = world.defineComponent({
        value: Types.i8
    })

    const {id: e1} = world.addEntity()
        .addComponent(Acomp)
        .addComponent(Bcomp);

    const {id: e2} = world.addEntity()
        .addComponent(Acomp);

    const query = world.defineQuery(Acomp, Bcomp);
    t.deepEqual([...query()], [e1])

})

test("Should be able to find an entity then remove a component and unindex it", t => {
    
    let world = new World();
    
    const Acomp = world.defineComponent({
        value: Types.i8
    })

    const {id: eid1} = world.addEntity()
        .addComponent(Acomp);

    const query = world.defineQuery(Acomp);

    // run the query, remove the component, run the query again
    t.is(query().size, 1);
    world.removeComponent(eid1, Acomp);
    t.is(query().size, 0);

})