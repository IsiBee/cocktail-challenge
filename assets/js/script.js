var ingredientFormEl = document.querySelector("#ingredient-form");
var ingredientInputEl = document.querySelector("#entered-ingredient");
var drinkListEl = document.querySelector("#list-of-drinks");
var drinkCardEl = document.querySelector("#drink-card");

var errorEl = document.querySelector("#error");

// generate save cards

function generateSaveCards() {
    // Clear saved Cards
    var saveContainerEl = document.querySelector('#saved-drinks');
    //saveContainerEl.classList = "level";
    saveContainerEl.innerHTML = "";

    // Saved Drink Header

    var saveCardHeader = document.createElement("h3");
    saveCardHeader.classList = "subtitle";
    saveCardHeader.innerHTML = "<strong>Your Saved Drinks:</strong>";
    saveContainerEl.appendChild(saveCardHeader);

    // Save Drink Content
    var saveCardContent = document.createElement("div");
    saveCardContent.classList = "level";

    // Search 3

    var testSave_3 = localStorage.getItem("savedDrink_3");
    if (testSave_3 != undefined) {
        var saveContainerEl = document.querySelector('#saved-drinks');
        var saveCard_3 = document.createElement("div");
        saveCard_3.innerHTML = testSave_3;
        $(saveCard_3).addClass("saveCard tile is-child");
        saveCard_3.setAttribute("data-drink-id", localStorage.getItem("savedDrink_3.id"));
        saveCardContent.appendChild(saveCard_3);
    };

    // Search 2

    var testSave_2 = localStorage.getItem("savedDrink_2");
    if (testSave_2 != undefined) {
        var saveContainerEl = document.querySelector('#saved-drinks');
        var saveCard_2 = document.createElement("div");
        saveCard_2.innerHTML = testSave_2;
        $(saveCard_2).addClass("saveCard tile is-child");
        saveCard_2.setAttribute("data-drink-id", localStorage.getItem("savedDrink_2.id"));
        saveCardContent.appendChild(saveCard_2);
    };

    // Search 1

    var testSave_1 = localStorage.getItem("savedDrink_1");
    if (testSave_1 != undefined) {
        var saveContainerEl = document.querySelector('#saved-drinks');
        var saveCard_1 = document.createElement("div");
        saveCard_1.innerHTML = testSave_1;
        $(saveCard_1).addClass("saveCard tile is-child");
        saveCard_1.setAttribute("data-drink-id", localStorage.getItem("savedDrink_1.id"));
        saveCardContent.appendChild(saveCard_1);
    };
    
    saveContainerEl.appendChild(saveCardContent);
};

generateSaveCards();

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
    headerEl.classList = "card-header-title card-header drink-title"

    // Create card content div element
    var recipeEl = document.createElement("div");
    recipeEl.classList = "card-content columns";

    // Pulls the Image of the drink from the drink object using a helper function
    recipeEl.appendChild(getImage(drink));

    // Pull the Ingredients + Measurements from the drink object using a helper function
    var textEl = document.createElement("div");
    textEl.innerHTML = "";
    textEl.classList = "content column";
    textEl.appendChild(getIngredients(drink));

    // Pull the Instructions from the drink object
    var instructionsEl = document.createElement("p");
    instructionsEl.classList.add("pt-5");
    instructionsEl.innerHTML = "<strong>Instructions: </strong>" + drink.strInstructions;

    textEl.appendChild(instructionsEl);

    // Fetch Wiki Data
    var wikiLink = getArticle(drink);
    textEl.appendChild(wikiLink);

    // create and add save button
    var saveBtn = document.createElement("button");
    saveBtn.innerHTML = "<i class='fas fa-plus mr-2'></i>Save Drink";
    saveBtn.classList = "saveBtn button is-info is-light";
    headerEl.appendChild(saveBtn);

    saveBtn.addEventListener("click", saveDrink);

    // Saves drink name and id to local storage
    function saveDrink() {
        var save2Test = localStorage.getItem("savedDrink_2");
        if (save2Test != undefined) {
            localStorage.setItem("savedDrink_3", save2Test);
            localStorage.setItem("savedDrink_3.id", localStorage.getItem("savedDrink_2.id"));
        }
        var save1Test = localStorage.getItem("savedDrink_1");
        if (save1Test != undefined) {
            localStorage.setItem("savedDrink_2", save1Test);
            localStorage.setItem("savedDrink_2.id", localStorage.getItem("savedDrink_1.id"));
        }
        localStorage.setItem("savedDrink_1", drink.strDrink);
        localStorage.setItem("savedDrink_1.id", drink.idDrink);
        // clear saved cards

        generateSaveCards();
    };

    // Display elements to the screen
    recipeEl.appendChild(textEl);
    // Display elements to the screen
    drinkCardEl.appendChild(headerEl);
    drinkCardEl.appendChild(recipeEl);

};

function getImage(drink) {
    var imageDiv = document.createElement("div");
    imageDiv.classList = "column one-third"

    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", drink.strDrinkThumb);
    imageEl.classList = "content card-image image tile is-child is-hidden-mobile";

    imageDiv.appendChild(imageEl);

    return imageDiv;
};

function getIngredients(drink) {
    var ingredients = document.createElement("div");

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
    };
    return ingredients;
};

// Gets the wiki article for the drink card
function getArticle(drink) {
    var wikiLink = document.createElement("div");
    wikiLink.innerHTML = "";
    wikiLink.classList = "card-footer";

    var drinkName = drink.strDrink;
    var apiUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&list=search&gsrnamespace=0&gsrlimit=1&srsearch=" + drinkName;
    var wikiLinkEl = document.createElement("a");
    wikiLinkEl.classList = "card-footer-item";

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function(data) {
                if (data.query.search[0] === undefined) {
                    wikiLinkEl.innerHTML = "We don't have information about this drink";
                }
                else {
                    wikiLinkEl.innerHTML = "Learn More: " + data.query.search[0].title;
                    wikiLinkEl.setAttribute('href', "https://en.wikipedia.org/wiki/" + data.query.search[0].title);
                    wikiLinkEl.setAttribute("target", "_blank");
                }
            });
        }
        else {
            wikiLinkEl.innerHTML = "We don't have information about this drink";
        }
    }).catch(function (err) {
        wikiLinkEl.innerHTML = "We are experiencing connectivity issues with Wikipedia";
    });
    wikiLink.appendChild(wikiLinkEl);
    return wikiLink;
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
$(document).on('click', '.saveCard', getDrink);


