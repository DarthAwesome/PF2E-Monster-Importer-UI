import { createMonsterStringObject } from './monster-parser.js'
import * as monsters from '../../teststrings/teststrings.js'

test('monsterJSON for cinderrat', () => {
    const cinderRat = createMonsterStringObject(monsters.cinderRat)
    expect(cinderRat).toEqual({
        "name": "Cinder Rat",
        "level": "3",
        "alignment": "Neutral",
        "size": "Small",
        "rarity": "common",
        "traits": [
            {
            "traitName": "ELEMENTAL",
            },
            {
            "traitName": "FIRE",
            }
        ],
        "perceptionMod": "+9",
        "perceptionText": "darkvision, smoke vision",
        "skills": [
            {
            "name": "Acrobatics",
            "mod": "+10"
            },
            {
            "name": "Stealth",
            "mod": "+10"
            },
            {
            "name": "Survival",
            "mod": "+9"
            }
        ],
        "attributes": {
            "str": "+2",
            "dex": "+3",
            "con": "+2",
            "int": "-4",
            "wis": "+2",
            "cha": "+0"
        },
        "interactionAbilities": [
            {
            "name": "Smoke Vision",
            "actionCost": "passive",
            "actionText": "The cinder rat ignores the concealed condition from smoke."
            }
        ],
        "AC": "18",
        "saves": [
            {
            "name": "Fort",
            "mod": "+9"
            },
            {
            "name": "Ref",
            "mod": "+12"
            },
            {
            "name": "Will",
            "mod": "+6"
            }
        ],
        "weaknesses": "cold 5",
        "immunities": "bleed, fire, paralyzed, poison, sleep",
        "HP": "45",
        "defensiveAbilities": [
            {
            "name": "Fetid Fumes",
            "actionCost": "passive",
            "actionText": "5 feet. A creature that enters the aura or begins its turn there must succeed at a DC 22 Fortitude save or become sickened 1. Everything within the aura, including the cinder rat, is concealed by smoke.",
            "traits": [
                "aura",
                "fire"
            ]
            }
        ],
        "speed": "40 feet",
        "attackActions": [
            {
            "name": "jaws",
            "actionCost": "1",
            "modifier": "+10",
            "traits": [
                "finesse"
            ],
            "isRanged": false, 
            "damageRolls": [
                "1d8+4 fire",
                "1d4 persistent fire"
            ]
            }
        ]
    })
})

