const favDiv = document.getElementById("centreBody")
const favMealCounter = document.getElementById("numberHeading")

//on page load event listener
document.addEventListener('DOMContentLoaded', displayFavriteMeals);

//meal ids in local storage
let favMeals=localStorage.getItem("myFavouriteItemIds")
let itemId = JSON.parse(favMeals)
console.log(favMeals)

async function displayFavriteMeals(){
    

    for (let id of itemId){
        console.log(id)
        // API get call
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/lookup.php?i="+id);
        let data = await response.json();
       
        let item = data.meals[0]
        let div = document.createElement("div")
        div.id = item.idMeal;
        div.className = "itemList";
        div.innerHTML=`
        <div id="mealImage">
        <img src="${item.strMealThumb}">
        </div>
        <div id="mealDetails">
            <div><h3>${item.strMeal}</h3></div>
            <div><h4>Type: ${item.strArea}</h4></div>
            <div><h4>Category: ${item.strCategory}</h4></div>
            <div>
                <button id="recipe" class="recipe-button">Recipe Details</button>
                <button class="removeFavourite">Remove From Favourite</button>
            </div>
        </div>`;

        favDiv.append(div);
        
    }
    countMeals();
}

// Function to get recipe details on new page
function clickRecipeDetails(e){
    if (!e.target.classList.contains("recipe-button")) {
        return;
    } 

    let itemId=e.target.parentElement.parentElement.parentElement.id;

    let newTab = "../MealDeatilsPage/mealDetails.html?id="+itemId
        window.open(newTab, '_blank')

}

//Function to add meal as a Favourite
// get id of the meal which we want to add as a favourite and save it locally
function removeFavourite(e){
    
    if (!e.target.classList.contains("removeFavourite")) {
        if(e.target.classList.contains("recipe-button")){
            clickRecipeDetails(e);
            return
        }
        else if(!e.target.classList.contains("recipe-button")){
            return
        }
    }   

    let itemId=e.target.parentElement.parentElement.parentElement.id;

    let favMeal=[];
    favMeal=JSON.parse(localStorage.getItem("myFavouriteItemIds"));
    // creating a new list to while removing the selected item
    let new_favMeal=favMeal.filter((id)=> id !== itemId);

    localStorage.setItem("myFavouriteItemIds", JSON.stringify(new_favMeal));

    let removeMeal = document.getElementById(itemId)
    removeMeal.remove()
    countMeals();
}

// Open recipe page & add favourite
favDiv.addEventListener('click', removeFavourite)

//Number of favourite meals
function countMeals(){
let counter = document.getElementsByClassName('itemList')
console.log(counter.length)
favMealCounter.innerText = counter.length
}

