const dinos = (function () {
    
    //load dino.json
    let dinos;
    let dinoLoad = new XMLHttpRequest();
    dinoLoad.onload = () => {
        dinos = JSON.parse(dinoLoad.response).Dinos
    };
    dinoLoad.open("GET", "dino.json");
    dinoLoad.send();

    //return all dinosaur species names
    function getDinos() { 
        dinoNames = [];
        dinos.forEach((element) => {
            dinoNames.push(element.species)
        })
        return dinoNames;
    }

    //return a specific dinosaur object by species name
    function getDino(species) { 
        let dino = 'Not Found'
        dinos.forEach((element) => {
            if (element.species == species) dino = element;
        })
        return dino
    }
    return {
        getDinos: getDinos,
        getDino: getDino
    }
})();

class Creature {
    constructor(creature) {
        this.species = creature.species;
        this.weight = creature.weight;
        this.height = creature.height;
        this.diet = creature.diet;
        this.where = creature.where;
        this.when = creature.when;
        this.fact = creature.fact;
    }
    compareCreatures(comparison, creature) {
        switch (comparison) {
            case 'weight':
                break;
            case 'height':
                break;
            case 'diet':
                break
        }
    }
    randomFact(rand) {
        switch (rand) {
            case 1: return this.where;
            case 2: return this.when;
            case 3: return this.fact;
        }
    }
}