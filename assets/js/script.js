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
    drinkCardEl.classList.remove("is-hidden");

    // Pulls the name of the drink from the drink object
    var headerEl = document.createElement("div");
    headerEl.textContent = drink.strDrink;
    headerEl.classList = "card-header-title card-header"

    // Create card content div element
    var recipeEl = document.createElement("div");
    recipeEl.classList = "card-content columns";

    // Pulls the Image of the drink from the drink object
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", drink.strDrinkThumb);
    imageEl.setAttribute("width", "400px");
    imageEl.classList = "content card-image image column is-one-third";

    recipeEl.appendChild(imageEl);

    // Pull the Ingredients from the drink object
    // Pull the Measurements from the drink object
    var ingredients = document.createElement("div");
    ingredients.innerHTML = "";
    ingredients.classList = "content";
    ingredients.innerHTML = "<strong>Ingredients: </strong>"

    for (var i = 1; i < 16; i++) {
        var ingredientString = "strIngredient" + i.toString();
        var measurementString = "strMeasure" + i.toString();
        if (!(drink[ingredientString] || drink[measurementString])) {
            break;
        }
        else {
            var measurement = "";
            if(!drink[measurementString]){
                measurement = "";
            }
            else{
                measurement = drink[measurementString];
            }
            
            var ingredientEl = document.createElement("p");
            ingredientEl.textContent =
                measurement + " " + drink[ingredientString];

            ingredients.appendChild(ingredientEl);
        }
    };

    

    // Pull the Instructions from the drink object
    var instructionsEl = document.createElement("p");
    instructionsEl.innerHTML = "<strong>Instructions: </strong>" + drink.strInstructions;

    ingredients.appendChild(instructionsEl);

    recipeEl.appendChild(ingredients);
    // Display elements to the screen
    drinkCardEl.appendChild(headerEl);
    drinkCardEl.appendChild(recipeEl);

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