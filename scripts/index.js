// Valores necesarios
const access_token = "3179877388958516";
const url = 'https://superheroapi.com/api.php/'+access_token+'/search/';
const favFalse = '../assets/images/white_star.png';
const favTrue = '../assets/images/red_star.png';

// crear el objeto de localStorage
checkLocalStorage();

// Busqueda principal
const searchBar = document.getElementById('search-data');
searchBar.addEventListener('keyup', (e)=> {
    const searchString = e.target.value;
    console.log("Searching for: ",searchString);
    if (searchString.length < 2){       // avoiding huge number of search results
        document.getElementById('results').innerHTML = 'Add atleast 2 characters';
    }
    else{
        searchHero(searchString);
    }
});

// Inicializar la entrada al localStorage
function checkLocalStorage(){
    if (localStorage.getItem('superheroFavs')==null){
        localStorage.setItem('superheroFavs', JSON.stringify(Array()));
    }
}

// HANDLE detalles y accion fav
document.addEventListener('click', (event) => {
    // Boton de detalles
    if(event.target.id == 'details_btn'){
        var id = event.target.parentNode.id;
        window.open('./details.html'+'?id='+id, "_self");
    }
    // Boton fav
    else if(event.target.id == 'add_fav_btn'){
        var id = event.target.parentNode.parentNode.id;
        var favs = JSON.parse(localStorage.getItem('superheroFavs'));
        // boton fav decider
        if (favs.indexOf(id) != -1){
            favs = favs.filter((item) => item!=id);
            localStorage.setItem('superheroFavs',JSON.stringify(favs));
            event.target.src = favFalse;
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


async function searchHero(searchString){
    // Llamando API
    let response = await fetch(url+searchString);
    if (response.ok) {
        renderData(await response.json());
    }
    else {
        alert("HTTP-Error: " + response.status);
    }
}

function renderData(data){
    // Checar si hay algo
    if(data.response=='error' || data.results.length === 0){
        document.getElementById('results').innerHTML = data.error;   
    }
    else{
        // Borrar elementos previos
        var results = document.getElementById('results');
        results.remove();

        // Crear nuevos resultados
        var result_container = document.getElementById('result-container');
        var results = document.createElement('DIV');
        results.id = 'results';
        result_container.appendChild(results);
        
        // Hacer RENDER de los hero
        data.results.forEach((element) => {
            results.appendChild(getCard(element));
        });
    }
}

function getCard(data){
    // Contenedor de Hero
    var cardContainer = document.createElement('DIV');
    cardContainer.className = 'card-container center';
    cardContainer.id = data.id;
    var srcFav;
    var favs = JSON.parse(localStorage.getItem('superheroFavs'));
    // Checar si el hero es fav o no
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
    `
    return cardContainer;
}

// Cambiar alerta
function customAlert(type, message){
    var element = document.getElementsByClassName(type);
    element[0].innerHTML = message;
    element[0].style.visibility = "visible"
    setTimeout(() => {
        element[0].style.visibility = "hidden";
    }, 1500);
}