test('monsterJSON for dryadQueenFromBook', () => {
    const monster = createMonsterStringObject(monsters.dryadQueenFromBook)
    expect(monster).toEqual({
        "name": "Dryad Queen",
        "level": "13",
        "alignment": "Chaotic Good",
        "size": "Medium",
        "rarity": "uncommon",
        "traits": [
            {
            "traitName": "FEY",
            },
            {
            "traitName": "NYMPH",
            },
            {
            "traitName": "PLANT",
            }
        ],
        "perceptionMod": "+25",
        "perceptionText": "low-light vision",
        "languagesList": "Common, Elven, Sylvan; speak with plants",
        "skills": [
            {
            "name": "Acrobatics",
            "mod": "+25"
            },
            {
            "name": "Athletics",
            "mod": "+19"
            },
            {
            "name": "Crafting",
            "mod": "+23",
            "skillDetails": "+25 woodworking"
            },
            {
            "name": "Deception",
            "mod": "+30"
            },
            {
            "name": "Diplomacy",
            "mod": "+30"
            },
            {
            "name": "Intimidation",
            "mod": "+27"
            },
            {
            "name": "Nature",
            "mod": "+24"
            },
            {
            "name": "Performance",
            "mod": "+28"
            },
            {
            "name": "Stealth",
            "mod": "+25"
            },
            {
            "name": "Survival",
            "mod": "+24"
            }
        ],
        "attributes": {
            "str": "+2",
            "dex": "+6",
            "con": "+6",
            "int": "+4",
            "wis": "+4",
            "cha": "+8"
        },
        "interactionAbilities": [
            {
            "name": "Nature Empathy",
            "actionCost": "passive",
            "actionText": "As dryad."
            },
            {
            "name": "Tied to the Land",
            "actionCost": "passive",
            "actionText": ""
            }
        ],
        "AC": "35",
        "saves": [
            {
            "name": "Fort",
            "mod": "+24"
            },
            {
            "name": "Ref",
            "mod": "+26"
            },
            {
            "name": "Will",
            "mod": "+24"
            }
        ],
        "weaknesses": "cold iron 10, fire 10",
        "HP": "220",
        "defensiveAbilities": [
            {
            "name": "Nymph’s Beauty",
            "actionCost": "passive",
            "traits": ["aura", "emotion", "enchantment", "incapacitation", "mental", "primal", "visual"],
            "actionText": "DC 30. On a failed save, the target is immobilized in awe for 1 minute."
            }
        ],
        "speed": "30 feet",
        "attackActions": [
            {
            "name": "branch",
            "actionCost": "1",
            "modifier": "+27",
            "traits": [
                "finesse",
                "magical"
            ],
            "isRanged": false, 
            "damageRolls": [
                "3d12+8 bludgeoning"
            ]
            },
            {
            "name": "leaves",
            "actionCost": "1",
            "modifier": "+27",
            "traits": [
                "conjuration",
                "plant",
                "primal",
                "range increment 60 feet"
            ],
            "isRanged": true, 
            "damageRolls": [
                "3d8+6 slashing"
            ]
            }
        ],
        "spellAbilities": [
            {
            "name": "Primal Prepared Spells",
            "isFocus": false,
            "isRituals": false,
            "isSpontaneous": false,
            "numFocusPoints": 0,
            "tradition": "primal",
            "spellCastType": "prepared",
            "DC": "35",
            "attackMod": "+25",
            "spellLevels": [
                {
                "spells": [
                    {
                    "spellName": "regenerate",
                    },
                    {
                    "spellName": "summon plant or fungus",
                    }
                ],
                "level": "7th",
                spellLvl: 7,
                numUses: 2
                },
                {
                "spells": [
                    {
                    "spellName": "baleful polymorph",
                    },
                    {
                    "spellName": "chain lightning",
                    },
                    {
                    "spellName": "tangling creepers",
                    }
                ],
                "level": "6th",
                spellLvl: 6,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "cone of cold",
                    },
                    {
                    "spellName": "death ward",
                    },
                    {
                    "spellName": "heal",
                    }
                ],
                "level": "5th",
                spellLvl: 5,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "fly",
                    },
                    {
                    "spellName": "resist energy",
                    },
                    {
                    "spellName": "stoneskin",
                    }
                ],
                "level": "4th",
                spellLvl: 4,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "earthbind",
                    },
                    {
                    "spellName": "haste",
                    },
                    {
                    "spellName": "wall of thorns",
                    }
                ],
                "level": "3rd",
                spellLvl: 3,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "animal messenger",
                    },
                    {
                    "spellName": "faerie fire",
                    },
                    {
                    "spellName": "remove fear",
                    }
                ],
                "level": "2nd",
                spellLvl: 2,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "fleet step",
                    },
                    {
                    "spellName": "gust of wind",
                    },
                    {
                    "spellName": "negate aroma",
                    }
                ],
                "level": "1st",
                spellLvl: 1,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "detect magic",
                    },
                    {
                    "spellName": "guidance",
                    },
                    {
                    "spellName": "light",
                    },
                    {
                    "spellName": "ray of frost",
                    },
                    {
                    "spellName": "stabilize",
                    }
                ],
                "level": "Cantrips (7th)",
                spellLvl: 0,
                numUses: 5
                }
            ]
            },
            {
            "name": "Primal Innate Spells",
            "isFocus": false,
            "isRituals": false,
            "isSpontaneous": false,
            "numFocusPoints": 0,
            "tradition": "primal",
            "spellCastType": "innate",
            "DC": "35",
            "attackMod": "+25",
            "spellLevels": [
                {
                "spells": [
                    {
                    "spellName": "impaling briars",
                    "detailText": "(Core Rulebook 400)"
                    }
                ],
                "level": "8th",
                spellLvl: 8,
                numUses: 1
                },
                {
                "spells": [
                    {
                    "spellName": "tree stride",
                    "detailText": "(×3)"
                    }
                ],
                "level": "5th",
                spellLvl: 5,
                numUses: 3
                },
                {
                "spells": [
                    {
                    "spellName": "charm",
                    "detailText": "(at will)"
                    },
                    {
                    "spellName": "suggestion",
                    "detailText": "(at will)"
                    }
                ],
                "level": "4th",
                spellLvl: 4,
                numUses: 2
                },
                {
                "spells": [
                    {
                    "spellName": "entangle",
                    "detailText": "(at will)"
                    },
                    {
                    "spellName": "sleep",
                    "detailText": "(at will)"
                    }
                ],
                "level": "3rd",
                spellLvl: 3,
                numUses: 2
                },
                {
                "spells": [
                    {
                    "spellName": "shape wood",
                    "detailText": "(at will)"
                    },
                    {
                    "spellName": "tree shape",
                    "detailText": "(at will)"
                    }
                ],
                "level": "2nd",
                spellLvl: 2,
                numUses: 2
                },
                {
                "spells": [
                    {
                    "spellName": "tanglefoot",
                    }
                ],
                "level": "Cantrips (5th)",
                spellLvl: 0,
                numUses: 1
                },
                {
                "spells": [
                    {
                    "spellName": "speak with plants",
                    }
                ],
                "level": "Constant (4th)",
                spellLvl: 4,
                numUses: 1
                }
            ]
            }
        ],
        "offensiveAbilities": [
            {
            "name": "Change Shape",
            "actionCost": "1",
            "actionText": "",
            traits: ["polymorph", "primal", "transmutation"]
            },
            {
            "name": "Focus Beauty",
            "actionCost": "1",
            "actionText": "On a failed save, if the target was already affected by the dryad queen’s beauty, the target suffers the effects of a failed save against charm.",
            traits: ["emotion", "enchantment", "incapacitation", "mental", "primal", "visual"]
            },
            {
            "name": "Inspiration",
            "actionCost": "3",
            "actionText": "",
            traits: ["emotion", "enchantment", "mental", "primal"]
            },
            {
            "name": "Tree Meld",
            "actionCost": "2",
            "actionText": "As dryad, except the hamadryad can enter and exit her extradimensional domain from any tree in her domain and she can bring up to eight other creatures with her when she does so.",
            traits: ["primal", "transmutation"]
            }
        ]
    })
})

test('monsterJSON for zinogyvaz', () => {
    const monster = createMonsterStringObject(monsters.zinogyvaz)
})