class WorldCities extends AbstractApp {
    constructor(containerDiv) {
        super(containerDiv);

    }

    /**
     * NV
     * Ces éléments ne sont pas des méthodes mais de propriétés de classe.
     * A mettre donc dans le constructeur.
     * Revois le diagramme pour corriger.
     */
    baseTowns(){}
    towns(){}
    indexer(){}
    searchlpt(){}

    set index(value){}

    initTowns(dataSource){
        for (const town of dataSource.towns){
            
            const city = new City(town);
            this.baseTowns.push(city);
        }
    }

    loadTowns(index){
        const town = this.baseTowns[index];

        const leftContainer = this.containerDiv.querySelector("#left_container");
        const leftContainerDiv2 = leftContainerDiv.querySelector("h2");
        const desc = this.containerDiv.querySelector("#desc");

        const rightContainer = this.containerDiv.querySelector("#right_container");
        const townNameDiv = this.containerDiv.querySelector("#town_name");


        leftContainerDiv2.textContent = town.name;
        desc.innerHTML = town.description;
    }

    loadGallery(images){
        const gallery = this.containerDiv.querySelector("#gallery");
        const galleryDivS = gallery.querySelector("div");
        for (const div of galleryDivs) {
            div.remove();
        }

        for (const image of images) {
            const div = document.createElement("div");
            const img = document.createElement("img");
            img.src = "images/" + image.url;
            img.className = "gallery_img";
            div.appendChild(img);

            const h6 = document.createElement("h6");
            h6.textContent = image.caption;
        }
    }

    searchInputHandler(){}

    clearSearchInputHandler(){}

    refresh(){}

    filterElement(arr, filter){}

    initInputChangeHandler(){}

    initIndexer(){
        const optionDiv = this.containerDiv.querySelector("#option");
        this.indexer = new Indexer(optionDiv, this.baseTowns.length, IndexerMode.LOOP);
    }

    init(dataSource) {
        // Codez cette méthode pour traiter le fichier chargé et initialiser la classe.
        this.initTowns(dataSource);

        this.loadTown(0);
        super.init(dataSource);
    }
}
 
const SearchInputEventNames = {
    SEARCH_INPUT: "search_input",
    CLEAR_SEARCH_INPUT: "clear_search_input"
}

class SearchInputEvent extends CustomEvent {
    constructor(type, options) {
        super(type, options);
    }
}

class SearchInput extends AbstractUIComponent {
    constructor(UIView) {
        super(UIView);

        // Codez ici les propriétés définies dans le diagramme de classes.
        this.init();
    }
    boundSearchInputHandler(){}

    boundClearSearchHandler(){}

    get value() {
        return super.value;
    }

    set value(value){

    }

    searchInputHandler() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
    }

    clearSearchHandler() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
    }

    checkClearButton() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
    }

    init() {
        // Appelez ici les méthodes d'initialisation du composant décrites dans le diagrammes de classe.
        super.init();
    }
}

const indexerMode = {
    NONE: 1,
    LOOP: 2
}

const indexerDirection = {
    NEXT: "next",
    PREVIOUS: "previous"
}

const IndexerEventNames = {
    INDEX_CHANGED: "index_changed"
}

class IndexerEvent extends CustomEvent {
    constructor(type, options) {
        super(type, options);
    }
}

class Indexer extends AbstractUIComponent {
    constructor(UIView, total, mode = indexerMode.NONE) {
        super(UIView);

        // Codez ici les propriétés définies dans le diagramme de classes.
        this.total;
        this.indexMode = node;
        this.init();
    }

    total(){}

    indexMode(){}

    nextBtn(){}

    previous(){}
    
    set mode(value) {
        this.indexerMode = value;
    }

    set totalItems(value) {
        this.total = value;
        this.setNumbers();
    }

    get value() {
        return super.value;
    }

    set value(value) {
        this.index = value;
        this.checkIndex();
        super.value = value;
    }

    init() {
        // Appelez ici les méthodes d'initialisation du composant décrites dans le diagrammes de classe.
        super.init();
    }

    // Adaptation en méthode de la fonction du TP Citations. Déjà codée pour vous. :)
    changeIndex(direction) {
        direction == indexerDirection.NEXT ? this.index++ : this.index--;
        this.checkIndex();
    }

    checkIndex() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
        if (this.index == 0) {
            disableButton(previous);
            disableButton(next, !(this.WorldCities.length > 1));
        }
    }

    setNumbers() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
    }

    // Adaptation en méthode de la fonction du TP Citations. Déjà codée pour vous. :)
    getZeroFormat(num, limit) {
        const sNum = num.toString();
        const sLimit = limit.toString();
        const numZero = sLimit.length - sNum.length;
        let start = 0;
        let zero = "";
        while (start < numZero) {
            zero += "0";
            start++;
        }
        const format = zero + sNum;
        return format
    }

    initButtons() {
        // Codez cette méthode. Adaptation en classe du TP Citation.
    }

}

class IndexerButton extends AbstractButton {
    constructor(buttonDiv) {
        super(buttonDiv);
    }

    disable(bool = true) {
        // Codez cette méthode pour changer la couleur des boutons via la classe CSS. Adaptation en classe du TP Citation.
        buttonDiv.className = bool ? "disabled" : "buttonNextPrevious";
        super.disable(bool);
    }
}

const IndexerDirection = {
    NEXT: 1,
    PREVIOUS: 2
}

// Classe à utiliser pour stocker chaque ville des données chargées du fichier externe datas.json.
class City {
    constructor(dataSource) {
        this.country = dataSource.country;
        this.description = dataSource.description;
        this.images = dataSource.images;
        this.inhabitants = dataSource.inhabitants;
        this.major = dataSource.major;
        this.name = dataSource.name;
        this.region = dataSource.region;
        this.state = dataSource.state;
        this.link = dataSource.link;
    }
}

// Fonction de chargement du fichier externe datas.json. A NE PAS TOUCHER.
async function loadDatas() {
    const response = await fetch("data/datas.json")
        .then(response => response.json())
        .then(json => worldCities.init(json)
        );
}

function appInitHandler(evt) {
    console.log("worldCities.dataSource", worldCities.dataSource);
    checkIndex();
}

/**
 * Fonction de vérification de l'URL pour voir si un index est passé en param afin d'afficher directement une ville.
 * A coder par vos soins sur le modèle du mode debug déjà vu ensemble plusieurs fois.
 * Vérifier si le param index est bien un entier et si oui il doit être supérieur à 0.
 * Si l'index n'est pas un entier, mettre une alerte avec "Paramètre incorrect !\nVeuillez vérifier l'index saisi."
 * Si l'index est un entier mais plus petit que 0, mettre une alerte avec "Paramètre incorrect !\nL'index saisi ne peut être plus petit que 0."
 */
function checkIndex() {
    // Codez cette fonction.
}

// App déjà instanciée pour vous. Ne rien toucher.
const worldCities = new WorldCities(document);
worldCities.addEventListener(AbstractAppEventNames.INIT, appInitHandler);

// Tout est instancié, on charge les données. NE RIEN TOUCHER.
loadDatas();