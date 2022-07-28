class WorldCities extends AbstractApp {
    constructor(containerDiv) {
        super(containerDiv);

        this.towns = [];
        this.indexer;
    }

    set index(value) {
        // this.indexer.value = value; // TODO
    }

    init(dataSource) {
        this.initTowns(dataSource);
        this.initInput();
        this.initIndexer();
        this.loadTown(this.indexer.value);

        super.init(dataSource);
    }

    initTowns(dataSource) {
        console.log(dataSource);

        for (const town of dataSource.towns) {
            const city = new City(town);
            this.towns.push(city);
        }
        console.log("this.towns", this.towns);

    }

    loadTown(index){
        console.log("loadTown", index);
        
    }

    searchInputHandler(evt) {
        console.log("evt", evt.detail);
    }

    initInput() {
        const searchIpt = new SearchInput(this.containerDiv.querySelector("#search"));
        searchIpt.addEventListener(SearchInputEventNames.SEARCH_INPUT, this.searchInputHandler);
        searchIpt.addEventListener(SearchInputEventNames.CLEAR_SEARCH_INPUT, this.searchInputHandler);
    }

    indexerIndexChangeHandler(evt){
        console.log("indexerIndexChangeHandler", evt, evt.detail);
        
    }

    initIndexer() {
        const optionsDiv = this.containerDiv.querySelector("#options");
        this.indexer = new Indexer(optionsDiv, this.towns.length, indexerMode.LOOP);
        this.indexer.addEventListener(IndexerEventNames.INDEX_CHANGED, this.indexerIndexChangeHandler);
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

        this.boundSearchInputHandler = this.searchInputHandler.bind(this);
        this.boundClearSearchHandler = this.clearSearchHandler.bind(this);

        this.searchIpt;
        this.clearSearchIptBtn;
        this.init();
    }

    set value(value) {
        this.searchIpt.value = value;
        super.value = value;
    }

    searchInputHandler(param) {
        this.valueComponent = this.searchIpt.value;
        console.log("shshshs", super.value); // TODO check le super


        this.checkClearButton();
        const evt = new SearchInputEvent(SearchInputEventNames.SEARCH_INPUT, {
            detail: {
                value: super.value
            }
        });
        this.dispatchEvent(evt);
    }

    clearSearchHandler(param) {
        console.log(this);

        this.value = "";
        this.checkClearButton();
        const evt = new SearchInputEvent(SearchInputEventNames.CLEAR_SEARCH_INPUT, {
            detail: {
                value: this.value
            }
        });
        this.dispatchEvent(evt);
    }

    checkClearButton() {
        if (this.searchIpt.value != "") {
            this.clearSearchIptBtn.disabled = false;
            this.clearSearchIptBtn.addEventListener(EventNames.CLICK, this.boundClearSearchHandler);
        } else {
            this.clearSearchIptBtn.disabled = true;
            this.clearSearchIptBtn.removeEventListener(EventNames.CLICK, this.boundClearSearchHandler);
        }
    }

    init() {
        this.searchIpt = this.UIView.querySelector("#search_ipt");

        this.searchIpt.addEventListener(EventNames.INPUT, this.boundSearchInputHandler);
        this.clearSearchIptBtn = this.UIView.querySelector("#clear_search_ipt_btn");
        this.checkClearButton();

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

        this.total = total;
        this.indexerMode = mode;
        this.indexDiv;
        this.index = 0;
        this.nextBtn;
        this.previousBtn;
        this.init();
    }

    set mode(value){ // TODO
        this.indexerMode = value;

    }

    get value(){
        return super.value;
    }

    set value(value) {
        this.index = value;
        this.checkIndex();
        this.indexDiv.textContent = value;
        super.value = value;
    }

    init() {
        this.indexDiv = this.UIView.querySelector("#index");
        this.initButtons();
        this.checkIndex();
        super.init();
    }

    changeIndex(direction) {
        console.log("changeIndex", direction);
        direction == indexerDirection.NEXT ? this.index++ : this.index--;
        this.checkIndex();
    }

    checkIndex() {
        if (this.indexerMode == indexerMode.LOOP) {
            const min = 0;
            const max = this.total - 1;

            if (this.index < min) {
                this.index = max;
            }

            if (this.index > max) {
                this.index = min;
            }
            
            if (this.next.isDisabled) {
                this.next.disable(false);
            }

            if (this.previous.isDisabled) {
                this.previous.disable(false);
            }
            super.value = this.index;
        } else {

        }
        const evt = new IndexerEvent(IndexerEventNames.INDEX_CHANGED, {
            detail: {
                value: super.value
            }
        });
        console.log("checkIndex", this.indexerMode, super.value);
        this.dispatchEvent(evt);
    }

    initButtons() {
        const nextDiv = this.UIView.querySelector("#next");
        const previousDiv = this.UIView.querySelector("#previous");
        const divs = [previousDiv, nextDiv];
        for (const div of divs) {
            const indexerBtn = new IndexerButton(div);
            indexerBtn.addEventListener(EventNames.CLICK, function () {
                this.changeIndex(indexerBtn.buttonDiv == nextDiv ? indexerDirection.NEXT : indexerDirection.PREVIOUS);
            }.bind(this));
            // indexerBtn.disable(false);
            if(indexerBtn.buttonDiv == nextDiv){
                this.next = indexerBtn;
            }else{
                this.previous = indexerBtn;
            }
        }
    }

}

class IndexerButton extends AbstractButton {
    constructor(buttonDiv) {
        super(buttonDiv);
    }

    disable(bool = true) {
        super.disable(bool);

    }

    // buttonClickHandler(evt) {
    //     super.buttonClickHandler(evt);
    //     this.dispatchEvent(evt);
    // }
}

const IndexerDirection = {
    NEXT: 1,
    PREVIOUS: 2
}

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
    }
}

async function loadDatas() {
    const response = await fetch("data/datas.json")
        .then(response => response.json())
        .then(json => worldCities.init(json)
        );
}

function appInitHandler(evt) {
    console.log("worldCities.dataSource", worldCities.dataSource);

}

function checkIndex() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const index = urlParams.get('index');
    if (index) {
        worldCities.index = index;
    }
}

const worldCities = new WorldCities(document);
worldCities.addEventListener(AbstractAppEventNames.INIT, appInitHandler);

checkIndex();
loadDatas();