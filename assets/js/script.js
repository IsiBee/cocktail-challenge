var ingredientFormEl = document.querySelector("#ingredient-form");
var ingredientInputEl = document.querySelector("#entered-ingredient");
var drinkListEl = document.querySelector("#list-of-drinks");
var drinkCardEl = document.querySelector("#drink-card");

var errorEl = document.querySelector("#error");

// get list of drinks from user entered ingredient


function getDrinkList(ingredient) {
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;

    $.get(apiUrl)
        .then(displayDrinkList)
        .catch(function (err) {
            console.log("Error");

        });
};

// Display list of drinks to the page
function displayDrinkList(drinkList) {
    DRINKS = drinkList.drinks;
    drinkListEl.textContent = "";

    if (!drinkList) {
        errorEl.textContent = "Please enter a valid Ingredient.";
    }

    else {
        for (var i = 0; i < DRINKS.length; i++) {
            // create list element to hold the drink name
            var drinkEl = document.createElement("div");
            drinkEl.classList.add("panel-block");
            drinkEl.classList.add("hover-color");

            drinkEl.textContent = DRINKS[i].strDrink;

            drinkListEl.appendChild(drinkEl);
            drinkEl.setAttribute("data-drink-id", DRINKS[i].idDrink);
            drinkEl.addEventListener("click", getDrink);
        }
    }
};


// Fetches data for clicked drink
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

// Displays drink card for selected drink
function displayDrinkCard(drink) {
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
    imageEl.classList = "content card-image image column is-one-third is-hidden-mobile";

    recipeEl.appendChild(imageEl);

    // Pull the Ingredients from the drink object
    // Pull the Measurements from the drink object
    var ingredients = document.createElement("div");
    ingredients.innerHTML = "";
    ingredients.classList = "content column";
    ingredients.innerHTML = "<strong>Ingredients: </strong>"

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
            ingredientEl.classList = "mt-1 ml-2";
            ingredientEl.innerHTML =
                measurement + " " + drink[ingredientString];

            ingredients.appendChild(ingredientEl);
        }
    }

    // Pull the Instructions from the drink object
    var instructionsEl = document.createElement("p");
    instructionsEl.innerHTML = "<strong>Instructions: </strong>" + drink.strInstructions;

    ingredients.appendChild(instructionsEl);

    // Fetch Wiki Data
    var wikiLink = document.createElement("div");
    wikiLink.innerHTML = "";
    var drinkName = drink.strDrink;
    var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&gsrnamespace=0&gsrlimit=1&srsearch=" + drinkName;
    var wikiLinkEl = document.createElement("a");

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                wikiLinkEl.innerHTML = "Wikipedia Link: " + data.query.search[0].title;
                wikiLinkEl.setAttribute('href', "https://en.wikipedia.org/wiki/" + data.query.search[0].title);
                wikiLinkEl.setAttribute("target", "_blank");
            });
        }
    });

    wikiLink.appendChild(wikiLinkEl);
    ingredients.appendChild(wikiLink);

    // Saves drink name to local storage
    function saveDrink() {
        var save2Test = localStorage.getItem("savedDrink_2");
        if (save2Test != undefined) {
            localStorage.setItem("savedDrink_3", save2Test);
        }
        var save1Test = localStorage.getItem("savedDrink_1");
        if (save1Test != undefined) {
            localStorage.setItem("savedDrink_2", save1Test);
        }
        localStorage.setItem("savedDrink_1", drink.strDrink);
    };

    // create and add save button
    var saveBtn = document.createElement("button");
    saveBtn.innerHTML = "Save Drink";
    saveBtn.classList.add("saveBtn");
    ingredients.appendChild(saveBtn);

    saveBtn.addEventListener("click", saveDrink);

    // Display elements to the screen
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
    errorEl.textContent = "";

};

// Event listeners
ingredientFormEl.addEventListener("submit", formSubmitHandler);
