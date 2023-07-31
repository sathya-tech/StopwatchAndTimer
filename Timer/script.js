var timerInterval;
var startTime;
var endTime;
var remainingTime;
var isRunning = false;
var editedTimerIndex;

function startTimer() {
  if (!isRunning) {
    var hours =
      parseInt(document.getElementById("hoursInput").value) || 0;
    var minutes =
      parseInt(document.getElementById("minutesInput").value) || 0;
    var seconds =
      parseInt(document.getElementById("secondsInput").value) || 0;

    endTime =
      Date.now() + hours * 3600000 + minutes * 60000 + seconds * 1000;
    remainingTime = endTime - Date.now();
    timerInterval = setInterval(updateTimer, 10);

    document.getElementById("startBtn").disabled = true;
    document.getElementById("stopBtn").disabled = false;
    document.getElementById("resetBtn").disabled = false;
    isRunning = true;
  }
}

function updateTimer() {
  remainingTime = endTime - Date.now();

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    document.getElementById("timer").innerHTML = "00:00:00";
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("resetBtn").disabled = true;
    isRunning = false;
    playNotificationSound();
    return;
  }

  var hours = Math.floor(remainingTime / 3600000);
  var minutes = Math.floor((remainingTime % 3600000) / 60000);
  var seconds = Math.floor((remainingTime % 60000) / 1000);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timer").innerHTML =
    hours + ":" + minutes + ":" + seconds;
}

function stopTimer() {
  clearInterval(timerInterval);
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
  isRunning = false;
}

function resetTimer() {
  clearInterval(timerInterval);
  document.getElementById("timer").innerHTML = "00:00:00";
  document.getElementById("startBtn").disabled = false;
  document.getElementById("stopBtn").disabled = true;
  document.getElementById("resetBtn").disabled = true;
  isRunning = false;
}

function playNotificationSound() {
  var notificationSound = document.getElementById("notificationSound");
  setTimeout(function () {
    notificationSound.play();
  }, 0);
}

function addTimerPage() {
  window.location.href = "addTimer.html";
}

function displayTimers() {
  var timerListContainer = document.getElementById("timerList");
  timerListContainer.innerHTML = "";

  var timers = JSON.parse(localStorage.getItem("timers")) || [];
  timers.forEach(function (timer, index) {
    var listItem = document.createElement("div");
    var label = timer.label || "Timer " + (index + 1);
    var duration = timer.duration || 0;

    listItem.innerHTML = `
        <button onclick="startSavedTimer(${duration})">${label}</button>
        <button onclick="editTimer(${index})">Edit</button>
        <button onclick="deleteTimer(${index})">Delete</button>
      `;

    timerListContainer.appendChild(listItem);
  });
}

function startSavedTimer(duration) {
  var currentTime = Date.now();
  var endTime = currentTime + duration;

  clearInterval(timerInterval);
  updateSavedTimer(endTime);

  timerInterval = setInterval(function () {
    currentTime = Date.now();
    remainingTime = endTime - currentTime;
    updateTimerDisplay(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(timerInterval);
      playNotificationSound();
    }
  }, 10);
}

function updateSavedTimer(endTime) {
  var currentTime = Date.now();
  remainingTime = endTime - currentTime;
  updateTimerDisplay(remainingTime);

  if (remainingTime <= 0) {
    clearInterval(timerInterval);
    playNotificationSound();
  }
}

function updateTimerDisplay(remainingTime) {
  var hours = Math.floor(remainingTime / 3600000);
  var minutes = Math.floor((remainingTime % 3600000) / 60000);
  var seconds = Math.floor((remainingTime % 60000) / 1000);

  hours = hours < 10 ? "0" + hours : hours;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  document.getElementById("timer").innerHTML =
    hours + ":" + minutes + ":" + seconds;
}

function editTimer(index) {
  var timers = JSON.parse(localStorage.getItem("timers")) || [];
  var timer = timers[index];
  var editTimerContainer = document.getElementById("editTimerContainer");

  document.getElementById("editLabelInput").value = timer.label;
  document.getElementById("editHoursInput").value = Math.floor(
    timer.duration / 3600000
  );
  document.getElementById("editMinutesInput").value = Math.floor(
    (timer.duration % 3600000) / 60000
  );
  document.getElementById("editSecondsInput").value = Math.floor(
    (timer.duration % 60000) / 1000
  );

  editTimerContainer.style.display = "block";
  editedTimerIndex = index;
}

function saveEditedTimer(event) {
  event.preventDefault();

  var timers = JSON.parse(localStorage.getItem("timers")) || [];
  var editedTimer = timers[editedTimerIndex];

  editedTimer.label = document.getElementById("editLabelInput").value;
  editedTimer.duration =
    parseInt(document.getElementById("editHoursInput").value) * 3600000 +
    parseInt(document.getElementById("editMinutesInput").value) * 60000 +
    parseInt(document.getElementById("editSecondsInput").value) * 1000;

  localStorage.setItem("timers", JSON.stringify(timers));
  displayTimers();
  hideEditTimerForm();
}

function hideEditTimerForm() {
  var editTimerContainer = document.getElementById("editTimerContainer");
  editTimerContainer.style.display = "none";
}

function deleteTimer(index) {
  var timers = JSON.parse(localStorage.getItem("timers")) || [];
  timers.splice(index, 1);
  localStorage.setItem("timers", JSON.stringify(timers));
  displayTimers();
}

displayTimers();