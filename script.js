const mealInput = document.getElementById("textbox")
const searchBtn = document.getElementById("searchbtn")
const searchResultPopup = document.getElementById("pop")
const popup = document.getElementById("popup")
const recipeBtn = document.getElementById("recipe")
const favouriteBtn = document.getElementsByClassName("addFavourite")
const closePopup = document.getElementById("close-button")
const mealDetail = document.getElementsByClassName("mealDetail")
const suggestionBox = document.getElementById("suggestionBox")
const itemName = document.getElementById("suggestionBox")

// search & get meal details
async function getMealDetails(){
    let meal = mealInput.value

    if(meal.trim()===''){
        alert("Please enter valid meal name! e.g. Biryani")
        return;
    }

    searchResultPopup.innerHTML="";
    // API get call
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?s="+meal);
    let data = await response.json();
    console.log(data.meals);

    if (data.meals===null){
        alert("Please enter valid meal name! e.g. Biryani")
    }else{
        for(let item of data.meals){

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
                    <button class="addFavourite">Add To Favourite</button>
                </div>
            </div>`;
    
        searchResultPopup.append(div);

        }
        popup.classList.add("open-popup")
        //remove searchbar value
        mealInput.value = "";
    }

}

// Function to get suggestions
async function getSuggestion(){
    let firstLetter = mealInput.value[0]
    
    // fetch details on the basis of first letter using GET API
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/search.php?f="+firstLetter);
    let data = await response.json();
    console.log(data.meals);

    if(data.meals === null){
        alert("Please try with another name")
        return
    }

    //save name of meals in array
    let suggestedArray = []
    for(let item of data.meals){
        suggestedArray.push(item.strMeal.toLowerCase());
    }

    //Get full meal name
    console.log(suggestedArray)
    let input = mealInput.value;
    
    if(input.length){
        //filter full name from the main array
        let result = suggestedArray.filter(word => word.includes(input))
        var count = 0;
        for(let it of result){
            let suggestionList = document.createElement("ul")
            suggestionList.innerHTML=`<li class="itemName">${it}</li>`;
            suggestionBox.append(suggestionList);

            count++;
            // for max 6 sggestion
            if(count===6){
                break
            }
        } 
            
    }
}

// Function to get recipe details on new page
function clickRecipeDetails(e){
    if (!e.target.classList.contains("recipe-button")) {
        return;
    } 

    let itemId=e.target.parentElement.parentElement.parentElement.id;

    let newTab = "MealDeatilsPage/mealDetails.html?id="+itemId
        window.open(newTab, '_blank');

}

//Function to add meal as a Favourite
// get id of the meal which we want to add as a favourite and save it locally
function addToFavourite(e){
    
    if (!e.target.classList.contains("addFavourite")) {
        if(e.target.classList.contains("recipe-button")){
            clickRecipeDetails(e);
            return
        }
        else if(!e.target.classList.contains("recipe-button")){
            return
        }
    }   

    let itemId=e.target.parentElement.parentElement.parentElement.id;
    console.log(itemId)
    let favouriteItems;

    if (localStorage.getItem("myFavouriteItemIds") === null) {
        favouriteItems = [];
    } 
    else {
        favouriteItems = JSON.parse(localStorage.getItem("myFavouriteItemIds"));
    }

    // check if the meal id is already present
    if (favouriteItems.indexOf(itemId)!== -1) {
        window.alert("Meal is already present in your favourite list");
        return;
    }

    favouriteItems.push(itemId);
    localStorage.setItem("myFavouriteItemIds", JSON.stringify(favouriteItems));
    window.alert("Meal has been successfully added to your favourite list");

}


// Event Listeners - HomePage

//Search Button - Click
searchBtn.addEventListener('click',()=>{
    getMealDetails();
    suggestionBox.innerHTML=''
});

//Search Button - Enter
mealInput.addEventListener('keyup',function(e){
    if(e.key==="Enter"){
    getMealDetails();
    suggestionBox.innerHTML=''
    }
})

//Close Button - Search result popup
closePopup.addEventListener('click',function(e){
    popup.classList.remove("open-popup")
});

// Open recipe page & add favourite
searchResultPopup.addEventListener('click', addToFavourite)


// to open suggestion box by verifying key
mealInput.addEventListener("keyup",function (e) {
    const keyPressed = e.key;

    // Check if the pressed key is an alphabetical key
    if (/^[a-zA-Z]$/.test(keyPressed) || keyPressed === 'Backspace') {
        if(mealInput.value.length){
            if(mealInput.value.length>1){
                suggestionBox.innerHTML=''
                getSuggestion();
            }else{
                getSuggestion();
            }
        }
        else {
            suggestionBox.innerHTML=''
        }

    }

});

//click on suggested meals
itemName.addEventListener("click", function(e){
    const parent = e.target.firstChild
    mealInput.value = parent.textContent
    getMealDetails();
    suggestionBox.innerHTML=''
})
