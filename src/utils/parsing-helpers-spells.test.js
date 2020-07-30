import * as parsingHelper from './parsing-helpers.js'

test('spellList -> Array with 1 spellList - prepared', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray(`Primal Prepared Spells DC 35, attack +25; 7th regenerate, summon plant
or fungus; 6th baleful polymorph, chain lightning, tangling creepers;
5th cone of cold, death ward, heal; 4th fly, resist energy, stoneskin;
3rd earthbind, haste, wall of thorns; 2nd animal messenger, faerie
fire, remove fear; 1st fleet step, gust of wind, negate aroma; Cantrips
(7th) detect magic, guidance, light, ray of frost, stabilize`))
    .toEqual([`Primal Prepared Spells DC 35, attack +25; 7th regenerate, summon plant or fungus; 6th baleful polymorph, chain lightning, tangling creepers; 5th cone of cold, death ward, heal; 4th fly, resist energy, stoneskin; 3rd earthbind, haste, wall of thorns; 2nd animal messenger, faerie fire, remove fear; 1st fleet step, gust of wind, negate aroma; Cantrips (7th) detect magic, guidance, light, ray of frost, stabilize`])
})
test('spellList -> Array with 1 spellList - spontaneous', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray(`Divine Spontaneous Spells DC 35, attack +30;
6th (4 slots) field of life, heal, spirit blast; 5th
(4 slots) death ward, dispel magic, sending; 4th
(4 slots) freedom of movement, read omens,
spell immunity; 3rd (4 slots) blindness, crisis
of faith, dream message; 2nd (4 slots) calm
emotions, see invisibility, silence; 1st (4
slots) bane, bless, ray of enfeeblement;
Cantrips (8th) chill touch, detect magic,
disrupt undead, read aura, stabilize`))
.toEqual(["Divine Spontaneous Spells DC 35, attack +30; 6th (4 slots) field of life, heal, spirit blast; 5th (4 slots) death ward, dispel magic, sending; 4th (4 slots) freedom of movement, read omens, spell immunity; 3rd (4 slots) blindness, crisis of faith, dream message; 2nd (4 slots) calm emotions, see invisibility, silence; 1st (4 slots) bane, bless, ray of enfeeblement; Cantrips (8th) chill touch, detect magic, disrupt undead, read aura, stabilize"])
})
test('spellList -> Array with 1 spellList - innate', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray("Primal Innate Spells DC 33; Constant (6th) freedom of movement; (5th) true seeing"))
        .toEqual(["Primal Innate Spells DC 33; Constant (6th) freedom of movement; (5th) true seeing"])
})
test('spellList -> Array with 1 spellList - ritual', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray("Divine Rituals DC 37; call spirit"))
        .toEqual(["Divine Rituals DC 37; call spirit"])
})

