function saveTimer(event) {
    event.preventDefault();

    var label = document.getElementById("labelInput").value;
    var hours = parseInt(document.getElementById("hoursInput").value) || 0;
    var minutes = parseInt(document.getElementById("minutesInput").value) || 0;
    var seconds = parseInt(document.getElementById("secondsInput").value) || 0;
    var duration = hours * 3600000 + minutes * 60000 + seconds * 1000;

    var timers = JSON.parse(localStorage.getItem("timers")) || [];
    timers.push({ label: label, duration: duration });
    localStorage.setItem("timers", JSON.stringify(timers));

    window.location.href = "index.html";
  }