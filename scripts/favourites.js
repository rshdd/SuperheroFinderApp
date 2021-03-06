// Valores necesarios
const access_token = "3179877388958516";
const api_url = "https://www.superheroapi.com/api.php/"+access_token+"/";
const favFalse = '../assets/images/white_star.png';
const favTrue = '../assets/images/red_star.png';

driver();

function driver(){
    // GET favoritos del user
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    if(favs.length==0){
        document.getElementById('results').innerHTML = "Add your favourite Heroes";
        return;
    }
    document.getElementById('results').innerHTML = '';
    favs.forEach((id) => {
        searchHero(id);
    });
}

// HANDLE de los detalles de los heroes
document.addEventListener('click', (event) => {
    // Botton de detalles
    if(event.target.id == 'details_btn'){
        var id = event.target.parentNode.id;
        window.open('./details.html'+'?id='+id, "_self");
    }
    // Boton de favoritos
    else if(event.target.id == 'add_fav_btn'){
        var id = event.target.parentNode.parentNode.id;
        var favs = JSON.parse(localStorage.getItem('superheroFavs'));
        if (favs.indexOf(id) != -1){
            favs = favs.filter((item) => item!=id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favFalse;
            document.getElementById(id).remove();
            customAlert('failure','Removed from fav');
        }
        else{
            favs.push(id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favTrue;
            customAlert('success','Added to fav');
        }
    }
});

// Función del API
async function searchHero(id){
    // Llamando API
    let response = await fetch(api_url+id);
    if (response.ok) {
        renderCard(await response.json());
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
}


// DOM de la Card
function renderCard(data){
    var cardContainer = document.createElement('DIV');
    cardContainer.className = 'card-container center';
    cardContainer.id = data.id;
    var srcFav;
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    // Cheking if its a fav or not
    if(favs.indexOf(data.id) !== -1){
        srcFav = favTrue;
    }
    else{
        srcFav = favFalse;
    }
    cardContainer.innerHTML = `
        <div class="card-img-container">
            <img src="${data.image.url}">
        </div>
        <div id="details_btn" class="card-name">${data.name}</div>
        <div class="card-btns">
            <img id="add_fav_btn" src="${srcFav}" width="25">
        </div>
    
        <div id="stats-container">
            <div id="stat-names">
                <span>Combat</span>
                <span>Durability</span>
                <span>Intelligence</span>
                <span>Power</span>
                <span>Speed</span>
                <span>Strength</span>
            </div>

            <div id="stat-bars">
                <div class="bar-container">
                    <div class="bar combat" style="width: ${data.powerstats.combat}%;">${data.powerstats.combat}</div>
                </div>
                <div class="bar-container">
                    <div class="bar durability" style="width: ${data.powerstats.durability}%;">${data.powerstats.durability}</div>
                </div>
                <div class="bar-container">
                    <div class="bar intelligence" style="width: ${data.powerstats.intelligence}%;">${data.powerstats.intelligence}</div>
                </div>
                <div class="bar-container">
                    <div class="bar power" style="width: ${data.powerstats.power}%;">${data.powerstats.power}</div>
                </div>
                <div class="bar-container">
                    <div class="bar speed" style="width: ${data.powerstats.speed}%;">${data.powerstats.speed}</div>
                </div>
                <div class="bar-container">
                    <div class="bar strength" style="width: ${data.powerstats.strength}%;">${data.powerstats.strength}</div>
                </div>
            </div>
        </div>
    `
    document.getElementById('results').appendChild(cardContainer);
}

// Visibilidad del Alert Box
function customAlert(type, message){
    var element = document.getElementsByClassName(type);
    element[0].innerHTML = message;
    element[0].style.visibility = "visible"
    setTimeout(() => {
        element[0].style.visibility = "hidden";
    }, 1500);
}