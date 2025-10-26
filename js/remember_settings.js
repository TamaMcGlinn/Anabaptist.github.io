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

document.addEventListener("voice_volume_change", (e) => {
  voices.forEach((v) => {
    var voice_volume_slider = document.getElementById("sld_" + v)
    setCookie(v + "_volume", voice_volume_slider.value)
  })
})

document.addEventListener("speed_change", (e) => {
  setCookie("speed", get_playback_speed())
})

function readSettingsFromCookies() {
  voices.forEach((v) => {
    var voice_volume_slider = document.getElementById("sld_" + v)
    voice_volume_slider.value = getCookie(v + "_volume")
  })
  var speed_slider = document.getElementById("sld_speed")
  speed_slider.value = getCookie("speed") * 100
  speed_slider_change()
}

document.addEventListener("DOMContentLoaded", function() {
    readSettingsFromCookies();
});
