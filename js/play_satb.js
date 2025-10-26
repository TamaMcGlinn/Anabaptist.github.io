var song_playing = undefined
var last_displayed_song = undefined

const voices = ["Soprano", "Alto", "Tenor", "Bass"]

function get_current_song_progress() {
  if (song_playing === undefined) {
    return 0
  }
  var highestTime = 0
  song_playing.audioElements.forEach((audio) => {
    if (audio.currentTime > highestTime) {
      highestTime = audio.currentTime
    }
  })
  return highestTime
}

function getAudioElements(song_name) {
  var selectedElements = [];
  voices.forEach((voice) => {
    var audioElement = document.getElementById(song_name + "-" + voice);
    selectedElements.push(audioElement);
  });
  return selectedElements
}

function resetSong(song) {
  var song_name = song.name
  if (song_playing === undefined) {
    // start playing if nothing was playing
    play_song(song)
  } else if (song_playing.name !== song.name) {
    // if something else was playing, pause and switch song
    pauseAudio()
    play_song(song)
  }
  // reset song time to 0
  song_playing.audioElements.forEach(x => x.currentTime = 0)
}

const speed_change_event = new Event("speed_change");

document.addEventListener("speed_change", (e) => {
  var speed = get_playback_speed()
  if (song_playing !== undefined) {
    song_playing.audioElements.forEach(x => x.playbackRate = speed);
  }
  var speed_label = document.getElementById("lbl_speed")
  speed_label.textContent = speed + "x"
})

function speed_slider_change() {
  document.dispatchEvent(speed_change_event);
}

const volume_change_event = new Event("volume_change");

document.addEventListener("volume_change", (e) => {
  var master_volume_slider = document.getElementById("sld_volume")
  voices.forEach((v) => {
    var voice_volume_slider = document.getElementById("sld_" + v)
    voice_volume_slider.value = master_volume_slider.value
    slider_change(v)
  })
});

function volume_change() {
  document.dispatchEvent(volume_change_event);
}

const voice_volume_change_event = new CustomEvent("voice_volume_change");

function slider_change(voice) {
  document.dispatchEvent(new CustomEvent("voice_volume_change", {
    bubbles: true,
    detail: voice 
  }));
}

document.addEventListener("voice_volume_change", (e) => {
  if (song_playing === undefined) {
    return
  }
  var voice = e.detail
  var index = voices.indexOf(voice);
  var slider = document.getElementById("sld_" + voice)
  song_playing.audioElements[index].volume = slider.value / 100
});

function get_playback_speed() {
  var speed_slider = document.getElementById("sld_speed")
  return speed_slider.value / 100
}

function get_volumes() {
  var volumes = []
  voices.forEach((v) => {
    var voice_volume_slider = document.getElementById("sld_" + v)
    volumes.push(voice_volume_slider.value / 100)
  })
  return volumes
}

function play_song(song) {
  var audioElements = getAudioElements(song.name)
  song_playing = {song_name: song.name, audioElements: audioElements}
  audioElements.forEach(x => x.play());
  var speed = get_playback_speed()
  audioElements.forEach(x => x.playbackRate = speed);
  var volumes = get_volumes()
  for (let i = 0; i < audioElements.length; i++) {
    var audioEl = audioElements[i];
    audioEl.volume = volumes[i]
  }
}

function playPause(song) {
  var song_name = song.name
  if (song_playing === undefined) {
    play_song(song)
  } else {
    if (song_playing.song_name !== song.name) {
      // switch song
      pauseAudio()
      play_song(song)
    } else {
      pauseAudio()
    }
  }
}

function pauseAudio() {
  if (song_playing === undefined) {
    return
  }
  song_playing.audioElements.forEach(x => x.pause());
  song_playing = undefined
}

function update_song_progress() {
  if (song_playing === undefined) {
    return
  }
  var song_progress = get_current_song_progress()
  var progress_bar = document.getElementById("pgb_" + song_playing.song_name)
  progress = (song_progress * 100) / song_playing.audioElements[0].duration
  if (Number.isFinite(progress)) {
    progress_bar.value = progress
  }
}

setInterval(update_song_progress, 200);
