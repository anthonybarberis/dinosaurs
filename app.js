window.onload = () => {
    //get height from slider
    document.querySelector('#height').addEventListener('input', event => {
        let inches = event.target.value % 12;
        let feet = (event.target.value - inches) / 12;
        document.querySelector('#height-num').textContent = `${feet}' ${inches}"`
    })
    //get weight from slider
    document.querySelector('#weight').addEventListener('input', event => {
        document.querySelector('#weight-num').textContent = `${event.target.value} lbs`
    })

    //get human data and generate tiles
    document.querySelector('#human-data').addEventListener('submit', event => {
        event.preventDefault();
        let formData = Object.fromEntries(new FormData(event.target));
        grid.createTiles(9, formData).forEach(element => {
            document.querySelector('#grid').appendChild(element);
        })
    })
}

//grid module
const grid = (() => {

    function createTiles(gridsize, human) {
        let dinos = dinoData.getDinos();
        let selectedDinos = [];
        let tiles = [];
        //randomly select non-pigeon dinos until the grid is filled
        while (selectedDinos.length < gridsize - 2) {
            let dino = dinos[Math.floor((Math.random() * dinos.length))];
            if (!selectedDinos.includes(dino) && dino != 'Pigeon') {
                selectedDinos.push(dino);
                //tiles.push(dinoData.getDino(dino));
            }
        }
        //tiles.splice(Math.floor((Math.random() * tiles.length)), 0, dinoData.getDino('pigeon')) //add pigeon randomly
        //tiles.splice(Math.floor(gridsize / 2), 0, human); //put the human at the middle index



        //this isnt a good setup. it's jumping the gun to filling the dom without consider the Creature methods


        selectedDinos.forEach(element => {
            let dino = new Creature(dinoData.getDino(element));
            tiles.push(dino.createTile());
        })

        return tiles;
    }

    return {
        createTiles: createTiles
    }

})();

//dino module
const dinoData = (() => {

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
        dinos.forEach(element => {
            dinoNames.push(element.species)
        })
        return dinoNames;
    }

    //return a specific dinosaur object by species name
    function getDino(species) {
        let dino = {};
        dinos.forEach(element => {
            if (element.species.toLowerCase() === species.toLowerCase()) dino = element;
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
        Object.keys(creature).forEach(element => this[element] = creature[element])
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
    randomFact(fact) {
        switch (fact) {
            case 1:
                return this.where;
            case 2:
                return this.when;
            case 3:
                return this.fact;
            default:
                return [this.where, this.when, this.fact][Math.floor((Math.random() * 3))]
        }
    }
    createTile() {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.classList.add('dino');
        tile.id = this.species;
        let facts = [];
        Object.keys(this).forEach(element => {
            switch (element) {
                case 'species':
                    let speciesName = document.createElement('p');
                    speciesName.textContent = this[element];
                    tile.appendChild(speciesName);
                    break
            }
        })
        let image = document.createElement('img')
        image.src = `images/${this.species}.png`
        tile.appendChild(image);
        return tile;
    }
}