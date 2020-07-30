import {splitToStringArray} from './monster-string-searching'

test('properly splits a string into multiple indices', () => {
    expect(splitToStringArray('smallstring',[{index: 0},{index: 4},{index: 7}])).toEqual(['smal','lst','ring'])
})

test('handle case with empty arrIndices', () => {
    expect(splitToStringArray('smallstring',[])).toEqual(['smallstring'])
})

test('handle case with index being an array of size 1', () => {
    expect(splitToStringArray('stringthatissomewhatlonger',[
        {index: 0},
        {index: 5},
        {index: 8},
        {index: [11]},
        {index: 18}
    ])).toEqual(["strin", "gth", "ati", "ssomewh", "atlonger"])
})

test('handle case with index being an array of size 3', () => {
    expect(splitToStringArray('stringthatissomewhatlonger',[
        {index: 0},
        {index: 5},
        {index: 8},
        {index: [11,14,18]},
        {index: 21}
    ])).toEqual(["strin", "gth", "ati", "sso", "mewh", "atl", "onger"])
})

test('handle case with multiple indices as arrays', () => {
    expect(splitToStringArray('stringthatissomewhatlongerevenstillwowthatislong',[
        {index: 0},
        {index: 5},
        {index: 8},
        {index: [11,14,18]},
        {index: 21},
        {index: [25,32]}
    ])).toEqual(["strin", "gth", "ati", "sso", "mewh", "atl", "onge", "revenst", "illwowthatislong"])
})

test('handle case with multiple consecutive indices as arrays', () => {
    expect(splitToStringArray('stringthatissomewhatlongerevenstillwowthatislong',[
        {index: 0},
        {index: 5},
        {index: 8},
        {index: [11,14,18]},
        {index: 21},
        {index: [25,32]},
        {index: [37,39]},
    ])).toEqual(["strin", "gth", "ati", "sso", "mewh", "atl", "onge", "revenst", "illwo", "wt", "hatislong"])
})