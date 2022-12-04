# QUECS

Quecs, pronounced quicks, is an entity component sytem for JavaScript inspired by bitecs, ecsy and becsy.

## Example

```javascript
const world = new World();

//define components
const Position = world.defineComponent({
    x: Types.i16,
    y: Types.i16,
});
const Player = world.defineComponent({});

// create entities
const {id: playerEid} = world.createEntity()
    .addComponent(Position)
    .addComponent(Player);

// set entity's component data
Position.x[playerEid] = 20;
Position.y[playerEid] = 10;

// define a query
const posQuery = world.defineQuery(Position);

// define a system
const moveHorizontalSystem = world => {
    const eids = posQuery();
    for(eid of eids) {
        Position.x[eid] += 1;
    }
}

// create a phase to contain the systems
const physPhase = world.createPhase('physics');
physPhase.addSystem(moveHorizontalSystem);

// run the phase
world.runPhase('physics');

```

## Features

### Entities
 - [x] Creating entities
 - [x] Adding Components
 - [x] Remove Components
 - [x] Chain notation

### Components
 - [x] Defining Components with typed properties 
 - [x] Defining Components with array properties
 - [x] Manages store size
 - [x] Single buffer for array properties
 - [x] Indexable sub views for array properties

### Phase
 - [x] Define a phase
 - [x] Add systems to a phase
 - [x] Run the phase 

### Queries
 - [x] Define query
 - [x] Get entities from query
 - [ ] Cache entities in query
 - [ ] Not modifyer

### Multithreading
 - [ ] Function for threading system
 - [ ] Check host environment to determine thread count and allocate worker pool
 - [x] Shared array buffers for easy worker access
 - [ ] Entity subset threading (One thread runs a subset of entities against a system)
 - [ ] Multi phase threading (One thread runs per Phase)