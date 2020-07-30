import * as monStrings from '../../teststrings/teststrings.js'
import * as regex from './monster-string-regex'

//Name
test('name for illsrah', () => {
    let match = regex.searchForName(monStrings.ilssrahFromBook)
    expect(match[1]).toEqual("ILSSRAH EMBERMEAD")
})
test('name for superlich', () => {
    let match = regex.searchForName(monStrings.superlichFromAoN)
    expect(match[1]).toEqual("LICH")
})
//Level
test('level for illsrah', () => {
    let match = regex.searchForLevel(monStrings.ilssrahFromBook)
    expect(match[1]).toEqual("15")
})
test('level for dryad from easy tools', () => {
    let match = regex.searchForLevel(monStrings.dryadQueenFromEasyTools)
    expect(match[1]).toEqual("13")
})
//Traits
test('traits for illsrah', ()=> {
    let match = regex.searchForTraits(monStrings.ilssrahFromBook)
    expect(match[1]).toEqual("UNIQUE NE MEDIUM DWARF HUMANOID")
})
test('traits for dryad queen from easytools', () => {
    let match = regex.searchForTraits(monStrings.dryadQueenFromEasyTools)
    expect(match[1]).toEqual(`UNCOMMON
CG
MEDIUM
FEY
NYMPH
PLANT`)
})

//Perception
test('perception for cinder rat', ()=>{
    let match = regex.searchForPerceptionAndSenses(monStrings.cinderRat)
    expect(match[1]).toEqual("+9")
    expect(match[2]).toEqual(`darkvision, smoke vision
`)
})
test('perception for crag linnorm from book', ()=>{
    let match = regex.searchForPerceptionAndSenses(monStrings.cragLinnorm)
    expect(match[1]).toEqual("+26")
    expect(match[2]).toEqual(`darkvision, scent (imprecise) 60 feet, true seeing
`)
    
})
test('perception for dryad queen from easy tools', ()=>{
    let match = regex.searchForPerceptionAndSenses(monStrings.dryadQueenFromEasyTools)
    expect(match[1]).toEqual("+25")
    expect(match[2]).toEqual(`Low-Light Vision

`)
    
})
test('perception for balisse with multiple rolls', ()=>{
    let match = regex.searchForPerceptionAndSenses(monStrings.balisseFromBook)
    expect(match[1]).toEqual("+18")
    expect(match[2]).toEqual(` (+20 to detect lies and illusions); darkvision
`)
    
})
test('perception for lizardfolk defender with plain perc', ()=>{
    let match = regex.searchForPerceptionAndSenses(monStrings.lizardfolkDefenderFromBook)
    expect(match[1]).toEqual("+7")
    expect(match[2]).toEqual(`
`)
    
})
//Languages
test('languages for superlich', ()=>{
    let match = regex.searchForLanguages(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("Abyssal, Aklo, Common, Draconic, Elf, Infernal, Necril, Undercommon")
})
test('languages for dryad queen from easy tools', ()=>{
    let match = regex.searchForLanguages(monStrings.dryadQueenFromEasyTools)
    expect(match[1].trim()).toEqual("Common, Elven, Sylvan; speak with plants")

})
test('languages for cinder rat', ()=>{ //shouldn't find any
    let match = regex.searchForLanguages(monStrings.cinderRat)
    expect(match).toBeNull()
})
test('languages for Balisse', ()=>{ //has tongues
    let match = regex.searchForLanguages(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("Celestial, Draconic, Infernal; tongues")
})

//Skills
test('skills for dryad queen from book', ()=>{
    let match = regex.searchForSkills(monStrings.dryadQueenFromBook)
    expect(match[1].trim()).toEqual(`Acrobatics +25, Athletics +19, Crafting +23 (+25
woodworking), Deception +30, Diplomacy +30, Intimidation
+27, Nature +24, Performance +28, Stealth +25, Survival +24`)
})
test('skills for balisse', ()=>{
    let match = regex.searchForSkills(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("Acrobatics +14, Diplomacy +17, Religion +18")
})

//Attributes
test('str for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("+6")
})
test('str from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[1].trim()).toEqual("+2")
})
test('dex for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[2].trim()).toEqual("+4")
})
test('dex from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[2].trim()).toEqual("+6")
})
test('con for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[3].trim()).toEqual("+5")
})
test('con from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[3].trim()).toEqual("+6")
})
test('int for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[4].trim()).toEqual("+4")
})
test('int from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[4].trim()).toEqual("+4")
})
test('wis for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[5].trim()).toEqual("+8")
})
test('wis from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[5].trim()).toEqual("+4")
})
test('cha for illrash', ()=>{
    let match = regex.searchForAttributes(monStrings.ilssrahFromBook)
    expect(match[6].trim()).toEqual("+5")
})
test('cha from easytools', ()=>{
    let match = regex.searchForAttributes(monStrings.dryadQueenFromEasyTools)
    expect(match[6].trim()).toEqual("+8")
})
test('attributes for cinderrat', () => {
    let match = regex.searchForAttributes(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("+2")
    expect(match[2].trim()).toEqual("+3")
    expect(match[3].trim()).toEqual("+2")
    expect(match[4].trim()).toEqual("-4")
    expect(match[5].trim()).toEqual("+2")
    expect(match[6].trim()).toEqual("+0")
})
//Items
test('items for cinder rat (none there)', () => {
    let match = regex.searchForItems(monStrings.cinderRat)
    expect(match).toBeNull()
})
test('items for balisse - one item', () => {
    let match = regex.searchForItems(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("+1 striking scimitar")
})
test('items for dryad queen - no items, interaction abilities', () => {
    let match = regex.searchForItems(monStrings.dryadQueenFromBook)
    expect(match).toBeNull()
})
test('items for illsrah', () => {
    let match = regex.searchForItems(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("+2 resilient adamantine breastplate, Fleshroaster (+2 striking flaming spiked chain), +1 striking returning light hammer, good manacles (4), religious symbol of Droskar")
})
test('items for illsrahNotFixed', () => {
    let match = regex.searchForItems(monStrings.ilssrahFromBookItemNotFixed)
    expect(match[1].trim()).toEqual("+2 resilient adamantine breastplate, Fleshroaster")
})

//Interaction Abilities
test('intAbilities for illsrah - none but had items', () => {
    let match = regex.searchForInteractionAbilitiesAfterItems(monStrings.ilssrahFromBookItemNotFixed)
    expect(match[1].trim()).toEqual(`(+2 striking flaming spiked chain), +1 striking returning light
hammer, good manacles (4), religious symbol of Droskar`)
    let match2 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.ilssrahFromBookItemNotFixed)
    expect(match2).toBeNull()
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.ilssrahFromBookItemNotFixed)
    expect(realMatch1[1].trim()).toEqual(`(+2 striking flaming spiked chain), +1 striking returning light
hammer, good manacles (4), religious symbol of Droskar`)

    let match3 = regex.searchForInteractionAbilitiesAfterItems(monStrings.ilssrahFromBook)
    expect(match3).toBeNull()
    let match4 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.ilssrahFromBook)
    expect(match4).toBeNull()
    let realMatch2 = regex.searchForInteractionAbilities(monStrings.ilssrahFromBook)
    expect(realMatch2).toBeNull()
})


