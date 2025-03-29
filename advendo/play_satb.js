var song_playing = undefined
var last_displayed_song = undefined

const voices = ["Soprano", "Alto", "Tenor", "Bass"]

function refresh_all(song_name) {
  var all_checked = true
  var all_unchecked = true
  voices.forEach((voice) => {
    const cb_name = "cb_" + song_name + "-" + voice
    var checkBox = document.getElementById(cb_name);
    if (checkBox.checked) {
      all_unchecked = false
    } else {
      all_checked = false
    }
  })
  const all_cb_name = "cb_" + song_name + "-All"
  var all_cb = document.getElementById(all_cb_name);
  if (all_checked) {
    all_cb.checked = true
  }
  if (all_unchecked) {
    all_cb.checked = false
    pauseAudio()
  }
}

function get_check_box(song_name, voice) {
  const cb_name = "cb_" + song_name + "-" + voice
  return document.getElementById(cb_name);
}

function change_check_box(song_name, voice, new_state) {
  var checkBox = get_check_box(song_name, voice)
  checkBox.checked = new_state
  cb_change(song_name, voice)
}

function enable_all_voices(song_name) {
  voices.forEach((voice) => {
    change_check_box(song_name, voice, true)
  })
  const all_cb_name = "cb_" + song_name + "-All"
  var all_cb = document.getElementById(all_cb_name);
  all_cb.checked = true
}

function change_all(song_name) {
  const all_cb_name = "cb_" + song_name + "-All"
  var all_cb = document.getElementById(all_cb_name);
  voices.forEach((voice) => {
    change_check_box(song_name, voice, all_cb.checked)
  })
}

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

function cb_change(song_name, voice) {
  if (song_playing !== undefined && song_playing.song_name === song_name) {
    var song_progress = get_current_song_progress()
    var audioElement = document.getElementById(song_name + "-" + voice);
    const cb_name = "cb_" + song_name + "-" + voice
    var checkBox = document.getElementById(cb_name);
    if (checkBox.checked) {
      audioElement.currentTime = song_progress
      audioElement.play()
    } else {
      audioElement.currentTime = 0
      audioElement.pause()
    }
    song_playing = {song_name: song_name, audioElements: getSelectedAudio(song_name)}
  }
  refresh_all(song_name)
}

function getSelectedAudio(song_name) {
  var selectedElements = [];
  voices.forEach((voice) => {
    const cb_name = "cb_" + song_name + "-" + voice
    var checkBox = document.getElementById(cb_name);
    if (checkBox.checked) {
      var audioElement = document.getElementById(song_name + "-" + voice);
      selectedElements.push(audioElement);
    }
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

function play_song(song) {
  var selected_audio = getSelectedAudio(song.name)
  if (selected_audio.length === 0) {
    enable_all_voices(song.name)
    selected_audio = getSelectedAudio(song.name)
  }
  song_playing = {song_name: song.name, audioElements: getSelectedAudio(song.name)}
  song_playing.audioElements.forEach(x => x.play());
}

function playPause(song) {
  var song_name = song.name
  if (song_playing === undefined) {
    console.log("play")
    play_song(song)
  } else {
    if (song_playing.song_name !== song.name) {
      // switch song
      console.log("switch")
      pauseAudio()
      play_song(song)
    } else {
      console.log("pause")
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

function get_voice_parts(voice) {
  var parts = []
  songs.forEach((s) => {
    parts.push({ song: s.name, voice: voice })
  })
  return parts
}

function all_voice(voice) {
  var parts = []
  if (voice === "All") {
    voices.forEach((v) => {
      parts = parts.concat(get_voice_parts(v))
    })
  } else {
    parts = get_voice_parts(voice)
  }
  var all_checked = true
  parts.forEach((part) => {
    var cb = get_check_box(part.song, part.voice)
    if (!cb.checked) {
      all_checked = false
    }
  })
  parts.forEach((part) => {
    change_check_box(part.song, part.voice, !all_checked)
  })
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
