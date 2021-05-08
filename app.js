window.onload = () => {
    //get height from slider
    document.querySelector('#height').addEventListener('input', (event) => {
        let inches = event.target.value % 12;
        let feet = (event.target.value - inches) / 12;
        document.querySelector('#height-num').textContent = `${feet}' ${inches}"`
    })
    //get weight from slider
    document.querySelector('#weight').addEventListener('input', (event) => {
        document.querySelector('#weight-num').textContent = `${event.target.value} lbs`
    })

    //get human data from form
    document.querySelector('#human-data').addEventListener('submit', (event) => {
        event.preventDefault();
        let formData = Object.fromEntries(new FormData(event.target))
        console.log(formData);
    })
}

const grid = (function () {

})();

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
        let dino = {};
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
        Object.keys(creature).forEach((element) => {
            this[element] = creature[element];
        })
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