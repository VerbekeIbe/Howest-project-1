const lanIP = `${window.location.hostname}:5000`;
const socket = io(`http://${lanIP}`);

let htmlstring = "";
let volumeinfo = false;
let trendinfo = false;
let pulseinfo = false;
let currentVolumeTime = "No data";
let currentTempTime = "No data";
let currentPulseTime = "No data";
let pause = false;

//#region ***  DOM references ***

//#endregion

//#region ***  Callback-Visualisation - show___ ***

const showVolume = function (newVolume) {
  document.querySelector(".js-volumeValue").innerHTML = `${newVolume} %`;
};

const showBpm = function (currentBPM) {
  document.querySelector(".js-currentBpm").innerHTML = `${currentBPM}`;
};

const showTrend = function (currentTemp) {
  if (currentTemp >= 26) {
    document.querySelector(".js-trend").innerHTML = "Speeding Up";
  } else {
    document.querySelector(".js-trend").innerHTML = "Slowing Down";
  }
};

const showTrendTime = function (currentTempTime) {
  console.log(`Temperature time ${currentTempTime}`);
};

const showPlaying = function (song) {
  let songtitel = song.Titel;
  let uitvoerder = song.Uitvoerder;
  document.querySelector(
    ".js-albumart"
  ).innerHTML = `<img class="c-album-art" src="img/albumarts/${songtitel}.png" alt="Album Art">`;
  document.querySelector(
    ".js-artist"
  ).innerHTML = `<p class="c-artist">${uitvoerder}</p>`;
  document.querySelector(".js-song").innerHTML = `<p>${songtitel}</p>`;
};

//#endregion

//#region ***  Callback-No Visualisation - callback___  ***

//#endregion

//#region ***  Data Access - get___ ***

//#endregion

//#region ***  Event Listeners - listenTo___ ***
const listenToSocket = function () {
  socket.on("B2F_connected", function () {
    console.log("verbonden met socket webserver");
  });
};

const listenToUI = function () {};

const listenToVolume = function () {
  socket.on("B2F_volume", function (value) {
    let newVolume = value.currentVolume;
    showVolume(newVolume);
  });
};

const listenToVolumeTime = function () {
  socket.on("B2F_volume_time", function (value) {
    console.log("VolumeTime binnengehaald");
    currentVolumeTime = value.currentTime;
  });
};

const listenToVolumeInfo = function () {
  const volume_infobutton = document.querySelector(".js-volume-info-button");
  console.log("click event staat aan voor volume");
  volume_infobutton.onclick = function () {
    console.log("er is geklikt op de volume infobutton");
    volumeinfo = !volumeinfo;
    if (volumeinfo == true) {
      document.querySelector(
        ".js-volume-info"
      ).innerHTML = `<div class="u-align--popup">
        <div class="c-infopopup">Last Measurement: Today - ${currentVolumeTime}</div>
        </div>`;
    }
    if (volumeinfo == false) {
      document.querySelector(".js-volume-info").innerHTML = "";
    }
  };
};

const listenToPulse = function () {
  socket.on("B2F_pulse", function (value) {
    let currentBPM = value.currentBPM;
    showBpm(currentBPM);
  });
};

const listenToPulseTime = function () {
  socket.on("B2F_pulse_time", function (value) {
    currentPulseTime = value.currentTime;
  });
};

const listenToPulseInfo = function () {
  const pulse_infobutton = document.querySelector(".js-pulse-info-button");
  console.log("click event staat aan voor trend");
  pulse_infobutton.onclick = function () {
    console.log("er is geklikt op de pulse infobutton");
    pulseinfo = !pulseinfo;
    if (pulseinfo == true) {
      console.log("nu zou de info moeten verschijnen");
      document.querySelector(
        ".js-pulse-info"
      ).innerHTML = `<div class="u-align--popup">
        <div class="c-infopopup">Last Measurement: Today - ${currentPulseTime}</div>
        </div>`;
    }
    if (pulseinfo == false) {
      console.log("nu zou de info moeten verdwijnen");
      document.querySelector(".js-pulse-info").innerHTML = "";
    }
  };
};

