const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let htmlstring = "";

//#region ***  DOM references ***

//#endregion

//#region ***  Callback-Visualisation - show___ ***

// const showBpmTime = function(currentBpmTime){
//   console.log(`BPM time ${currentBpmTime}`)
// };

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***

//#endregion

//#region ***  Data Access - get___ ***

//#endregion

//#region ***  Event Listeners - listenTo___ ***

//#endregion

//#region ***  INIT / DOMContentLoaded  ***

const init = function () {
  console.info("DOM geladen");
  console.log("Dit is de Home pagina");
};

document.addEventListener("DOMContentLoaded", init);

//#endregion
