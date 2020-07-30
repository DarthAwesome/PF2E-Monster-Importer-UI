import {ilssrahFromBook} from '../../teststrings/testStrings.js'
import { splitMonsterString } from '../utils/monster-string-searching.js'
import { createMonsterStringObject } from '../utils/monster-parser.js'
import { processMonster as createMonsterActor } from '../utils/import_into_fvtt.js'
import { BrowserStorage } from '../utils/browser-storage/browser-storage.js'

export class MonsterImportUI extends Application {
    constructor(options){
        super(options)
        //getTemplate()
        this.monsterJSON = undefined
    }
    
    monsterJSON
    createdMonster
    currentMatches
    lastMouseOver

    /**
     * Assign the default options
     */
    // @ts-ignore
    static get defaultOptions() {
        // @ts-ignore
        const options = super.defaultOptions
        options.id = "pf2e-monster-import-ui"
        options.template = "modules/pf2e_monsterimportui/templates/monster-import-ui.html"
        options.width = 1024
        options.height = 800
        options.resizable = true
        options.classes = ["pf2e-monster-import-ui"]
        options.popOut = true

        return options
    }

    /**
     * Prepare the default data which is required to render
     */
    async getData() {
        let data = {}
        data.numMonstersInStorage = BrowserStorage.numMonsters
        return data
    }

    /**
     * Add event listeners to UI elements
     */
    activateListeners(html){
        const textArea = $('.monster-import-ui-container .monster-textarea')
        const errorArea = $('.monster-import-ui-container .error-messages')
        const highlights = $('.monster-import-ui-container .input-text .highlights')
        const backdrop = $('.monster-import-ui-container .input-text .backdrop')
        const previewArea = $('.monster-import-ui-container .monster-preview')

        textArea.on('input', async event => {
            previewArea.empty()
            errorArea.empty()
            const currentMonsterString = $('.monster-import-ui-container .monster-textarea').val().toString()
            if(currentMonsterString!==""){
                try{
                    this.currentMatches = {}
                    let monsterObj = createMonsterStringObject(currentMonsterString, this.currentMatches)
                    this.monsterJSON = monsterObj
                    // console.log("Actual monster object",monsterObj)
                    const previewHTML = await renderTemplate('modules/pf2e_monsterimportui/templates/monster-preview.hbs' , {monster: monsterObj})
                    previewArea.append(previewHTML)
                }catch(error) {
                    errorArea.append(error.toString())
                }
            }
        })

        //Handle highlighting
        textArea.on({'input': highlightInput, 'scroll': handleScroll})
        function highlightInput(highlightText) {
            let text = textArea.val()
            let highlightedText =  applyHighlights(text, highlightText)
            highlights.html(highlightedText)
        }
        function applyHighlights(text, highlightText){
            let out =text.replace(/\n$/g, '\n\n')
            if(highlightText){
                out = out.replace(highlightText, '<mark>$&</mark>')
            }
            return out
        }
        function handleScroll() {
            let scrollTop = textArea.scrollTop();
            backdrop.scrollTop(scrollTop);
        }

        previewArea.on('mouseover','.highlightable', (event) => {
            const matchesAttribute = event.currentTarget?.getAttribute('data-mouseover')
            // console.log("moused over",matchesAttribute)
            if(matchesAttribute && this.currentMatches?.[matchesAttribute]){
                this.lastMouseOver = this.currentMatches[matchesAttribute]
                // console.log("Set lastMouseOver to",this.lastMouseOver)
                highlightInput(this.lastMouseOver)
            }
            else{
                this.lastMouseOver = undefined
            }
        })

        // Import buttons
        const importButton = $(html).find('.import-monster')
        importButton.on('click', async event => {
            if(!this.monsterJSON) return
            this.createdMonster = await createMonsterActor(this.monsterJSON,undefined,undefined,undefined,true)

            $('.monster-import-ui-container .delete-last-monster .monstername').text(this.createdMonster.name)
        })

        const deleteButton = $(html).find('.delete-last-monster')
        deleteButton.on('click', async event => {
            if(this.createdMonster){
                await this.createdMonster.delete()
                $('.monster-import-ui-container .delete-last-monster .monstername').text("")
                this.createdMonster = undefined
            }
        })

        // Local storage buttons
        const saveLocalButton = $(html).find('.save-locally')
        const exportJSONButton = $(html).find('.export-json')
        const clearLocalButton = $(html).find('.clear-storage')

        saveLocalButton.on('click', event => {
            if(!this.monsterJSON) return
            BrowserStorage.addMonsterToStorage(this.monsterJSON)
            $(html).find('.num-monsters-saved').text(BrowserStorage.numMonsters)
        })
        exportJSONButton.on('click', event => {
            BrowserStorage.downloadMonsterStorageJSON()
        })
        clearLocalButton.on('click', event => {
            BrowserStorage.clearMonsterStorage()
            $(html).find('.num-monsters-saved').text(BrowserStorage.numMonsters)
        })
    }
}
