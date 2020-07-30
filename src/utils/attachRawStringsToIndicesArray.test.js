import {attachRawStringsToIndicesArray} from './monster-string-searching'

test('few elements without nested array', () => {
    let rawStringArr = ["test1","test2","test3"]
    let arrIndices = [{key: "1", index: 0}, {key: "2", index: 2}, {key: "3", index: 4}]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: 2, rawStr: "test2"}, 
            {key: "3", index: 4, rawStr: "test3"}
        ])
})

test('few elements with a nested array that has 1 element', () => {
    let rawStringArr = ["test1","test2-1","test3"]
    let arrIndices = [{key: "1", index: 0}, {key: "2", index: [2]}, {key: "3", index: 4}]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: [2], rawStr: ["test2-1"]}, 
            {key: "3", index: 4, rawStr: "test3"}
        ])
})

test('few elements with a nested array that has 2 elements', () => {
    let rawStringArr = ["test1","test2-1","test2-2","test3"]
    let arrIndices = [{key: "1", index: 0}, {key: "2", index: [2,3]}, {key: "3", index: 4}]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: [2,3], rawStr: ["test2-1","test2-2"]}, 
            {key: "3", index: 4, rawStr: "test3"}
        ])
})

test('elements with multiple nested arrays in middle', () => {
    let rawStringArr = ["test1","test2-1","test2-2","test3-1","test4"]
    let arrIndices = [
            {key: "1", index: 0}, 
            {key: "2", index: [2,3]}, 
            {key: "3", index: [4]},
            {key: "4", index: 5}
        ]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: [2,3], rawStr: ["test2-1","test2-2"]}, 
            {key: "3", index: [4], rawStr: ["test3-1"]},
            {key: "4", index: 5, rawStr: "test4"}
        ])
})

test('elements with multiple nested arrays, including one with multiple at end', () => {
    let rawStringArr = ["test1","test2-1","test2-2","test3-1","test4","test5-1","test5-2","test5-3"]
    let arrIndices = [
            {key: "1", index: 0}, 
            {key: "2", index: [2,3]}, 
            {key: "3", index: [4]},
            {key: "4", index: 5},
            {key: "5", index: [6,7,8]}
        ]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: [2,3], rawStr: ["test2-1","test2-2"]}, 
            {key: "3", index: [4], rawStr: ["test3-1"]},
            {key: "4", index: 5, rawStr: "test4"},
            {key: "5", index: [6,7,8], rawStr: ["test5-1","test5-2","test5-3"]}
        ])
})

test('elements with multiple nested arrays, including one with multiple at end', () => {
    let rawStringArr = ["test1","test2-1","test2-2","test3-1","test4","test5-1","test5-2","test5-3","test6-1"]
    let arrIndices = [
            {key: "1", index: 0}, 
            {key: "2", index: [2,3]}, 
            {key: "3", index: [4]},
            {key: "4", index: 5},
            {key: "5", index: [6,7,8]},
            {key: "6", index: [9]}
        ]

    expect(attachRawStringsToIndicesArray(rawStringArr,arrIndices))
        .toEqual([
            {key: "1", index: 0, rawStr: "test1"}, 
            {key: "2", index: [2,3], rawStr: ["test2-1","test2-2"]}, 
            {key: "3", index: [4], rawStr: ["test3-1"]},
            {key: "4", index: 5, rawStr: "test4"},
            {key: "5", index: [6,7,8], rawStr: ["test5-1","test5-2","test5-3"]},
            {key: "6", index: [9], rawStr: ["test6-1"]},
        ])
})