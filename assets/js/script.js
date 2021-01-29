var ingredientFormEl = document.querySelector("#ingredient-form");
var ingredientInputEl = document.querySelector("#entered-ingredient");
var drinkListEl = document.querySelector("#list-of-drinks");

var drinkCardEl = document.querySelector("#drink-card");

// get list of drinks from user entered ingredient

function getDrinkList(ingredient) {
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayDrinkList(data);
            });
        }
        else {
            console.log("Error");
        }
    })
        .catch(
            console.log("Error")
        );

};

// Display list of drinks to the page
function displayDrinkList(drinkList) {
    DRINKS = drinkList.drinks;
    drinkListEl.textContent = "";

    for (var i = 0; i < DRINKS.length; i++) {
        // create list element to hold the drink name
        var drinkEl = document.createElement("div");
        drinkEl.classList.add("panel-block");
        drinkEl.setAttribute("data-drink-id", DRINKS[i].idDrink);
        drinkEl.addEventListener("click", getDrink);
        drinkEl.textContent = DRINKS[i].strDrink;
        drinkListEl.appendChild(drinkEl);
    }
};

function getDrink() {
    var id = this.getAttribute("data-drink-id");

    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=" + id;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                displayDrinkCard(data.drinks[0]);
            });
        }
    });
};

function displayDrinkCard(drink) {
    console.log(drink);
    drinkCardEl.innerHTML = "";

    var headerEl = document.createElement("h2");
    headerEl.textContent = drink.strDrink;
    headerEl.classList = "card-header-title card-header"

    var imageEl = document.createElement("img");
    imageEl.setAttribute("src",drink.strDrinkThumb);
    imageEl.classList = "card-image"

    drinkCardEl.appendChild(headerEl);
    drinkCardEl.appendChild(imageEl);
    
};


// What to do on button click
function formSubmitHandler(event) {
    // prevents page from refreshing
    event.preventDefault();
    // get value from input
    var ingredientString = ingredientInputEl.value.trim();

    getDrinkList(ingredientString);
    ingredientInputEl.value = "";
}

// Event listeners
ingredientFormEl.addEventListener("submit", formSubmitHandler);