test('spellList -> Array with 2 spellList - prepared+innate', ()=>{    
    expect(parsingHelper.splitMultipleSpellStringToArray(`Primal Prepared Spells DC 35, attack +25; 7th regenerate, summon plant
or fungus; 6th baleful polymorph, chain lightning, tangling creepers;
5th cone of cold, death ward, heal; 4th fly, resist energy, stoneskin;
3rd earthbind, haste, wall of thorns; 2nd animal messenger, faerie
fire, remove fear; 1st fleet step, gust of wind, negate aroma; Cantrips
(7th) detect magic, guidance, light, ray of frost, stabilize
Primal Innate Spells DC 35, attack +25; 8th impaling briars (Core Rulebook 400),
5th tree stride (×3); 4th charm (at will), suggestion (at will); 3rd entangle (at will),
sleep (at will); 2nd shape wood (at will), tree shape (at will); Cantrips (5th) tanglefoot;
Constant (4th) speak with plants`))
    .toEqual([`Primal Prepared Spells DC 35, attack +25; 7th regenerate, summon plant or fungus; 6th baleful polymorph, chain lightning, tangling creepers; 5th cone of cold, death ward, heal; 4th fly, resist energy, stoneskin; 3rd earthbind, haste, wall of thorns; 2nd animal messenger, faerie fire, remove fear; 1st fleet step, gust of wind, negate aroma; Cantrips (7th) detect magic, guidance, light, ray of frost, stabilize`,
`Primal Innate Spells DC 35, attack +25; 8th impaling briars (Core Rulebook 400), 5th tree stride (×3); 4th charm (at will), suggestion (at will); 3rd entangle (at will), sleep (at will); 2nd shape wood (at will), tree shape (at will); Cantrips (5th) tanglefoot; Constant (4th) speak with plants`])
})
test('spellList -> Array with 2 spellList - spontaneous+focus', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray(`Divine Prepared Spells DC 36, attack +32; 8th
divine aura, harm (×6), spiritual epidemic; 7th
divine decree, energy aegis, heal; 6th blade barrier,
heroism, true seeing; 5th death ward, heal, sending;
4th air walk, anathematic reprisal, divine wrath; 3rd
circle of protection, locate (×2); 2nd augury, darkness,
silence; 1st command, purify food and drink, ray of
enfeeblement; Cantrips (8th) detect magic, disrupt
undead, message, shield, sigil
Cleric Domain Spells 3 Focus Points, DC 36; 8th
commanding lash (Core Rulebook 390), touch of
obedience (Core Rulebook 398)`))
    .toEqual([`Divine Prepared Spells DC 36, attack +32; 8th divine aura, harm (×6), spiritual epidemic; 7th divine decree, energy aegis, heal; 6th blade barrier, heroism, true seeing; 5th death ward, heal, sending; 4th air walk, anathematic reprisal, divine wrath; 3rd circle of protection, locate (×2); 2nd augury, darkness, silence; 1st command, purify food and drink, ray of enfeeblement; Cantrips (8th) detect magic, disrupt undead, message, shield, sigil`,
`Cleric Domain Spells 3 Focus Points, DC 36; 8th commanding lash (Core Rulebook 390), touch of obedience (Core Rulebook 398)`])
})

test('spellList -> Array with 4 spellList - prepared+spontaneous+innate+ritual', ()=>{
    expect(parsingHelper.splitMultipleSpellStringToArray(`Arcane Prepared Spells DC 36, attack +26; 6th chain lightning, dominate, vampiric exsanguination; 5th cloudkill, cone of cold (×2), wall of ice; 4th dimension door, dispel magic, fire shield, fly; 3rd blindness, locate, magic missile, vampiric touch; 2nd false life, mirror image, resist energy, see invisibility; 1st fleet step, ray of enfeeblement (×2), true strike; Cantrips (6th) detect magic, mage hand, message, ray of frost, shield

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
Divine Rituals DC 37; call spirit`))
    .toEqual([`Arcane Prepared Spells DC 36, attack +26; 6th chain lightning, dominate, vampiric exsanguination; 5th cloudkill, cone of cold (×2), wall of ice; 4th dimension door, dispel magic, fire shield, fly; 3rd blindness, locate, magic missile, vampiric touch; 2nd false life, mirror image, resist energy, see invisibility; 1st fleet step, ray of enfeeblement (×2), true strike; Cantrips (6th) detect magic, mage hand, message, ray of frost, shield`,
`Divine Spontaneous Spells DC 35, attack +30; 6th (4 slots) field of life, heal, spirit blast; 5th (4 slots) death ward, dispel magic, sending; 4th (4 slots) freedom of movement, read omens, spell immunity; 3rd (4 slots) blindness, crisis of faith, dream message; 2nd (4 slots) calm emotions, see invisibility, silence; 1st (4 slots) bane, bless, ray of enfeeblement; Cantrips (8th) chill touch, detect magic, disrupt undead, read aura, stabilize`,
"Divine Innate Spells DC 37; 4th talking corpse; Constant (5th) tongues, (2nd) speak with animals, spider climb",
"Divine Rituals DC 37; call spirit"])
})

test('spellName with no detail text', () => {
    expect(parsingHelper.spellNameAndDetailToSpellObj("dimension door")).toEqual({spellName: "dimension door"})
    expect(parsingHelper.spellNameAndDetailToSpellObj("dimension door ")).toEqual({spellName: "dimension door"})
    expect(parsingHelper.spellNameAndDetailToSpellObj(" dimension door")).toEqual({spellName: "dimension door"})
})

