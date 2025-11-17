function setCookie(cname, cvalue) {
  const d = new Date();
  const expire_days = 600;
  d.setTime(d.getTime() + (expire_days*24*60*60*1000));
  let expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

document.addEventListener("speed_change", (e) => {
  var speed = get_playback_speed()
  setCookie("speed", speed)
})

document.addEventListener("voice_volume_change", (e) => {
  if (song_playing === undefined) {
    return
  }
  var voice = e.detail
  var index = voices.indexOf(voice);
  var slider = document.getElementById("sld_" + voice);
  setCookie(voice + "_volume", slider.value)
});

function readSettingsFromCookies() {
  voices.forEach((v) => {
    var voice_volume_slider = document.getElementById("sld_" + v)
    voice_volume_slider.value = getCookie(v + "_volume")
    slider_change(v)
  })
  var speed_slider = document.getElementById("sld_speed")
  var stored_speed = getCookie("speed")
  if (stored_speed === "") {
    stored_speed = 1;
  }
  speed_slider.value = stored_speed * 100
  speed_slider_change()
}

document.addEventListener("DOMContentLoaded", function() {
  readSettingsFromCookies()
});
