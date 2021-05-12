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
        formData.species = 'Human';
        grid.createTiles(9, formData).forEach(element => {
            document.querySelector('#grid').appendChild(element);
        })
    })
}

//grid module
const grid = (() => {

    function createTiles(gridsize, formData) {
        let dinos = dinoData.getDinos();
        let selectedDinos = [];
        let tiles = [];

        //randomly select non-pigeon dinos until the grid is filled
        while (selectedDinos.length < gridsize - 2) {
            let dino = dinos[Math.floor((Math.random() * dinos.length))];
            if (!selectedDinos.includes(dino) && dino != 'Pigeon') {
                selectedDinos.push(dino);
                dino = new Creature(dinoData.getDino(dino));
                tiles.push(dino.createTile());
            }
        }

        //add pigeon randomly
        let pigeon = new Creature(dinoData.getDino('pigeon'));
        tiles.splice(Math.floor((Math.random() * tiles.length)), 0, pigeon.createTile());

        //put the human at the middle index
        let human = new Creature(formData);
        tiles.splice(Math.floor(gridsize / 2), 0, human.createTile());

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
        tile.id = this.species;

        let name = document.createElement('p');
        if (this.species == 'Human') name.textContent = this.name;
        else name.textContent = this.species;
        tile.appendChild(name);

        let image = document.createElement('img');
        image.src = `images/${this.species}.png`;
        tile.appendChild(image);

        let fact = document.createElement('p');
        fact.textContent = this.fact;
        tile.appendChild(fact);

        return tile;
    }
}