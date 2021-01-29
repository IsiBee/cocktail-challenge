var ingredientFormEl = document.querySelector("#ingredient-form");
var ingredientInputEl = document.querySelector("#entered-ingredient");

var drinkListEl = document.querySelector("#list-of-drinks");

// get list of drinks from user entered ingredient

function getDrinkList(ingredient) {
    var apiUrl = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=" + ingredient;
    fetch(apiUrl).then(function(response) {
        if(response.ok) {
            response.json().then(function(data) {
                displayDrinkList(data.drinks);
            });
        }
    })
};

// Display list of drinks to the page
function displayDrinkList(drinkList){
    drinkListEl.textContent = "";
    for(var i = 0; i < drinkList.length; i++){
        // create list element to hold the drink name
        var drinkEl = document.createElement("li");
        // get drink name from array
        var drinkName = drinkList[i].strDrink;

        drinkEl.textContent = drinkName;
        drinkListEl.appendChild(drinkEl);
    }
};


// What to do on button click
function formSubmitHandler(event){
    // prevents page from refreshing
    event.preventDefault();
    // get value from input
    var ingredientString = ingredientInputEl.value.trim();

    getDrinkList(ingredientString);
    ingredientInputEl.value = "";
}

// Event listeners
ingredientFormEl.addEventListener("submit", formSubmitHandler);