const listenToTemperature = function () {
  socket.on("B2F_temperature", function (value) {
    console.log(`Current Temperature ${value.currentTemperature}`);
    let currentTemp = value.currentTemperature;
    showTrend(currentTemp);
  });
};

const listenToTemperatureTime = function () {
  socket.on("B2F_temperature_time", function (value) {
    currentTempTime = value.currentTime;
  });
};

const listenToTemperatureInfo = function () {
  const temp_infobutton = document.querySelector(".js-trend-info-button");
  console.log("click event staat aan voor trend");
  temp_infobutton.onclick = function () {
    console.log("er is geklikt op de trend infobutton");
    trendinfo = !trendinfo;
    if (trendinfo == true) {
      console.log("nu zou de info moeten verschijnen");
      document.querySelector(
        ".js-trend-info"
      ).innerHTML = `            <div class="u-align--popup">
        <div class="c-infopopup">Last Measurement: Today - ${currentTempTime}</div>
        </div>`;
    }
    if (trendinfo == false) {
      console.log("nu zou de info moeten verdwijnen");
      document.querySelector(".js-trend-info").innerHTML = "";
    }
  };
};

const listenToReset = function () {
  const resetbutton = document.querySelector(".js-reset");
  resetbutton.addEventListener("click", function () {
    socket.emit("F2B_reset");
  });

  const skipbutton = document.querySelector(".js-skip");
  skipbutton.addEventListener("click", function () {
    socket.emit("F2B_reset");
  });
};

const listenToPlaying = function () {
  socket.on("B2F_song_playing", function (song) {
    showPlaying(song);
  });
};

const listenToPlayPause = function () {
  const playpausebutton = document.querySelector(".js-play-pause");
  playpausebutton.onclick = function () {
    pause = !pause;
    if (pause == true) {
      document.querySelector(
        ".js-play-pause"
      ).innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
    <g id="_play_arrow" data-name=" play_arrow" transform="translate(-746 -950)">
      <rect id="Rectangle_Copy_50" data-name="Rectangle Copy 50" width="24" height="24" transform="translate(746 950)" fill="rgba(0,0,0,0)"/>
      <path id="Icon" d="M754.54,955.98l8.14,5.17a1,1,0,0,1,0,1.69l-8.14,5.18a1,1,0,0,1-1.54-.84V956.82A1,1,0,0,1,754.54,955.98Z" fill="#fff"/>
    </g>
  </svg>`;
      console.log("icon verandert");
      socket.emit("F2B_pause");
      console.log("socket verzonden");
    }
    if (pause == false) {
      document.querySelector(
        ".js-play-pause"
      ).innerHTML = `  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
      <g id="_pause" data-name=" pause" transform="translate(-644 -950.823)">
        <rect id="Rectangle_Copy_67" data-name="Rectangle Copy 67" width="28" height="28"
          transform="translate(644 950.823)" fill="rgba(0,0,0,0)" />
        <path id="Icon"
          d="M12,16h-.666a2,2,0,0,1-2-2V2a2,2,0,0,1,2-2H12a2,2,0,0,1,2,2V14A2,2,0,0,1,12,16ZM2.334,16A2.313,2.313,0,0,1,0,13.714V2.285A2.312,2.312,0,0,1,2.334,0,2.312,2.312,0,0,1,4.667,2.285V13.714A2.312,2.312,0,0,1,2.334,16Z"
          transform="translate(652 955.823)" fill="#fff" />
      </g>
    </svg>`;
      console.log("icon verandert");
      socket.emit("F2B_play");
      console.log("socket verzonden");
    }
  };
};

//#endregion

//#region ***  INIT / DOMContentLoaded  ***

const init = function () {
  console.info("DOM geladen");
  console.log("Dit is de dashboard pagina");
  listenToVolume();
  listenToVolumeTime();
  listenToVolumeInfo();
  listenToPulse();
  listenToPulseTime();
  listenToPulseInfo();
  listenToTemperature();
  listenToTemperatureTime();
  listenToTemperatureInfo();
  listenToReset();
  listenToPlaying();
  listenToPlayPause();
};

document.addEventListener("DOMContentLoaded", init);
listenToSocket();

//#endregion
