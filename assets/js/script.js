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

    // Pulls the Image of the drink from the drink object
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", drink.strDrinkThumb);
    imageEl.setAttribute("width", "400px");
    imageEl.classList = "card-content card-image image";

    // Pull the Ingredients from the drink object
    // Pull the Measurements from the drink object
    var ingredients = document.createElement("div");
    ingredients.innerHTML = "";
    ingredients.textContent = "Ingredients: "

    for (var i = 1; i < 16; i++) {
        var ingredientString = "strIngredient" + i.toString();
        var measurementString = "strMeasure" + i.toString();
        if (!(drink[ingredientString] || drink[measurementString])) {
            break;
        }
        else {
            var measurement = "";
            if (!drink[measurementString]) {
                measurement = "";
            }
            else {
                measurement = drink[measurementString];
            }

            var ingredientEl = document.createElement("p");
            ingredientEl.textContent =
                measurement + " " + drink[ingredientString];

            ingredients.appendChild(ingredientEl);
        }
    };

    // Pull the Instructions from the drink object
    var instructions = document.createElement("div");
    instructions.innerHTML = "";
    var instructionsEl = document.createElement("p");
    instructionsEl.textContent = "Instructions: " + drink.strInstructions;

    instructions.appendChild(instructionsEl);

    // Fetch Wiki Data
    var wikiLink = document.createElement("div");
    wikiLink.innerHTML = "";
    var drinkName = drink.strDrink;
    console.log(drinkName);
    var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&gsrnamespace=0&gsrlimit=1&srsearch="+ drinkName;
    var wikiLinkEl = document.createElement("p");

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                wikiLinkEl.innerHTML = "Wikipedia Link: " + data.query.search[0].title;
            });
        }
    });

    wikiLink.appendChild(wikiLinkEl);

    // Display elements to the screen
    drinkCardEl.appendChild(headerEl);
    drinkCardEl.appendChild(imageEl);
    drinkCardEl.appendChild(ingredients);
    drinkCardEl.appendChild(instructions);
    drinkCardEl.appendChild(wikiLink);

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