test('intAbilities for dryadFromBook', () => {
    let match = regex.searchForInteractionAbilitiesAfterItems(monStrings.dryadQueenFromBook)
    expect(match).toBeNull()
    let match2 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.dryadQueenFromBook)
    expect(match2[1].trim()).toEqual(`Nature Empathy 
As dryad.

Tied to the Land`)
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.dryadQueenFromBook)
    expect(realMatch1[1].trim()).toEqual(`Nature Empathy 
As dryad.

Tied to the Land`)
})

test('intabilities for dryad from easytools', () => {
    let match = regex.searchForInteractionAbilitiesAfterItems(monStrings.dryadQueenFromEasyTools)
    expect(match).toBeNull()
    let match2 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.dryadQueenFromEasyTools)
    expect(match2[1].trim()).toEqual(`Nature Empathy The dryad queen can use Diplomacy to Make an Impression on and make very simple Requests of animals and plants.

Tied to the Land A nymph queen is intrinsically tied to a specific region, such as a forest for a dryad queen. As long as the queen is healthy, the environment is exceptionally resilient, allowing the nymph queen to automatically attempt to counteract spells and rituals such as blight that would harm the environment, using her Spell DC with a counteract level equal to the highest-level druid spell she can cast. When the nymph queen becomes physically or psychologically unhealthy, however, her warded region eventually becomes twisted or unhealthy as well. In that case, restoring the nymph queen swiftly heals the entire region.`)
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.dryadQueenFromEasyTools)
    expect(realMatch1[1].trim()).toEqual(`Nature Empathy The dryad queen can use Diplomacy to Make an Impression on and make very simple Requests of animals and plants.

Tied to the Land A nymph queen is intrinsically tied to a specific region, such as a forest for a dryad queen. As long as the queen is healthy, the environment is exceptionally resilient, allowing the nymph queen to automatically attempt to counteract spells and rituals such as blight that would harm the environment, using her Spell DC with a counteract level equal to the highest-level druid spell she can cast. When the nymph queen becomes physically or psychologically unhealthy, however, her warded region eventually becomes twisted or unhealthy as well. In that case, restoring the nymph queen swiftly heals the entire region.`)    
})

