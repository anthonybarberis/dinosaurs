window.onload = () => {
    //get height from slider
    document.querySelector('#height').addEventListener('input', event => {
        document.querySelector('#height-num').textContent = builder.heightFormat(event.target.value)
    })
    //get weight from slider
    document.querySelector('#weight').addEventListener('input', event => {
        document.querySelector('#weight-num').textContent = `${event.target.value} lbs`
    })

    let form = document.querySelector('#human-data');
    let grid = document.querySelector('#grid');
    let reset = document.querySelector('#again');

    //on submit, get human data from form and generate tiles
    form.addEventListener('submit', event => {
        event.preventDefault();
        let formData = Object.fromEntries(new FormData(event.target));
        formData.species = 'Human';
        builder.createTiles(9, formData).forEach(element => {
            grid.appendChild(element);
        })
        form.classList.add('removed');
        reset.classList.remove('removed');
    })

    reset.addEventListener('click', () => {
        grid.innerHTML = '';
        form.classList.remove('removed');
        reset.classList.add('removed');
    })
}

//tools for building the content
const builder = (() => {
    //create tiles from dinos and form, support for larger grid sizes and more dinos
    function createTiles(gridsize, formData) {
        let dinos = dinoData.getDinos();
        let selectedDinos = [];
        let tiles = [];

        //create human
        let human = new Creature(formData);

        //randomly select non-pigeon dinos until the grid is filled
        while (selectedDinos.length < gridsize - 2) {
            let dino = dinos[Math.floor((Math.random() * dinos.length))];
            if (!selectedDinos.includes(dino) && dino != 'Pigeon') {
                selectedDinos.push(dino);
                dino = new Creature(dinoData.getDino(dino));
                tiles.push(dino.createTile(human));
            }
        }

        //add pigeon randomly
        let pigeon = new Creature(dinoData.getDino('pigeon'));
        tiles.splice(Math.floor((Math.random() * tiles.length)), 0, pigeon.createTile(human));

        //put the human at the middle index
        tiles.splice(Math.floor(gridsize / 2), 0, human.createTile(human));

        return tiles;
    }
    //helper to format height into feet and inches
    function heightFormat(heightInInches) {
        let inches = heightInInches % 12;
        let feet = (heightInInches - inches) / 12;
        return `${feet}' ${inches}"`
    }
    return {
        createTiles: createTiles,
        heightFormat: heightFormat
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

    //creature comparrison method, takes an argument rather than being three different methods
    //pass the type of comparison and the Creature object to be compared
    compare(comparison, creature) {
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
                if (this.height > creature.height) compare = `${builder.heightFormat(difference)} taller than`;
                else if (this.height < creature.height) compare = `${builder.heightFormat(difference)} shorter than`;
                else if (this.height === creature.height) compare = 'the exact same height as';
                return `${this.name}(${builder.heightFormat(this.height)}) is ${compare} ${creature.name}(${builder.heightFormat(creature.height)})`;
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
    //method for Creature to generate its tile
    createTile(creatureToCompare) {
        let tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = this.species;

        //set species name
        let name = document.createElement('p');
        if (this.species == 'Human') name.textContent = this.name;
        else name.textContent = this.species;
        tile.appendChild(name);

        //set species image
        let image = document.createElement('img');
        image.src = `images/${this.species}.png`;
        tile.appendChild(image);

        //determine species fact -- random for dinos, fixed for human and pigeon
        let fact = document.createElement('p');
        let randFact = Math.floor(Math.random() * 6)
        if (randFact == 0) fact.textContent = this.fact;
        if (randFact == 1) fact.textContent = `${this.name} was alive during the ${this.when}`;
        if (randFact == 2) fact.textContent = `${this.name} lived in ${this.where}`;
        if (randFact == 3) fact.textContent = this.compare('weight', creatureToCompare);
        if (randFact == 4) fact.textContent = this.compare('height', creatureToCompare);
        if (randFact == 5) fact.textContent = this.compare('diet', creatureToCompare);;
        if (this.species == 'Human') fact.textContent = '';
        if (this.species == 'Pigeon') fact.textContent = this.fact;

        tile.appendChild(fact);

        return tile;
    }
}