// alert("hello world!");

//About Map
// 1. Get the user's location - done
// 2. Set the map to their view - done


//About Game
// 1. What is the game format? the map will refresh every 3 sections. 
// 2. Timer on the questions. 


// About Setting Question.
// 1. I have to set questions + location + answer + pokemon + timer; - done
// 1.1 How do i set the location at random. 
// 1.2 Need a function to set all the arrays. 
// 2. On click it will out the question based on the dataset on the Array; - done
// 3. validate question and answer through array.
// 4. if correct it will delete the icon and add pokemon into library.


//To start the application for the website.
function app() {

  //loading presets and datas

  document.addEventListener("DOMContentLoaded", async function () {
    // fullPokemon = await loadPokemon();
    await getLocation();
    // console.log(fullData);
  })
  
  

  // document.querySelectorAll('.pokeIcon').addEventListener('click', (e) => {
  //   console.log(e.target.dataset.questionid);
  // })
 
  
  // loading().then(
  // alert("yes");
  // );




  
  //add a marker

}




app();