test('intAbilities for crag linnorm', () => {
    let match1 = regex.searchForInteractionAbilitiesAfterItems(monStrings.cragLinnorm)
    expect(match1).toBeNull()
    let match2 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.cragLinnorm)
    expect(match2).toBeNull()
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.cragLinnorm)
    expect(realMatch1).toBeNull()
})

test('intAbilities for veshumirix', () => {
    let match1 = regex.searchForInteractionAbilitiesAfterItems(monStrings.veshumirix)
    expect(match1).toBeNull()
    let match2 = regex.searchForInteractionAbilitiesWithoutItems(monStrings.veshumirix)
    expect(match2).toBeNull()
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.veshumirix)
    expect(realMatch1).toBeNull()

})

test('intAbilities for unicorn With Items', () => {
    let match = regex.searchForInteractionAbilitiesAfterItems(monStrings.unicornWithItems)
    expect(match[1].trim()).toEqual(`Wild Empathy The unicorn has a connection to the creatures of the natural world that
allows it to communicate with them. The unicorn can use Diplomacy to Make an
Impression on animals and to make very simple Requests of them.`)
    let realMatch1 = regex.searchForInteractionAbilities(monStrings.unicornWithItems)
    expect(realMatch1[1].trim()).toEqual(`Wild Empathy The unicorn has a connection to the creatures of the natural world that
allows it to communicate with them. The unicorn can use Diplomacy to Make an
Impression on animals and to make very simple Requests of them.`)
})



