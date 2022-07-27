class WorldCities extends AbstractApp {
    constructor(containerDiv){
        super(containerDiv);

        this.towns = [];
    }

    init(dataSource){


        super.init(dataSource);
    }
}

class Town {
    constructor(){
        
    }
}

async function loadDatas(){
    const response = await fetch("data/datas.json")
    .then(response => response.json())
    .then(json => worldCities.init(json)
    );

//     fetch("data/datas.json")
//   .then(response => response.json())
//   .then(json => console.log(json));

}

function appInitHandler(evt){
    console.log("worldCities.dataSource", worldCities.dataSource);
    
}

const worldCities = new WorldCities(document);
worldCities.addEventListener(AbstractAppEventNames.INIT, appInitHandler);

loadDatas();