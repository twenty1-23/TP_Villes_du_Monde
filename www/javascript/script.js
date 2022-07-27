class WorldCities extends AbstractApp {
    constructor(containerDiv) {
        super(containerDiv);

        this.towns = [];
        this.currentIndex = 0;
    }

    set index(value) {
        this.currentIndex = value;
        console.log("this.currentIndex", this.currentIndex);
    }

    init(dataSource) {
        this.initTowns(dataSource);
        this.initInput();

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

    initInput(){
        const searchIpt = new SearchInput(this.containerDiv.querySelector("#search"));
    }
}

class SearchInput extends AbstractUIComponent {
    constructor(UIView){
        super(UIView);
        
        this.boundSearchInputHandler = this.searchInputHandler.bind(this);
        this.boundClearSearchHandler = this.clearSearchHandler.bind(this);

        this.searchIpt;
        this.clearSearchIptBtn;
        this.init();
    }

    searchInputHandler(param){
        console.log(this.searchIpt.value);
        this.checkClearButton();
    }

    clearSearchHandler(param){
        console.log(this);
        
        this.searchIpt.value = "";
        this.checkClearButton();
    }

    checkClearButton(){
        if(this.searchIpt.value != ""){
            this.clearSearchIptBtn.disabled = false;
            this.clearSearchIptBtn.addEventListener(EventNames.CLICK, this.boundClearSearchHandler);
        }else{
            this.clearSearchIptBtn.disabled = true;
            this.clearSearchIptBtn.removeEventListener(EventNames.CLICK, this.boundClearSearchHandler);
        }
    }

    init(){
        this.searchIpt = this.UIView.querySelector("#search_ipt");
        console.log(this.searchIpt);
        
        this.searchIpt.addEventListener(EventNames.INPUT, this.boundSearchInputHandler);
        this.clearSearchIptBtn = this.UIView.querySelector("#clear_search_ipt_btn");
        this.checkClearButton();
    }
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
    if(index){
        worldCities.index = index;
    }
}

const worldCities = new WorldCities(document);
worldCities.addEventListener(AbstractAppEventNames.INIT, appInitHandler);

checkIndex();
loadDatas();