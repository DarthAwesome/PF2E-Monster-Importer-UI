import * as parsingHelper from './parsing-helpers.js'

test('single attack with no traits', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] shield bash +13, Damage 1d6+10 bludgeoning"))
        .toEqual({name: "shield bash", modifier: "+13", actionCost: "1", isRanged: false, damageRolls: ["1d6+10 bludgeoning"]})
})

test('single attack with one damage roll', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] claw +30 (reach 20 feet, magical), Damage 3d8+14 slashing"))
        .toEqual({name: "claw", modifier: "+30", actionCost: "1", traits: ["reach 20 feet", "magical"], isRanged: false, damageRolls: ["3d8+14 slashing"]})
    expect(parsingHelper.parseSingleAttack("Melee  branch +27 (finesse, magical), Damage 3d12+8 bludgeoning"))
        .toEqual({name: "branch", modifier: "+27", actionCost: "1", traits: ["finesse", "magical"], isRanged: false, damageRolls: ["3d12+8 bludgeoning"]})
        
})
test('single attack with two damage roll', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] jaws +10 (finesse), Damage 1d8+4 fire plus 1d4 persistent fire"))
        .toEqual({name: "jaws", modifier: "+10", actionCost: "1", traits: ["finesse"], isRanged: false, damageRolls: ["1d8+4 fire", "1d4 persistent fire"]})
    expect(parsingHelper.parseSingleAttack("Melee [one-action] Fleshroaster +31 (disarm, finesse, magical, trip), Damage 2d8+14 slashing plus 1d6 fire"))
        .toEqual({name: "Fleshroaster", modifier: "+31", actionCost: "1", traits: ["disarm", "finesse", "magical", "trip"], isRanged: false, damageRolls: ["2d8+14 slashing", "1d6 fire"]})
    expect(parsingHelper.parseSingleAttack("Melee [one-action] fist +17 (lawful, magical), Damage 2d10+4 bludgeoning plus 1d6 lawful"))
        .toEqual({name: "fist", modifier: "+17", actionCost: "1", traits: ["lawful", "magical"], isRanged: false, damageRolls: ["2d10+4 bludgeoning", "1d6 lawful"]})
})
test('single attack with three damage roll', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] flaming scimitar +20 (fire, forceful, good, magical, sweep), Damage 2d6+8 slashing plus 1d6 fire and 1d6 good"))
        .toEqual({name: "flaming scimitar", modifier: "+20", actionCost: "1", traits: ["fire", "forceful", "good", "magical", "sweep"], isRanged: false, damageRolls: ["2d6+8 slashing", "1d6 fire", "1d6 good"]})
})
test('single attack with one damage roll and one attackEffect', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action]horn +12 (good, magical), Damage 1d10+4 piercing plus 1d6 good and ghost touch"))
        .toEqual({name: "horn", modifier: "+12", actionCost: "1", traits: ["good", "magical"], isRanged: false, damageRolls: ["1d10+4 piercing", "1d6 good"], attackEffects: ["ghost touch"]})
})
test('single attack with one damage roll and multiple attackEffect', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] jaws +32 (evil, magical, reach 10 feet), Damage 3d8+9 piercing plus essence drain, and Grab"))
        .toEqual({name: "jaws", modifier: "+32", actionCost: "1", traits: ["evil", "magical", "reach 10 feet"], isRanged: false, damageRolls: ["3d8+9 piercing"], attackEffects: ["essence drain", "Grab"]})
})
test('single attack with multiple damage roll and one attackEffect', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] claw +32 (agile, evil, magical, reach 10 feet), Damage 3d6+9 slashing plus 1d6 evil and Essence Drain"))
        .toEqual({name: "claw", modifier: "+32", actionCost: "1", traits: ["agile", "evil", "magical", "reach 10 feet"], isRanged: false, damageRolls: ["3d6+9 slashing", "1d6 evil"], attackEffects: ["Essence Drain"]})
})
test('single attack with multiple damage roll and multiple attackEffect', () => {
    expect(parsingHelper.parseSingleAttack("Melee [one-action] jaws +32 (evil, magical, reach 10 feet), Damage 3d8+9 piercing plus 1d6 evil, essence drain, and Grab"))
        .toEqual({name: "jaws", modifier: "+32", actionCost: "1", traits: ["evil", "magical", "reach 10 feet"], isRanged: false, damageRolls: ["3d8+9 piercing", "1d6 evil"], attackEffects: ["essence drain", "Grab"]})
})
test('single attack with only an effect', () => {
    expect(parsingHelper.parseSingleAttack("Ranged [one-action] slime squirt +9 (range increment 30 feet), Effect entangling slime"))
        .toEqual({name: "slime squirt", modifier: "+9", actionCost: "1", traits: ["range increment 30 feet"], isRanged: true, damageRolls: [], attackEffects: ["entangling slime"]})
})
test('single attack with multiple effects', () => {
    expect(parsingHelper.parseSingleAttack("Ranged [one-action] slime squirt +9 (range increment 30 feet), Effect entangling slime and Grab"))
        .toEqual({name: "slime squirt", modifier: "+9", actionCost: "1", traits: ["range increment 30 feet"], isRanged: true, damageRolls: [], attackEffects: ["entangling slime", "Grab"]})
})

