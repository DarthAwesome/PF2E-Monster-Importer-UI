export class BrowserStorage {

    static getMonsterStorageContent(){
        return (JSON.parse(localStorage.getItem("pf2e_monsterimportui")) ?? []).filter(m => m?.name)
    }

    static getMonsterStorageList(){
        const currentStorage = BrowserStorage.getMonsterStorageContent()
        return currentStorage.map(m => m.name)
    }

    static get numMonsters(){
        return BrowserStorage.getMonsterStorageList()?.length ?? 0
    }

    static clearMonsterStorage(){
        localStorage.setItem("pf2e_monsterimportui",JSON.stringify([]))
    }

    static addMonsterToStorage(newMonster){
        let currentStorage = BrowserStorage.getMonsterStorageContent()
        currentStorage.push(newMonster)
        localStorage.setItem("pf2e_monsterimportui",JSON.stringify(currentStorage,null,2))
    }

    static downloadMonsterStorageJSON(){
        const a = document.createElement("a")
        const file = new Blob([localStorage.getItem("pf2e_monsterimportui")], {type: "application/json"})
        a.href = URL.createObjectURL(file)
        a.download = "monsterimportui.json"
        a.click()
        URL.revokeObjectURL(a.href)
    }
}