import { MonsterImportUI } from './app/monster_import_ui.js'

let monsterImportUIApp

Hooks.once('ready', () => {
    monsterImportUIApp = new MonsterImportUI()

    // @ts-ignore
    AnvilMenu.registerMenuEntry({
        name: "PF2E Monster Import UI",
        icon: '<i class="fas fa-spider"></i>',
        condition: () => game.user.isGM,
        callback: () => monsterImportUIApp.render(true)
    })

    
    loadTemplates(["modules/pf2e_monsterimportui/templates/monster-import-ui.html", "modules/pf2e_monsterimportui/templates/monster-preview.hbs"])
})

Handlebars.registerHelper('getActionImage', function (actionCost) {
    let html = ""
    switch(actionCost){
        case "1":
        case 1:
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/OneAction.png)"></span>`
        break;
        case "2":
        case 2:
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/TwoActions.png)"></span>`
        break;
        case "3":
        case 3:
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/ThreeActions.png)"></span>`
        break;
        case "reaction":
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/Reaction.png)"></span>`
        break;
        case "freeAction":
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/FreeAction.png)"></span>`
        break;
        default:
            html = `<span class="item-image" style="background-image: url(systems/pf2e/icons/actions/Passive.png)"></span>`
    }
    return new Handlebars.SafeString(html)
});