test('intAbilities for superlich With Items', () => {
    let match = regex.searchForInteractionAbilitiesAfterItems(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual(`Thoughtsense (divination, mental, occult) The cauthooj senses a creatures mental essence at the listed ranged.`)
})
//AC
test('AC for veshumirix', () => {
    let match = regex.searchForAC(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("39")
    expect(match[2]).toBeUndefined()
})
test('AC for lizardfolk with special', () => {
    let match = regex.searchForAC(monStrings.lizardfolkDefenderFromBook)
    expect(match[1].trim()).toEqual("16")
    expect(match[2].trim()).toEqual("(18 with shield raised)")
})
test('AC for graveshell with special', () => {
    let match = regex.searchForAC(monStrings.graveshell)
    expect(match[1].trim()).toEqual("17")
    expect(match[2].trim()).toEqual("(19 while withdrawn into its shell)")
})
test('AC for animatedBroom with special', () => {
    let match = regex.searchForAC(monStrings.animatedBroom)
    expect(match[1].trim()).toEqual("16")
    expect(match[2].trim()).toEqual("(14 when broken); construct armor")
})
test('AC for crag linnorm', () => {
    let match = regex.searchForAC(monStrings.cragLinnorm)
    expect(match[1].trim()).toEqual("37")
    expect(match[2]).toBeUndefined()
})
test('AC for lich from book', () => {
    let match = regex.searchForAC(monStrings.lichFromBook)
    expect(match[1].trim()).toEqual("31")
    expect(match[2]).toBeUndefined()
})
test('AC for slurk', () => {
    let match = regex.searchForAC(monStrings.slurk)
    expect(match[1].trim()).toEqual("17")
    expect(match[2]).toBeUndefined()
})
//Fort
test('Fort for slurk', () => { //has savedetail for Fort
    let match = regex.searchForFort(monStrings.slurk)
    expect(match[1].trim()).toEqual("+10")
    expect(match[2].trim()).toEqual("(+12 vs. Grapple or Shove)")
})
test('Fort for unicorn', () => { //has savedetail for will
    let match = regex.searchForFort(monStrings.unicorn)
    expect(match[1].trim()).toEqual("+10")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Fort for superlich', () => {
    let match = regex.searchForFort(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("+12")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Fort for illsrah', () => {
    let match = regex.searchForFort(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("+27")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Fort for veshumirix', () => {
    let match = regex.searchForFort(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("+29")
    expect(match[2]?.trim()).toBeFalsy()
})
//Reflex
test('Reflex for slurk', () => { //has savedetail for Fort
    let match = regex.searchForRef(monStrings.slurk)
    expect(match[1].trim()).toEqual("+6")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Reflex for unicorn', () => { //has savedetail for will
    let match = regex.searchForRef(monStrings.unicorn)
    expect(match[1].trim()).toEqual("+8")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Reflex for superlich', () => {
    let match = regex.searchForRef(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("+8")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Reflex for illsrah', () => {
    let match = regex.searchForRef(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("+24")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Reflex for veshumirix', () => {
    let match = regex.searchForRef(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("+28")
    expect(match[2]?.trim()).toBeFalsy()
})
//Will
test('Will for slurk', () => { //has savedetail for Fort
    let match = regex.searchForWill(monStrings.slurk)
    expect(match[1].trim()).toEqual("+4")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Will for unicorn', () => { //has savedetail for will
    let match = regex.searchForWill(monStrings.unicorn)
    expect(match[1].trim()).toEqual("+11")
    expect(match[2].trim()).toEqual("(+2 vs. mental)")
})
test('Will for superlich', () => {
    let match = regex.searchForWill(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("+11")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Will for illsrah', () => {
    let match = regex.searchForWill(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("+30")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Will for veshumirix', () => {
    let match = regex.searchForWill(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("+26")
    expect(match[2]?.trim()).toBeFalsy()
})
test('Will for super lich', () => {
    let match = regex.searchForWill(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("+11")
    expect(match[2]?.trim()).toBeFalsy()
})
//All Save Special

test('All Save for slurk', () => { 
    let match = regex.searchForAllSaveDetail(monStrings.slurk)
    expect(match).toBeNull()
})
test('All Save for unicorn', () => { 
    let match = regex.searchForAllSaveDetail(monStrings.unicorn)
    expect(match).toBeNull()
})
test('All Save for superlich', () => { //Has all save special
    let match = regex.searchForAllSaveDetail(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("+1 status to all saves vs. disease (against diseases, critical failures become failures)")
})
test('All Save for cragLinnorm', () => { //Has all save special
    let match = regex.searchForAllSaveDetail(monStrings.cragLinnorm)
    expect(match[1].trim()).toEqual("+1 status to all saves vs. magic")
})
test('All Save for illsrah', () => {
    let match = regex.searchForAllSaveDetail(monStrings.ilssrahFromBook)
    expect(match).toBeNull()
})
test('All Save for veshumirix', () => { //Has all save special
    let match = regex.searchForAllSaveDetail(monStrings.veshumirix)
    expect(match[1].trim()).toEqual(`+1 status to all saves
vs. magic`)
})
//HP
test('HP for illsrah', () => {
    let match = regex.searchForHP(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("270")
    expect(match[2]?.trim()).toBeFalsy()
})
test('HP for cinder rat', () => {
    let match = regex.searchForHP(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("45")
    expect(match[2]?.trim()).toBeFalsy()
})
test('HP for Balisse', () => {
    let match = regex.searchForHP(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("145")
    expect(match[2]?.trim()).toBeFalsy()
})
test('HP for unicorn', () => {
    let match = regex.searchForHP(monStrings.unicorn)
    expect(match[1].trim()).toEqual("45")
    expect(match[2]?.trim()).toBeFalsy()
})
test('HP for superlich', () => {
    let match = regex.searchForHP(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual("190")
    expect(match[2].trim()).toEqual("negative healing, rejuvenation")
})

test('HP for lich', () => {
    let match = regex.searchForHP(monStrings.lichFromBook)
    expect(match[1].trim()).toEqual("190")
    expect(match[2].trim()).toEqual("negative healing, rejuvenation")
})
//Immunities
test('Immunities for illsrah', () => {
    let match = regex.searchForImmunities(monStrings.ilssrahFromBook)
    expect(match).toBeNull()
})
test('Immunities for cinder rat', () => {
    let match = regex.searchForImmunities(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("bleed, fire, paralyzed, poison, sleep")
})
test('Immunities for Balisse', () => {
    let match = regex.searchForImmunities(monStrings.balisseFromBook)
    expect(match).toBeNull()
    
})
test('Immunities for veshumirix', () => {
    let match = regex.searchForImmunities(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("fire, paralyzed, sleep")
})
test('Immunities for lichfrombook', () => {
    let match = regex.searchForImmunities(monStrings.lichFromBook)
    expect(match[1].trim()).toEqual(`death effects, disease,
paralyzed, poison, unconscious`)
})
//Weaknesses
test('Weaknesses for illsrah', () => {
    let match = regex.searchForWeaknesses(monStrings.ilssrahFromBook)
    expect(match).toBeNull()
})
test('Weaknesses for cinder rat', () => {
    let match = regex.searchForWeaknesses(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("cold 5")
})
test('Weaknesses for Balisse', () => {
    let match = regex.searchForWeaknesses(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("evil 10")
})
test('Weaknesses for veshumirix', () => {
    let match = regex.searchForWeaknesses(monStrings.veshumirix)
    expect(match[1].trim()).toEqual("cold 15")
})
test('Weaknesses for lichfrombook', () => {
    let match = regex.searchForWeaknesses(monStrings.lichFromBook)
    expect(match).toBeNull()
    
})
test('Weaknesses for dryadfrombook', () => {
    let match = regex.searchForWeaknesses(monStrings.dryadQueenFromBook)
    expect(match[1].trim()).toEqual(`cold iron 10, fire 10`)
})
//Resistances
test('Resistances for illsrah', () => {
    let match = regex.searchForResistances(monStrings.ilssrahFromBook)
    expect(match).toBeNull()
})
test('Resistances for cinder rat', () => {
    let match = regex.searchForResistances(monStrings.cinderRat)
    expect(match).toBeNull()
})
test('Resistances for Balisse', () => {
    let match = regex.searchForResistances(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("fire 15")
})
test('Resistances for veshumirix', () => {
    let match = regex.searchForResistances(monStrings.veshumirix)
    expect(match).toBeNull()
})
test('Resistances for lichfrombook', () => {
    let match = regex.searchForResistances(monStrings.lichFromBook)
    expect(match[1].trim()).toEqual(`cold 10, physical 10 (except
magic bludgeoning)`)
})
//Defensive Abilities
test('defAbilities for illsrah', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual("Attack of Opportunity [reaction]")
})
test('defAbilities for cinderrat', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.cinderRat)
    expect(match[1].trim()).toEqual(`Fetid Fumes (aura, fire) 5 feet. A creature that enters the aura or begins its turn there
must succeed at a DC 22 Fortitude save or become sickened 1. Everything within
the aura, including the cinder rat, is concealed by smoke.`)
})
test('defAbilities for balisse', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual(`Confessor’s Aura (aura, divine, enchantment, mental) 20 feet. Creatures in the balisse’s
aura are subject to zone of truth (DC 23). Additionally, if these creatures choose to
honestly express their own conflicted feelings, the aura makes it easier for them to
put words to those feelings.`)
})
test('defAbilities for dryadFromBook', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.dryadQueenFromBook)
    expect(match[1].trim()).toEqual(`Nymph’s Beauty (aura, emotion, enchantment, incapacitation, mental, primal,
visual) DC 30. On a failed save, the target is immobilized in awe for 1 minute.`)
})
test('defAbilities for lich', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.lichFromBook)
    expect(match[1].trim()).toEqual(`Frightful Presence (aura, emotion, fear, mental) 60 feet, DC 29
Counterspell [reaction] Trigger A creature casts a spell the lich has prepared. Effect
The lich expends a prepared spell to counter the triggering creature’s
casting of that same spell. The lich loses its spell slot as if it had cast the
triggering spell. The lich then attempts to counteract the triggering spell.`)
})
test('defAbilities for slurk', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.slurk)
    expect(match).toBeNull()
})
test('defAbilities for astradaemon', () => {
    let match = regex.searchForDefensiveAbilities(monStrings.astradaemon)
    expect(match[1].trim()).toEqual(`Soul Siphon (aura, divine, force, necromancy) 30 feet. An astradaemon draws power
from the souls of the recently slain. If a Small or larger living creature dies within its
aura, the astradaemon gains 5 temporary Hit Points and a +1 status bonus to attack
and damage rolls for 1 round, unless the creature was slain by an astradaemon’s
Devour Soul ability. Incorporeal undead and living spirits traveling outside the
body take 1d8 force damage each round within the daemon’s aura from
the spiritual pressure as the astradaemon pulls in fragments of their soul.
Displacement (divine, illusion, visual) An astradaemon bends light, appearing
shifted from its true position, though still in the same space. Creatures
targeting the astradaemon must attempt a DC 11 flat check, as if the
astradaemon were hidden, even though it remains observed. Effects such as the
Blind-Fight feat and halfling’s keen eyes that apply on the flat check against
hidden creatures also apply against a displaced astradaemon.`)
})
//Speed
test('speed for dryad', () => {
    let match = regex.searchForSpeed(monStrings.dryadQueenFromBook)
    expect(match[1].trim()).toEqual("30 feet")
})
test('speed for balisse', () => {
    let match = regex.searchForSpeed(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual("30 feet, fly 40 feet")
})
test('speed for cinderrat', () => {
    let match = regex.searchForSpeed(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("40 feet")
})
//Strikes's
test('Strikes for cinderrat', () => {
    let match = regex.searchForStrikes(monStrings.cinderRat)
    expect(match[1].trim()).toEqual("Melee [one-action] jaws +10 (finesse), Damage 1d8+4 fire plus 1d4 persistent fire")
})
test('Strikes for illsrah', () => {
    let match = regex.searchForStrikes(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual(`Melee [one-action] Fleshroaster +31 (disarm, finesse, magical, trip),
Damage 2d8+14 slashing plus 1d6 fire
Melee [one-action] returning light hammer +30 (agile, magical),
Damage 2d6+14 bludgeoning
Ranged [one-action] returning light hammer +28 (agile, magical,
thrown 20 feet), Damage 2d6+14 bludgeoning`)
})
test('Strikes for unicorn', () => {
    let match = regex.searchForStrikes(monStrings.unicorn)
    expect(match[1].trim()).toEqual(`Melee [one-action]horn +12 (good, magical), Damage 1d10+4 piercing plus 1d6 good and ghost touch
Melee [one-action] hoof +12 (agile, magical), Damage 1d8+4 bludgeoning and ghost touch`)
})
test('Strikes for balisse', () => {
    let match = regex.searchForStrikes(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual(`Melee [one-action] flaming scimitar +20 (fire, forceful, good, magical, sweep), Damage 2d6+8
slashing plus 1d6 fire and 1d6 good`)
})
test('Strikes for veshumirix', () => {
    let match = regex.searchForStrikes(monStrings.veshumirix)
    expect(match[1].trim()).toEqual(`Melee [one-action] jaws +33 (magical, reach 15
feet), Damage 3d10+15 piercing plus 4d6 fire
Melee [one-action] claw +33 (agile, magical, reach 10 feet),
Damage 3d10+15 slashing
Melee [one-action] tail +31 (magical, reach 20 feet),
Damage 2d12+15 bludgeoning
Melee [one-action] horns +31 (magical, reach 15 feet), Damage
2d12+15 piercing`)
})
test('Strikes for cragLinnorm', () => {
    let match = regex.searchForStrikes(monStrings.cragLinnorm)
    expect(match[1].trim()).toEqual(`Melee [one-action] jaws +30 (reach 20 feet, magical), Damage 3d12+14 piercing plus crag
linnorm venom
Melee [one-action] claw +30 (reach 20 feet, magical), Damage 3d8+14 slashing
Melee [one-action] tail +30 (reach 20 feet, magical), Damage 3d6+14 bludgeoning plus
Improved Grab`)
})
test('Strikes for astradaemon', () => {
    let match = regex.searchForStrikes(monStrings.astradaemon)
    expect(match[1].trim()).toEqual(`Melee [one-action] jaws +32 (evil, magical, reach 10 feet), Damage 3d8+9 piercing plus 1d6
evil, essence drain, and Grab
Melee [one-action] claw +32 (agile, evil, magical, reach 10 feet), Damage
3d6+9 slashing plus 1d6 evil and Essence Drain
Melee [one-action] tail +32 (evil, magical, reach 15 feet), Damage
3d10+9 bludgeoning plus 1d6 evil and Essence Drain`)
})
test('Strikes for superlich', () => {
    let match = regex.searchForStrikes(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual(`Melee  hand +24 (finesse, magical), Damage 4d8 negative plus paralyzing touch

Melee  jaws +36 (magical, reach 20 feet), Damage 3d12+20 piercing plus 4d6 fire`)
})
test('Strikes for theletos', () => {
    let match = regex.searchForStrikes(monStrings.theletos)
    expect(match[1].trim()).toEqual(`Melee [one-action] fist +17 (lawful, magical),
Damage 2d10+4 bludgeoning plus 1d6
lawful
Melee [one-action] tentacle +17 (agile,
lawful, magical), Damage
2d8+4 slashing plus 1d6 lawful
and fate drain`)
})
//Spell lists
test('spells for superlich', () => {
    let match = regex.searchForSpellLists(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual(`Arcane Prepared Spells DC 36, attack +26; 6th chain lightning, dominate, vampiric exsanguination; 5th cloudkill, cone of cold (×2), wall of ice; 4th dimension door, dispel magic, fire shield, fly; 3rd blindness, locate, magic missile, vampiric touch; 2nd false life, mirror image, resist energy, see invisibility; 1st fleet step, ray of enfeeblement (×2), true strike; Cantrips (6th) detect magic, mage hand, message, ray of frost, shield

Divine Spontaneous Spells DC 35, attack +30;
6th (4 slots) field of life, heal, spirit blast; 5th
(4 slots) death ward, dispel magic, sending; 4th
(4 slots) freedom of movement, read omens,
spell immunity; 3rd (4 slots) blindness, crisis
of faith, dream message; 2nd (4 slots) calm
emotions, see invisibility, silence; 1st (4
slots) bane, bless, ray of enfeeblement;
Cantrips (8th) chill touch, detect magic,
disrupt undead, read aura, stabilize
Divine Innate Spells DC 37; 4th talking corpse;
Constant (5th) tongues, (2nd) speak with
animals, spider climb
Divine Rituals DC 37; call spirit`)
})
test('spells for dryadqueenfrombook', () => {
    let match = regex.searchForSpellLists(monStrings.dryadQueenFromBook)
    expect(match[1].trim()).toEqual(`Primal Prepared Spells DC 35, attack +25; 7th regenerate, summon plant
or fungus; 6th baleful polymorph, chain lightning, tangling creepers;
5th cone of cold, death ward, heal; 4th fly, resist energy, stoneskin;
3rd earthbind, haste, wall of thorns; 2nd animal messenger, faerie
fire, remove fear; 1st fleet step, gust of wind, negate aroma; Cantrips
(7th) detect magic, guidance, light, ray of frost, stabilize
Primal Innate Spells DC 35, attack +25; 8th impaling briars (Core Rulebook 400),
5th tree stride (×3); 4th charm (at will), suggestion (at will); 3rd entangle (at will),
sleep (at will); 2nd shape wood (at will), tree shape (at will); Cantrips (5th) tanglefoot;
Constant (4th) speak with plants`)
})
test('spells for unicorn', () => {
    let match = regex.searchForSpellLists(monStrings.unicorn)
    expect(match[1].trim()).toEqual(`Primal Innate Spells DC 21; 5th tree stride; 3rd heal (×2), neutralize
poison; 1st detect alignment (at will, good only); Cantrips (2nd)
light`)
})
test('spells for cinderrat', () => {
    let match = regex.searchForSpellLists(monStrings.cinderRat)
    expect(match).toBeNull()
})
test('spells for Theletos', () => {
    let match = regex.searchForSpellLists(monStrings.theletos)
    expect(match[1].trim()).toEqual(`Divine Innate Spells DC 25, attack
+17; 4th augury (at will), charm,
dispel magic, enthrall, outcast’s curse,
remove curse, suggestion, touch of idiocy
Rituals DC 25; geas`)
})
//Offensive Abilities
test('offAbil for cinderrat', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.cinderRat)
    expect(match).toBeNull()
})
test('offAbil for superlich', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.superlichFromAoN)
    expect(match[1].trim()).toEqual(`Drain Phylactery  Frequency once per day; Effect The lich taps into its phylactery’s power to cast any arcane spell up to 6th level, even if the spell being cast is not one of the lich’s prepared spells. The lich’s phylactery doesn’t need to be present for the lich to use this ability.

Paralyzing Touch (arcane, curse, incapacitation, necromancy) A creature damaged by the lich’s hand Strike must succeed at a Fortitude save against DC 32. The creature becomes paralyzed for 1 round on a failure. On a critical failure, the creature is paralyzed permanently, falls prone, and seems dead. A DC 25 Medicine check reveals the victim is alive.

Steady Spellcasting If a reaction would disrupt the lich’s spellcasting action, the lich attempts a DC 15 flat check. On a success, the action isn’t disrupted.`)
})
test('offAbil for Balisse', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.balisseFromBook)
    expect(match[1].trim()).toEqual(`Brand of the Impenitent [two-actions] (curse, divine, evocation)
Frequency once per day; Effect The balisse marks
an evil creature within its confessor’s aura as
irredeemable. It can only do so after a failed
attempt to convince the creature to repent. The
touched creature takes a –1 status penalty to AC
and saves, reduces its resistances by 2, and gains
weakness 2 to good damage. The duration depends on
the target’s DC 26 Will save.
Critical Success The creature is unaffected.
Success The duration is 1 round.
Failure The duration is 1 day.
Critical Failure The duration is permanent.
Flaming Armament (divine, evocation) Any
weapon gains the effect of a flaming property
rune while a balisse wields it.
Guiding Angel [one-action] (divine, transmutation)
While invisible, a balisse can spiritually
attach itself to a non-evil mortal. When it
does so, it merges with the mortal’s body and
is unable to use any of its spells and abilities
other than to interact with the mortal. It must
use Guiding Angel again to leave the mortal. While
merged with the mortal, the balisse can take a form
of its choice that only the mortal can see, such as a
small angel on the mortal’s shoulder. Alternatively, it
can communicate with the mortal using a bodiless
voice only the mortal can hear.`)
})
test('offAbil for illsrah', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.ilssrahFromBook)
    expect(match[1].trim()).toEqual(`Efficient Capture [three-actions] (attack, manipulate) Requirements
Ilssrah has manacles in hand and is adjacent to a
creature. Effect Ilssrah attempts to bind the creature’s
wrists or ankles with the manacles. If she succeeds at an
attack roll with a +30 modifier against the target’s AC,
she applies the manacles.
Hammer the Chained [two-actions] Ilssrah attempts a melee Strike
with Fleshroaster. If she hits, she also draws her light
hammer, makes a melee Strike with it against the same
target, and immediately returns it to
her belt. She then resumes her grip
on Fleshroaster. Both Strikes count
toward Ilssrah’s multiple attack penalty, but the penalty
doesn’t increase until both Strikes have been made.
If the hammer Strike hits, it deals damage as normal
and the target must attempt a DC 35 Fortitude save.
Critical Success The creature is unaffected.
Success The creature is clumsy 1 and stupefied 1 for 1 round.
Failure The creature is clumsy 1 and stupefied 1 for
1 minute.
Critical Failure The creature is clumsy 2 and stupefied 2
for 1 minute.`)
})
test('offabil for unicorn', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.unicorn)
    expect(match[1].trim()).toEqual(`Ghost Touch A unicorn’s Strikes have the effects of a
ghost touch property rune.
Powerful Charge [two-actions] The unicorn Strides up to
double its Speed in a straight line and then
makes a horn Strike. If the unicorn moved
at least 20 feet, it deals an additional
2d6 damage on a hit.`)
})
test('offAbil for cragLinnorm', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.cragLinnorm)
    expect(match[1].trim()).toEqual(`Breath Weapon [two-actions] (evocation, fire, primal) The crag linnorm breathes out a stream
of magma in a 120-foot line that deals 12d6 fire damage to creatures within
the area (DC 34 basic Reflex save). Any creature that fails its
save also takes 4d6 persistent fire damage. The crag linnorm
can’t use Breath Weapon again for 1d4 rounds. The magma
remains until the start of the linnorm's next turn. If the
linnorm was on the ground, the magma remains as a
burning line on the ground directly under the line of
the Breath Weapon, and if the linnorm was airborne,
the magma rains downward in a sheet 60 feet high.
Any creature that moves across or through the
magma takes 6d6 fire damage (DC 34 basic Reflex
save). At the start of the linnorm's next turn,
the magma cools to a thin layer of brittle
stone on the ground, or the magma rain
finishes falling and turns to harmless
pebbles. The cooled magma quickly
degrades to powder and sand over the
course of several hours.
Constrict [one-action] 2d6+14 bludgeoning, DC 34
Crag Linnorm Venom (fire, injury, poison)
Saving Throw DC 34
Fortitude; Maximum
Duration 10 rounds;
Stage 1 4d6 fire damage
and drained 1; Stage 2 6d6 fire damage and drained 2.`)
})
test('offAbil for veshumirix', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.veshumirix)
    expect(match[1].trim()).toEqual(`Breath Weapon [two-actions] (evocation, fire, primal) Veshumirix
breathes a blast of magma that deals 9d6 fire damage
and 4d12 bludgeoning damage in a 60-foot cone (DC 42
basic Reflex save). He can’t use Breath Weapon again for
1d4 rounds.
Draconic Frenzy [two-actions] As young magma dragon (page 80).
Draconic Momentum As young magma dragon (page 80).
Magma Swim As young magma dragon (page 80).
Volcanic Purge [one-action] As adult magma dragon (page 80), but
the damage is 4d6.`)
})
test('offAbil for a messed up monster with no spells or strikes', () => {
    expect(() => {regex.searchForOffensiveAbilities(monStrings.cinderRatMessedUp) }).toThrow()
})
test('offAbil for theletos', () => {
    let match = regex.searchForOffensiveAbilities(monStrings.theletos)
    expect(match[1].trim()).toEqual(`Fate Drain (curse, divine, mental) A creature
damaged by the theletos’s tentacle must
succeed at a DC 22 Will save or become
stupefied 1. As long as the creature is stupefied, it can
no longer benefit from fortune effects. If the target fails additional
saves against this ability, the condition value increases by 1 (to a
maximum of stupefied 4). This condition value decreases by 1
every 24 hours.
Wrath of Fate [two-actions] (curse, divine, mental, misfortune) The
theletos releases a 60-foot cone of energy from its center.
Creatures in the cone become overwhelmed with
the knowledge of various fates that destiny has in
store for them and lack of clear pathways to
these potential futures. They must succeed at 
a DC 26 Will save or be slowed 1 indefinitely. An affected creature can choose to roll
twice when it attempts an attack, saving throw, or skill check and take the lower result.
Regardless of the outcome, that creature is no longer slowed after that roll. The theletos
can’t use Wrath of Fate again for 1d4 rounds.`)
})