

export type TypedArray = Int8Array
    | Uint8Array 
    | Uint8ClampedArray 
    | Int16Array 
    | Uint16Array 
    | Int32Array 
    | Uint32Array 
    | Float32Array 
    | Float64Array 
    | BigInt64Array 
    | BigUint64Array;

export enum Types {
    i8 = 'i8',
    ui8 = 'ui8',
    ui8c = 'ui8c',
    i16 = 'i16',
    ui16 = 'ui16',
    i32 = 'i32',
    ui32 = 'ui32',
    f32 = 'f32',
    f64 = 'f64',
    bi64 = 'bi64',
    bui64 = 'bui6'
}

export type TypeArray = [Types, number];

export const TYPES = {
    [Types.i8] : Int8Array,
    [Types.ui8] : Uint8Array,
    [Types.ui8c] : Uint8ClampedArray,
    [Types.i16] : Int16Array,
    [Types.ui16] : Uint16Array,
    [Types.i32] : Int32Array,
    [Types.ui32] : Uint32Array,
    [Types.f32] : Float32Array,
    [Types.f64] : Float64Array,
    [Types.bi64] : BigInt64Array,
    [Types.bui64] : BigUint64Array
}