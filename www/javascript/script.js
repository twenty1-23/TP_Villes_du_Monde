class WorldCities extends AbstractApp {
    constructor(containerDiv) {
        super(containerDiv);

        this.towns = [];
        this.baseTowns = [];
        this.indexer;
        // this.select;
        this.searchIpt;
    }

    set index(value) {
        this.indexer.value = value;
    }

    init(dataSource) {
        this.initTowns(dataSource);
        this.initIndexer();
        // this.initSelect();
        this.initInput();
        this.loadTown(this.indexer.value);

        super.init(dataSource);
    }

    initTowns(dataSource) {
        console.log(dataSource);

        for (const town of dataSource.towns) {
            const city = new City(town);
            this.baseTowns.push(city);
        }
        this.towns = [...this.baseTowns];
        console.log("this.towns", this.towns);

    }

    initSelect() {
        // const townSelect = this.containerDiv.querySelector("#town-select");
        // const options = townSelect.querySelectorAll("option");

        // for (const option of options) {
        //     option.remove();
        // }
        // for (const town of this.towns) {
        //     const option = document.createElement("option");
        //     option.textContent = town.name;
        //     townSelect.appendChild(option);
        // }

        // this.select = new Select(this.containerDiv.querySelector("#town-select"));
    }

    loadTown(index) {
        const leftContainerDiv = this.containerDiv.querySelector("#left_container");
        const leftContainerDivH2 = leftContainerDiv.querySelector("h2");
        const leftContainerDivP = leftContainerDiv.querySelector("p");
        const desc = this.containerDiv.querySelector("#desc");
        const rightContainerDiv = this.containerDiv.querySelector("#right_container");
        const townNameDiv = this.containerDiv.querySelector("#town_name");
        const townNameDivH3 = townNameDiv.querySelector("h3");
        const townNameDivH4 = townNameDiv.querySelector("h4");
        const townMiscRight = this.containerDiv.querySelector("#town_misc_content_right");
        const ulMajor = townMiscRight.querySelectorAll("li")[0];
        const ulInhabitants = townMiscRight.querySelectorAll("li")[1];
        const errorDiv = this.containerDiv.querySelector("#error");

        if (index == -1) {
            errorDiv.textContent = "Aucun résultat.";
        } else {
            const town = this.towns[index];
            leftContainerDivH2.innerHTML = '<a href="' + town.url + '" target="blank">' + town.name + '</a>';
            console.log("test", town.test);
            
            desc.innerHTML = town.description;
            console.log(desc);
            
            townNameDivH3.textContent = town.name;
            const sup = town.region == "" ? town.state : town.region;
            townNameDivH4.innerHTML = '<i>' + town.country + ", " + sup + '</i>';
            this.loadGallery(town.images);
            ulMajor.textContent = town.major;
            ulInhabitants.textContent = town.inhabitants;
            errorDiv.textContent = "";
        }
    }

    loadGallery(images){
        const gallery = this.containerDiv.querySelector("#gallery");
        const galleryDivs = gallery.querySelectorAll("div");
        for (const div of galleryDivs) {
            div.remove();
        }
        for (const image of images) {
            const div = document.createElement("div");
            const img = document.createElement("img");
            img.src = "image/" + image.url;
            img.className = "gallery_img";
            div.appendChild(img);
            const h6 = document.createElement("h6");
            h6.textContent = image.caption;
            div.appendChild(h6);
            gallery.appendChild(div);
        }
    }

    searchInputHandler() {
        console.log("searchInputHandler", this.searchIpt.value);
        this.towns = this.filterElement(this.baseTowns, this.searchIpt.value);
        console.log("towns", this.towns.length);
        if (this.towns.length > 0) {
            this.refresh();
        } else {
            this.indexer.totalItems = 0;
            this.indexer.index = 0;
            this.indexer.setNumber();
            this.loadTown(-1);
        }
    }

    clearSearchInputHandler() {
        this.towns = [this.baseTowns];
        this.refresh();
    }

    refresh() {
        this.index = 0;
        this.indexer.totalItems = this.towns.length;
    }

    filterElement(arr, filter) {
        return arr.filter(function (element) {
            const townName = element.name;
            const bool = townName.toLowerCase().includes(filter.toLowerCase());
            return bool;
        })
    }

    initInput() {
        this.searchIpt = new SearchInput(this.containerDiv.querySelector("#search"));
        this.searchIpt.addEventListener(SearchInputEventNames.SEARCH_INPUT, function () {
            this.searchInputHandler();
        }.bind(this));
        this.searchIpt.addEventListener(SearchInputEventNames.CLEAR_SEARCH_INPUT, function () {
            this.clearSearchInputHandler();
        }.bind(this));
    }

    indexerIndexChangeHandler() {
        console.log("indexerIndexChangeHandler", this.indexer.value);

        this.loadTown(this.indexer.value);
        this.setURL();
    }

    setURL() {
        // const urlParams = new URLSearchParams(window.location.search);
        // urlParams.set('order', 'date');
        // window.location.search = urlParams;
    }

    initIndexer() {
        const optionsDiv = this.containerDiv.querySelector("#options");
        this.indexer = new Indexer(optionsDiv, this.towns.length, indexerMode.LOOP);

        this.indexer.addEventListener(IndexerEventNames.INDEX_CHANGED, function () {
            this.indexerIndexChangeHandler();
        }.bind(this));
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

class Select extends AbstractUIComponent {
    constructor(UIView) {
        super(UIView);

        this.init();
    }

    set data(dataSource) {
        // for (const town of this.towns) {
        //     const option = document.createElement("option");
        //     option.textContent = town.name;
        //     townSelect.appendChild(option);
        // }
    }

    init() {
        empty();

        super.init();
    }

    empty() {
        const options = this.UIView.querySelectorAll("option");
        for (const option of options) {
            option.remove();
        }
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

    get value() {
        return super.value;
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

    set mode(value) {
        this.indexerMode = value;
    }

    set totalItems(value) {
        this.total = value;
        this.setNumber();
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
        this.setNumber();
        this.dispatchEvent(evt);
    }

    setNumber() {
        const indexDiv = this.UIView.querySelector("#index");
        indexDiv.textContent = this.getZeroFormat(this.index + 1, this.total) + "/" + this.total;
    }

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
        const nextDiv = this.UIView.querySelector("#next");
        const previousDiv = this.UIView.querySelector("#previous");
        const divs = [previousDiv, nextDiv];
        for (const div of divs) {
            const indexerBtn = new IndexerButton(div);
            indexerBtn.addEventListener(EventNames.CLICK, function () {
                this.changeIndex(indexerBtn.buttonDiv == nextDiv ? indexerDirection.NEXT : indexerDirection.PREVIOUS);
            }.bind(this));
            if (indexerBtn.buttonDiv == nextDiv) {
                this.next = indexerBtn;
            } else {
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
    checkIndex();
}

function checkIndex() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const index = urlParams.get('index');
    if (index) {
        const nIndex = parseInt(index);
        if (!isNaN(nIndex)) {
            if (nIndex < 0) {
                alert("Paramètre incorrect !\nL'index saisi ne peut être plus petit que 0.");
            }
            worldCities.index = nIndex;
        } else {
            alert("Paramètre incorrect !\nVeuillez vérifier l'index saisi.");
        }
    }
}

const worldCities = new WorldCities(document);
worldCities.addEventListener(AbstractAppEventNames.INIT, appInitHandler);

loadDatas();