test('spellName with detailText', () => {
    expect(parsingHelper.spellNameAndDetailToSpellObj("dimension door (at will)")).toEqual({spellName: "dimension door", detailText: "(at will)"})
    expect(parsingHelper.spellNameAndDetailToSpellObj("dimension door (Core Rulebook 234) ")).toEqual({spellName: "dimension door", detailText: "(Core Rulebook 234)"})
})

test('parseSpellEntry with only one spell', () => {
    expect(parsingHelper.parseSpellEntry("Divine Innate Spells DC 20; Cantrips (3rd) light"))
})
test('parseSpellEntry for prepared', () => {
    expect(parsingHelper.parseSpellEntry("Arcane Prepared Spells DC 36, attack +26; 6th chain lightning, dominate, vampiric exsanguination; 5th cloudkill, cone of cold (×2), wall of ice; 4th dimension door, dispel magic, fire shield, fly; 3rd blindness, locate, magic missile, vampiric touch; 2nd false life, mirror image, resist energy, see invisibility; 1st fleet step, ray of enfeeblement (×2), true strike; Cantrips (6th) detect magic, mage hand, message, ray of frost, shield"))
        .toEqual({
            name: "Arcane Prepared Spells",
            "DC": "36",
            "attackMod": "+26",
            isFocus: false,
            isRituals: false,
            isSpontaneous: false,
            numFocusPoints: 0,
            spellCastType: "prepared",
            tradition: "arcane",
            "spellLevels": [
                {
                    "spells": [
                        { "spellName": "chain lightning" },
                        { "spellName": "dominate" },
                        { "spellName": "vampiric exsanguination" }
                    ],
                    "level": "6th",
                    numUses: 3,
                    spellLvl: 6
                },
                {
                    "spells": [
                        { "spellName": "cloudkill" },
                        { "spellName": "cone of cold", "detailText": "(×2)" },
                        { "spellName": "wall of ice" }
                ],
                    "level": "5th",
                    numUses: 4,
                    spellLvl: 5
                },
                {
                    "spells": [
                        { "spellName": "dimension door" },
                        { "spellName": "dispel magic" },
                        { "spellName": "fire shield" },
                        { "spellName": "fly" }
                    ],
                    "level": "4th",
                    numUses: 4,
                    spellLvl: 4
                },
                {
                    "spells": [
                        { "spellName": "blindness" },
                        { "spellName": "locate" },
                        { "spellName": "magic missile" },
                        { "spellName": "vampiric touch" }
                    ],
                    "level": "3rd",
                    numUses: 4,
                    spellLvl: 3
                },
                {
                    "spells": [
                        { "spellName": "false life" },
                        { "spellName": "mirror image" },
                        { "spellName": "resist energy" },
                        { "spellName": "see invisibility" }
                    ],
                    "level": "2nd",
                    numUses: 4,
                    spellLvl: 2
                },
                {
                    "spells": [
                        { "spellName": "fleet step" },
                        { "spellName": "ray of enfeeblement", "detailText": "(×2)" },
                        { "spellName": "true strike" }
                    ],
                    "level": "1st",
                    numUses: 4,
                    spellLvl: 1
                },
                {
                "spells": [
                    { "spellName": "detect magic" },
                    { "spellName": "mage hand" },
                    { "spellName": "message" },
                    { "spellName": "ray of frost" },
                    { "spellName": "shield" }
                ],
                "level": "Cantrips (6th)",
                numUses: 5,
                spellLvl: 0
                }
            ]
        })
})
test('parseSpellEntry for spontaneous', () => {
    expect(parsingHelper.parseSpellEntry("Divine Spontaneous Spells DC 35, attack +30; 6th (4 slots) field of life, heal, spirit blast; 5th (4 slots) death ward, dispel magic, sending; 4th (4 slots) freedom of movement, read omens, spell immunity; 3rd (4 slots) blindness, crisis of faith, dream message; 2nd (4 slots) calm emotions, see invisibility, silence; 1st (4 slots) bane, bless, ray of enfeeblement; Cantrips (8th) chill touch, detect magic, disrupt undead, read aura, stabilize"))
    .toEqual({
        name: "Divine Spontaneous Spells",
        "DC": "35",
        "attackMod": "+30",
        isFocus: false,
        isRituals: false,
        isSpontaneous: true,
        numFocusPoints: 0,
        spellCastType: "spontaneous",
        tradition: "divine",
        "spellLevels": [
            {
                "spells": [
                    { "spellName": "field of life" },
                    { "spellName": "heal" },
                    { "spellName": "spirit blast" }
                ],
                "level": "6th",
                numUses: 4,
                spellLvl: 6
            },
            {
                "spells": [
                    { "spellName": "death ward" },
                    { "spellName": "dispel magic" },
                    { "spellName": "sending" }
            ],
                "level": "5th",
                numUses: 4,
                spellLvl: 5
            },
            {
                "spells": [
                    { "spellName": "freedom of movement" },
                    { "spellName": "read omens" },
                    { "spellName": "spell immunity" }
                ],
                "level": "4th",
                numUses: 4,
                spellLvl: 4
            },
            {
                "spells": [
                    { "spellName": "blindness" },
                    { "spellName": "crisis of faith" },
                    { "spellName": "dream message" }
                ],
                "level": "3rd",
                numUses: 4,
                spellLvl: 3
            },
            {
                "spells": [
                    { "spellName": "calm emotions" },
                    { "spellName": "see invisibility" },
                    { "spellName": "silence" }
                ],
                "level": "2nd",
                numUses: 4,
                spellLvl: 2
            },
            {
                "spells": [
                    { "spellName": "bane" },
                    { "spellName": "bless" },
                    { "spellName": "ray of enfeeblement" }
                ],
                "level": "1st",
                numUses: 4,
                spellLvl: 1
            },
            {
            "spells": [
                { "spellName": "chill touch" },
                { "spellName": "detect magic" },
                { "spellName": "disrupt undead" },
                { "spellName": "read aura" },
                { "spellName": "stabilize" }
            ],
            "level": "Cantrips (8th)",
            numUses: 5,
            spellLvl: 0
            }
        ]
    })
})
test('parseSpellEntry with constant spells', () => {
    expect(parsingHelper.parseSpellEntry("Divine Innate Spells DC 37; 4th talking corpse; Constant (4th) tongues, (2nd) speak with animals, spider climb"))
    .toEqual({
        name: "Divine Innate Spells",
        "DC": "37",
        "attackMod": undefined,
        isFocus: false,
        isRituals: false,
        isSpontaneous: false,
        numFocusPoints: 0,
        spellCastType: "innate",
        tradition: "divine",
        "spellLevels": [
            {
                "spells": [
                    { "spellName": "talking corpse" }
                ],
                "level": "4th",
                numUses: 1,
                spellLvl: 4
            },
            {
                "spells": [
                    { "spellName": "tongues" }
            ],
                "level": "Constant (4th)",
                numUses: 1,
                spellLvl: 4
            },
            {
                "spells": [
                    { "spellName": "speak with animals" },
                    { "spellName": "spider climb" }
                ],
                "level": "Constant (2nd)",
                numUses: 2,
                spellLvl: 2
            }
        ]
    })
})
test('parseSpellEntry with 1 focus spells', () => {
    expect(parsingHelper.parseSpellEntry("Champion Devotion Spells DC 20; 3rd (1 Focus Point) lay on hands (Core Rulebook 387)"))
    .toEqual({
        name: "Champion Devotion Spells",
        DC: "20",
        "attackMod": undefined,
        isFocus: true,
        isRituals: false,
        isSpontaneous: false,
        numFocusPoints: 1,
        spellCastType: "focus",
        tradition: undefined,
        spellLevels: [
            {
                spells: [{spellName: "lay on hands", detailText: "(Core Rulebook 387)"} ],
                level: "3rd",
                spellLvl: 3,
                numUses: 1
            }
        ]
    })
})
test('parseSpellEntry for ritual', () => {
    expect(parsingHelper.parseSpellEntry("Rituals DC 37; call spirit"))
    .toEqual({
        name: "Rituals",
        DC: "37",
        "attackMod": undefined,
        isFocus: false,
        isRituals: true,
        isSpontaneous: false,
        numFocusPoints: 0,
        spellCastType: "ritual",
        tradition: undefined,
        spellLevels: [
            {
                spells: [{spellName: "call spirit" } ],
                level: "1st",
                numUses: undefined,
                spellLvl: undefined
            }
        ]
    })
})
