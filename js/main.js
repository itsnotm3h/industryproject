
let allTimer = document.querySelectorAll(".timer");

//To start the application for the website.
function app() {
  

  //loading presets and datas
  document.addEventListener("DOMContentLoaded", async function () {
    // await loadPreset();
    await getLocation(function(coords) {
        sgLat = coords[0];
        sgLng = coords[1];
        loadMap(sgLat,sgLng);

    });

    console.log(fullData);
    console.log(markerArray);

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

