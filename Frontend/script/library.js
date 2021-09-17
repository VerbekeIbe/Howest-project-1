const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let htmlstring = "";

//#region ***  DOM references ***

//#endregion

//#region ***  Callback-Visualisation - show___ ***
const showSongs = function (jsonObject) {
  console.log(jsonObject);
  let html_string = "";
  for (const song of jsonObject) {
    let titel = song.Titel;
    let id = song.Id;
    let uitvoerder = song.Uitvoerder;
    html_string += `<div class="o-container c-library-song">
    <div class="o-layout o-layout--gutter o-layout--align-center">
      <div class="o-layout__item u-1-of-3">
        <div class="u-align--center">
          <img class="c-album-art-small" src="img/albumarts/${titel}.png" alt="Album Art">
        </div>
      </div>
      <div class="o-layout__item u-1-of-3 c-song-info" data-id="">
        <div class="u-align--left">
          <p class="c-library-title">${titel}</p>
          <p class="c-library-artist">${uitvoerder}</p>
        </div>
      </div>
      <div class="o-layout__item u-1-of-3">
        <div class="u-align--center">
          <div class="js-delete-button" data-id="${id}">
          <p>
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
              <g id="_delete" data-name=" delete" transform="translate(-270 -242)">
                <rect id="Path" width="24" height="24" transform="translate(270 242)" fill="rgba(0,0,0,0)"/>
                <path id="Icon" d="M286,263h-8a2,2,0,0,1-2-2V251a2,2,0,0,1,2-2h8a2,2,0,0,1,2,2v10A2,2,0,0,1,286,263Zm2-15H276a1,1,0,1,1,0-2h2.5l.71-.71a1.011,1.011,0,0,1,.7-.29h4.18a1.01,1.01,0,0,1,.7.29l.71.71H288a1,1,0,1,1,0,2Z" fill="#fff"/>
              </g>
            </svg>
            
          </p>
        </div>
        </div>
      </div>
    </div>
  </div>`;
  }

  document.querySelector(".js-library-song").innerHTML += html_string;
  listenToOptions();
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***

//#endregion

//#region ***  Data Access - get___ ***
const getSongs = function () {
  console.log("songs ophalen uit de database");
  socket.emit("F2B_get_songs");
};

//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToSocket = function () {
  socket.on("B2F_connected", function () {
    console.log("verbonden met socket webserver");
  });

  socket.on("B2F_send_songs", function (songs) {
    let songlist = songs;
    showSongs(songlist);
  });
};

const listenToReset = function () {
  const resetbutton = document.querySelector(".js-reset");
  resetbutton.addEventListener("click", function () {
    socket.emit("F2B_reset");
  });
};

const listenToOptions = function () {
  const deletebuttons = document.querySelectorAll(".js-delete-button");
  for (const btn of deletebuttons) {
    btn.addEventListener("click", function () {
      console.log(btn);
      console.log("delete geklikt");
      const delete_id = btn.getAttribute("data-id");
      socket.emit("F2B_delete", { song_to_delete: delete_id });
    });
  }
};
//#endregion

//#region ***  INIT / DOMContentLoaded  ***

const init = function () {
  console.info("DOM geladen");
  console.log("Dit is de library pagina");
  getSongs();
  listenToReset();
};

document.addEventListener("DOMContentLoaded", init);
listenToSocket();

//#endregion
