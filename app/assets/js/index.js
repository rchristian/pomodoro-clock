$(document).ready(function() {
    var audio = $("#tone")[0];
    var timer;

    var minutes;
    var minsPast = 0;
    var seconds = 0;

    var sessTime = 25;
    var smllBreakTime = 5;
    var longBreakTime = smllBreakTime + 5;
    var workCount = 0;

    var timePaused = true;
    var audioPlay = true;
    var sessionLoop = true;
    var isSession = true;
    var isLongBreak = false;

    $("#up-session").on("click", function() {
        if (timePaused === true) {
            sessTime++;
            $("#minutes").text(sessTime);
            $("#session-time").text(sessTime);
            seconds = seconds;
            minutes = sessTime;
        }
    });
    $("#down-session").on("click", function() {
        if (timePaused === true && sessTime > 1) {
            sessTime--;
            $("#minutes").text(sessTime);
            $("#session-time").text(sessTime);
            seconds = seconds;
            minutes = sessTime;
        }
    });
    $("#up-break").on("click", function() {
        if (timePaused === true) {
            smllBreakTime++;
            longBreakTime = smllBreakTime + 5;
            $("#break-time").text(smllBreakTime);
            seconds = seconds;
            minutes = smllBreakTime;
            if (isSession === false) {
                $("#minutes").text(smllBreakTime);
            }
        }
    });
    $("#down-break").on("click", function() {
        if (timePaused === true && smllBreakTime > 1) {
            smllBreakTime--;
            longBreakTime = smllBreakTime + 5;
            $("#break-time").text(smllBreakTime);
            seconds = seconds;
            minutes = smllBreakTime;
            if (isSession === false) {
                $("#minutes").text(smllBreakTime);
            }
        }
    });

    $("#start").on("click", function() {
        if (timePaused === true) {
            timePaused = false;
            playTimer();
            $("#start span").removeClass("glyphicon glyphicon-play").addClass("glyphicon glyphicon-pause");
            $("#start").prop("title", "Pause Timer");
        } else if (timePaused === false) {
            timePaused = true;
            clearInterval(timer);
            $("#start span").removeClass("glyphicon glyphicon-pause").addClass("glyphicon glyphicon-play-circle");
            $("#start").prop("title", "Start Timer");
        }
    });

    $("#reset").on("click", function() {
        if (timePaused === true) {
            resetTimer();
        }
    });

    $("#mute").on("click", function() {
        if (audioPlay === true) {
            audioPlay = false;
            $("#mute span").removeClass("glyphicon glyphicon-volume-up").addClass("glyphicon glyphicon-volume-off");
            $("#mute").prop("title", "Un-Mute Alarm");
        } else {
            audioPlay = true;
            $("#mute span").removeClass("glyphicon glyphicon-volume-off").addClass("glyphicon glyphicon-volume-up");
            $("#mute").prop("title", "Mute Alarm");
        }
    });

    $("#loop").on("click", function() {
        if (timePaused === true) {
            if (sessionLoop === true) {
                sessionLoop = false;
                $("#loop").prop("title", "Turn On Loop");
            } else {
                sessionLoop = true;
                $("#loop").prop("title", "Turn Off Loop");
            }
        }
    });

    function tonePlay() {
        if (audioPlay === true) {
            audio.play();
        }
    }

    function playTimer() {
        if (isSession === true) {
            startSess();
        } else if (isSession === false && isLongBreak === false) {
            startSmllBreak();
        } else if (isSession === false && isLongBreak === true) {
            startLongBreak();
        }
    }

    function updateTimer() {
        if (seconds < 10) {
            $("#seconds").text("0" + seconds);
        } else {
            $("#minutes").text(minutes);
            $("#seconds").text(seconds);
        }
    }

    function resetTimer() {
        clearInterval(timer);
        minsPast = 0;
        seconds = 0;
        $("#seconds").text("0" + seconds);
        if (isSession === true) {
            minutes = sessTime;
            $("#minutes").text(minutes);
        } else if (isSession === false && isLongBreak === false) {
            minutes = smllBreakTime;
            $("#minutes").text(minutes);
        } else if (isSession === false && isLongBreak === true) {
            minutes = longBreakTime;
            $("#minutes").text(minutes);
        }
    }

    function countDown(numMins, numSecs, endTimeFunction) {
        if (seconds <= 0) {
            seconds = 60;

            if (minutes <= 0) {
                minutes = 60;
            }
            minutes--;
            minsPast++;
        }
        if (seconds < 10 && seconds >= 10) {
            updateTimer();
        }
        seconds--;
        updateTimer();

        if (seconds === 0 & minutes === 0) {
            endTimeFunction();
        }
    }

    function startSess() {
        minutes = sessTime - minsPast;
        $("#session-head").css("font-weight", "400");
        timer = setInterval(function() {
            countDown(minutes, seconds, endSession);
        }, 1000);

    }

    function startSmllBreak() {
        minutes = smllBreakTime - minsPast;
        $("#break-head").css("font-weight", "400");
        timer = setInterval(function() {
            countDown(minutes, seconds, endBreaks);
        }, 1000);

    }

    function startLongBreak() {
        isLongBreak = true;
        minutes = longBreakTime - minsPast;
        $("#break-head").css("font-weight", "400");
        timer = setInterval(function() {
            countDown(minutes, seconds, endBreaks);
        }, 1000);

    }

    function endSession() {
        minsPast = 0;
        clearInterval(timer);
        if (isSession === true) {
            isSession = false;
            $("#session-head").removeAttr("style");
        }

        if (workCount === 3) {
            workCount = 0;
            startLongBreak();
        } else {
            workCount++;
            startSmllBreak();
        }
        tonePlay();
    }

    function endBreaks() {
        minsPast = 0;
        clearInterval(timer);
        if (sessionLoop === true) {
            isSession = true;
            $("#break-head").removeAttr("style");
            tonePlay();
            startSess();
        } else {
            tonePlay();
        }

        if (isLongBreak === true) {
            isLongBreak = false;
        }
    }

});
