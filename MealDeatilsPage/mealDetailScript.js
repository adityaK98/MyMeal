let mealDetails = document.getElementById("mealDetail")

document.addEventListener('DOMContentLoaded', displayMealDetails);

// Extract the meal ID from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const mealId = urlParams.get('id');

async function displayMealDetails(){

    //Fetch meal details based on the extracted ID

    const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+mealId)
    const jsonResponse = await response.json();
    const data = jsonResponse.meals[0];  
    console.log(jsonResponse)
    console.log(data)
    console.log(data.strMealThumb)
    console.log(data.strMeal)
    console.log(data.strInstructions)

    const div = document.createElement("div");
    div.innerHTML=`<div class="main-container-heading">
    <div class="mainheading">
        <div id="mealImage">
            <img src="${data.strMealThumb}">
        </div>
        <div class="mealName">
            <h2>${data.strMeal}</h2>
        </div>
        <div class="mealName">
            <button class="addFavourite">Add To Favourite</button>
        </div>
    </div>
</div>
<div class="mealRecipe">
    <div id="paraDiv">
    <a href="${data.strYoutube}" target="_blank"><h4>Watch recipe on YouTube</h4></a>
    <p>${data.strInstructions}</p>
    </div>
</div>`

mealDetails.appendChild(div)
}

function addToFavourite(e){
    
    if (!e.target.classList.contains("addFavourite")) {
        return
    }   

    let favouriteItems;

    if (localStorage.getItem("myFavouriteItemIds") === null) {
        favouriteItems = [];
    } 
    else {
        favouriteItems = JSON.parse(localStorage.getItem("myFavouriteItemIds"));
    }

    // check if the meal id is already present
    if (favouriteItems.indexOf(mealId)!== -1) {
        window.alert("Meal is already present in your favourite list");
        return;
    }

    favouriteItems.push(mealId);
    localStorage.setItem("myFavouriteItemIds", JSON.stringify(favouriteItems));
    window.alert("Meal has been successfully added to your favourite list");

}

// Open recipe page & add favourite
mealDetails.addEventListener('click', addToFavourite)