var ingredientFormEl = document.querySelector("#ingredient-form");
var ingredientInputEl = document.querySelector("#entered-ingredient");
var drinkListEl = document.querySelector("#list-of-drinks");

let DRINKS = []
// get list of drinks from user entered ingredient

function getDrinkList(ingredient) {
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;

    $.get(apiUrl)
        .then(displayDrinkList)
        .catch(function (err) {
            console.warn(err)
        })

};

// Display list of drinks to the page
function displayDrinkList(drinkList) {
    DRINKS = drinkList.drinks;
    drinkListEl.textContent = "";

    for (var i = 0; i < DRINKS.length; i++) {
        // create list element to hold the drink name
        var drinkEl = document.createElement("div");
        drinkEl.classList.add("panel-block");
        drinkEl.setAttribute("data-drink-id", DRINKS[i].idDrink)
        drinkEl.addEventListener("click", displayDrink)
        drinkEl.textContent = DRINKS[i].strDrink;
        drinkListEl.appendChild(drinkEl);
    }
};

function displayDrink() {
    var id = this.getAttribute("data-drink-id")
    var drink;

    for (var i = 0; i < DRINKS.length; i++) {
        if (DRINKS[i].idDrink === id) {
            drink = DRINKS[i]
            break;
        }
    }

    console.log(drink)
}


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