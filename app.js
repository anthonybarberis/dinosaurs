window.onload = () => {
    //get height from slider
    document.querySelector('#height').addEventListener('input', event => {
        document.querySelector('#height-num').textContent = heightFormat(event.target.value)
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
        dino.name = dino.species;
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
        let difference;
        let compare = ``
        switch (comparison) {
            case 'weight':
                difference = Math.abs(this.weight - creature.weight);
                if (this.weight > creature.weight) compare = `${difference}lbs heavier than`;
                else if (this.weight < creature.weight) compare = `${difference}lbs lighter than`;
                else if (this.weight === creature.weight) compare = 'the exact same weight as';
                return `${this.name}(${this.weight}lbs) is ${compare} ${creature.name}(${creature.weight}lbs)`;
            case 'height':
                difference = Math.abs(this.height - creature.height);
                if (this.height > creature.height) compare = `${heightFormat(difference)} taller than`;
                else if (this.height < creature.height) compare = `${heightFormat(difference)} shorter than`;
                else if (this.height === creature.height) compare = 'the exact same height as';
                return `${this.name}(${heightFormat(this.height)}) is ${compare} ${creature.name}(${heightFormat(creature.height)})`;
            case 'diet':
                this.diet = this.diet.toLowerCase();
                creature.diet = creature.diet.toLowerCase();
                let diets = {
                    herbivore: 0,
                    omnivore: 1,
                    carnivore: 2
                }
                if (diets[this.diet] === diets[creature.diet]) return `${this.name} and ${creature.name} have the same diet (${this.diet})`
                else if (diets[this.diet] > diets[creature.diet]) return `${this.name}(${this.diet}) might eat ${creature.name}(${creature.diet})`
                else if (diets[this.diet] < diets[creature.diet]) return `${this.name}(${this.diet}) might be eaten by ${creature.name}(${creature.diet})`
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

//helper to format height into feet and inches
function heightFormat(heightInInches) {
    let inches = heightInInches % 12;
    let feet = (heightInInches - inches) / 12;
    return `${feet}' ${inches}"`
}