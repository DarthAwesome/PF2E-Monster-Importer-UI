import * as parsingHelper from './parsing-helpers.js'

test("transformAbilityString with no traits", () =>{
    expect(parsingHelper.transformAbilityString("Smoke Vision\nThe cinder rat ignores the concealed condition from smoke."))
    .toEqual({
        name: "Smoke Vision",
        actionText: "The cinder rat ignores the concealed condition from smoke.",
        actionCost: "passive"
    })
})

test("transformAbilityString with some traits", () =>{
    expect(parsingHelper.transformAbilityString(`Fetid Fumes (aura, fire) 5 feet. A creature that enters the aura or begins its turn there
must succeed at a DC 22 Fortitude save or become sickened 1. Everything within
the aura, including the cinder rat, is concealed by smoke.`))
    .toEqual({
        name: "Fetid Fumes",
        actionText: `5 feet. A creature that enters the aura or begins its turn there must succeed at a DC 22 Fortitude save or become sickened 1. Everything within the aura, including the cinder rat, is concealed by smoke.`,
        actionCost: "passive",
        traits: ['aura', 'fire']
    })
})

test("transformAbilityString with some actions", () =>{
    expect(parsingHelper.transformAbilityString(`Powerful Charge [two-actions] The unicorn Strides up to
double its Speed in a straight line and then
makes a horn Strike. If the unicorn moved
at least 20 feet, it deals an additional
2d6 damage on a hit.`))
    .toEqual({
        name: "Powerful Charge",
        actionText: "The unicorn Strides up to double its Speed in a straight line and then makes a horn Strike. If the unicorn moved at least 20 feet, it deals an additional 2d6 damage on a hit.",
        actionCost: "2"
    })
})

test("transformAbilityString with complex formatting", () =>{
    expect(parsingHelper.transformAbilityString(`Devour Soul [one-action] (divine, incapacitation,
necromancy) Requirements The astradaemon
hasn’t used an action with the attack trait yet
this turn. Effect The astradaemon draws out
and consumes the soul of a living creature it
has grabbed. The creature must succeed at
a DC 35 Fortitude save or instantly die. If it
dies, the astradaemon gains 10 temporary
Hit Points and a +2 status bonus to attack
and damage rolls for 1 minute, or for 1
day if the victim was 15th level or higher.
A victim slain in this way can be returned
to life normally. A creature that survives is
temporarily immune for 1 minute.`))
    .toEqual({
        name: "Devour Soul",
        actionText: 
`<b>Requirements</b> The astradaemon hasn’t used an action with the attack trait yet this turn. <br>
<b>Effect</b> The astradaemon draws out and consumes the soul of a living creature it has grabbed. The creature must succeed at a DC 35 Fortitude save or instantly die. If it dies, the astradaemon gains 10 temporary Hit Points and a +2 status bonus to attack and damage rolls for 1 minute, or for 1 day if the victim was 15th level or higher.<br>
A victim slain in this way can be returned to life normally. A creature that survives is temporarily immune for 1 minute.`,
        actionCost: "1",
        traits: ['divine', 'incapacitation', 'necromancy']
    })
})