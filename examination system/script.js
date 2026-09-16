/* ================================================================
   1. DATA & INITIAL STATE
   ================================================================ */
var defaultAccounts = [
  { username: "hazem", password: "hazem" },
  { username: "kerolos", password: "kerolos" },
  { username: "ismail", password: "ismail" }
];

var exams = [
  {
    id: "math", name: "Math Fundamentals", duration: 240,
    questions: [
      { text: "What is 8 × 7?", choices: ["54", "56", "58", "60"], correctIndex: 1 },
      { text: "What is 25% of 200?", choices: ["20", "35", "40", "45"], correctIndex: 2 },
      { text: "What is the value of 9 + (6 × 2)?", choices: ["30", "21", "33", "24"], correctIndex: 1 },
      { text: "What is the perimeter of a square with side 5?", choices: ["15", "20", "25", "30"], correctIndex: 1 },
      { text: "What is 45 ÷ 9?", choices: ["4", "5", "6", "7"], correctIndex: 1 }
    ]
  },
  {
    id: "programming", name: "Programming Basics", duration: 300,
    questions: [
      { text: "Which keyword declares a constant in JavaScript?", choices: ["let", "const", "var", "static"], correctIndex: 1 },
      { text: "What does HTML stand for?", choices: ["Hyper Text Markup Language", "High Tech Media Language", "Hyperlink Test Markup Language", "Hyper Tool Multi Layout"], correctIndex: 0 },
      { text: "Which symbol is used for comments in JavaScript?", choices: ["//", "<!--", "##", "**"], correctIndex: 0 },
      { text: "Which of these is NOT a programming language?", choices: ["Python", "Ruby", "HTML", "Java"], correctIndex: 2 },
      { text: "Which method is used to print output in JavaScript?", choices: ["console.print()", "console.log()", "print()", "debug()"], correctIndex: 1 }
    ]
  },
  {
    id: "history", name: "World History", duration: 360,
    questions: [
      { text: "Which ancient civilization built the pyramids?", choices: ["Greeks", "Romans", "Egyptians", "Mayans"], correctIndex: 2 },
      { text: "Who was the first person to walk on the moon?", choices: ["Yuri Gagarin", "Neil Armstrong", "Buzz Aldrin", "Michael Collins"], correctIndex: 1 },
      { text: "The Renaissance began in which country?", choices: ["France", "Italy", "Spain", "England"], correctIndex: 1 },
      { text: "Which empire was ruled by Genghis Khan?", choices: ["Ottoman", "Roman", "Mongol", "Persian"], correctIndex: 2 },
      { text: "What year did World War II end?", choices: ["1943", "1944", "1945", "1946"], correctIndex: 2 }
    ]
  }
];

var state = {
  user: null,
  currentExam: null,
  currentQuestionIndex: 0,
  answers: {},
  markedQuestions: new Set(),
  timerId: null,
  timeLeft: 0,
  authMode: "login",
  accounts: []
};

/* ================================================================
   2. DOM & UTILS HELPERS
   ================================================================ */
function $(id) {
  return document.getElementById(id);
}

function showScreen(screenId) {
  var screens = document.querySelectorAll(".screen");
  for (var i = 0; i < screens.length; i++) {
    screens[i].classList.remove("active");
  }
  if ($(screenId)) $(screenId).classList.add("active");
  if ($("topBar")) {
    $("topBar").style.display = (screenId === "loginScreen") ? "none" : "flex";
  }
}

function getStoredAccounts() {
  try {
    var raw = localStorage.getItem("examAccounts");
    return raw ? JSON.parse(raw) : defaultAccounts.slice();
  } catch (e) {
    return defaultAccounts.slice();
  }
}

function findAccount(username) {
  for (var i = 0; i < state.accounts.length; i++) {
    if (state.accounts[i].username === username) return state.accounts[i];
  }
  return null;
}

function setLoginError(msg) {
  if ($("loginError")) $("loginError").textContent = msg;
}

function setAuthState(mode) {
  state.authMode = mode;
  var isSignup = (mode === "signup");

  if ($("authTitle")) $("authTitle").textContent = isSignup ? "Sign Up" : "Sign In";
  if ($("authSub")) $("authSub").textContent = isSignup ? "Create a new account to start exams" : "Enter your username and password";
  if ($("authSubmitBtn")) $("authSubmitBtn").textContent = isSignup ? "Sign Up" : "Sign In";
  if ($("authToggleBtn")) $("authToggleBtn").textContent = isSignup ? "Already have an account? Sign in" : "Create account";

  var signupElems = document.querySelectorAll(".auth-signup-only");
  for (var i = 0; i < signupElems.length; i++) {
    signupElems[i].classList.toggle("hidden", !isSignup);
  }

  setLoginError("");
  if ($("loginUsername")) $("loginUsername").value = "";
  if ($("loginPassword")) $("loginPassword").value = "";
  if ($("registerConfirmPassword")) $("registerConfirmPassword").value = "";
}

/* ================================================================
   3. AUTHENTICATION & EXAMS DISPLAY
   ================================================================ */
function handleAuthSubmit(e) {
  e.preventDefault();
  var u = $("loginUsername") ? $("loginUsername").value.trim().toLowerCase() : "";
  var p = $("loginPassword") ? $("loginPassword").value.trim() : "";

  if (!u || !p) return setLoginError("Please enter both username and password.");

  if (state.authMode === "signup") {
    var cp = $("registerConfirmPassword") ? $("registerConfirmPassword").value.trim() : "";
    if (!cp) return setLoginError("Please confirm your password.");
    if (p !== cp) return setLoginError("Passwords do not match.");
    if (findAccount(u)) return setLoginError("This username is already taken.");
    if (u.length < 3) return setLoginError("Username must be at least 3 characters.");
    if (p.length < 3) return setLoginError("Password must be at least 3 characters.");

    state.accounts.push({ username: u, password: p });
    localStorage.setItem("examAccounts", JSON.stringify(state.accounts));
  } else {
    var acc = findAccount(u);
    if (!acc || acc.password !== p) {
      return setLoginError("Invalid credentials. Try hazem, kerolos, or ismail, or register a new account.");
    }
  }

  loginUser(u);
}

function loginUser(username) {
  state.user = username;
  state.currentExam = null;
  state.currentQuestionIndex = 0;
  state.answers = {};
  state.markedQuestions.clear();
  state.timeLeft = 0;

  if ($("examsGreeting")) $("examsGreeting").textContent = "Hello " + username + ", pick an exam to start:";
  showExamList();
}

function showExamList() {
  renderExamList();
  showScreen("examsScreen");
}

function renderExamList() {
  if (!$("examList")) return;
  $("examList").innerHTML = "";

  for (var i = 0; i < exams.length; i++) {
    var exam = exams[i];
    var card = document.createElement("article");
    card.className = "exam-card-item";

    var min = Math.round(exam.duration / 60);
    card.innerHTML = 
      '<div>' +
        '<h3>' + exam.name + '</h3>' +
        '<span>' + exam.questions.length + ' questions • ' + min + ' min</span>' +
      '</div>' +
      '<button class="exam-start-btn" type="button">Start Exam</button>';

    (function(id) {
      card.querySelector("button").onclick = function() { startExam(id); };
    })(exam.id);

    $("examList").appendChild(card);
  }
}

/* ================================================================
   4. EXAM ENGINE & TIMER LOGIC
   ================================================================ */
function startExam(examId) {
  for (var i = 0; i < exams.length; i++) {
    if (exams[i].id === examId) {
      state.currentExam = exams[i];
      break;
    }
  }
  if (!state.currentExam) return;

  state.currentQuestionIndex = 0;
  state.answers = {};
  state.markedQuestions.clear();
  state.timeLeft = state.currentExam.duration;

  renderCurrentQuestion();
  updateTimerUI();
  startTimer();
  showScreen("examScreen");
}

function startTimer() {
  clearTimer();
  if ($("timerFill")) $("timerFill").className = "timer-fill";
  updateTimerUI();

  state.timerId = setInterval(function() {
    state.timeLeft--;
    if (state.timeLeft <= 0) {
      clearTimer();
      state.timeLeft = 0;
      updateTimerUI();
      handleTimeout();
      return;
    }
    updateTimerUI();
  }, 1000);
}

function clearTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function updateTimerUI() {
  if (!state.currentExam) return;

  var minutes = Math.floor(state.timeLeft / 60);
  var seconds = state.timeLeft % 60;
  var secStr = seconds < 10 ? "0" + seconds : seconds;

  if ($("timerLabel")) {
    $("timerLabel").textContent = "Time left: " + minutes + ":" + secStr;
  }

  if ($("timerFill")) {
    var percent = Math.max(0, Math.min(100, Math.round((state.timeLeft / state.currentExam.duration) * 100)));
    $("timerFill").style.width = percent + "%";

    var isWarn = state.timeLeft <= state.currentExam.duration * 0.3 && state.timeLeft > state.currentExam.duration * 0.15;
    var isDanger = state.timeLeft <= state.currentExam.duration * 0.15;

    $("timerFill").classList.toggle("warning", isWarn);
    $("timerFill").classList.toggle("danger", isDanger);
  }
}

/* ================================================================
   5. QUESTIONS & MARKING SYSTEM
   ================================================================ */
function renderCurrentQuestion() {
  if (!state.currentExam) return;

  var question = state.currentExam.questions[state.currentQuestionIndex];
  var total = state.currentExam.questions.length;

  if ($("questionCount")) $("questionCount").textContent = "Question " + (state.currentQuestionIndex + 1) + " of " + total;
  if ($("questionText")) $("questionText").textContent = question.text;
  if ($("qNumberBadge")) $("qNumberBadge").textContent = state.currentQuestionIndex + 1;

  renderChoices(question);

  if ($("prevBtn")) $("prevBtn").disabled = (state.currentQuestionIndex === 0);
  if ($("nextBtn")) $("nextBtn").disabled = (state.currentQuestionIndex === total - 1);

  var isMarked = state.markedQuestions.has(state.currentQuestionIndex);
  if ($("markBtn")) {
    $("markBtn").textContent = isMarked ? "Unmark" : "Mark";
    $("markBtn").classList.toggle("marked", isMarked);
  }

  updateMarkedPanel();
}

function renderChoices(question) {
  if (!$("questionBody")) return;
  $("questionBody").innerHTML = "";

  for (var i = 0; i < question.choices.length; i++) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "exam-choice" + (state.answers[state.currentQuestionIndex] === i ? " selected" : "");

    btn.innerHTML = '<span>' + question.choices[i] + '</span><span class="exam-choice-box"></span>';

    (function(choiceIndex) {
      btn.onclick = function() {
        state.answers[state.currentQuestionIndex] = choiceIndex;
        renderCurrentQuestion();
      };
    })(i);

    $("questionBody").appendChild(btn);
  }
}

function toggleMarkQuestion() {
  if (state.markedQuestions.has(state.currentQuestionIndex)) {
    state.markedQuestions.delete(state.currentQuestionIndex);
  } else {
    state.markedQuestions.add(state.currentQuestionIndex);
  }
  renderCurrentQuestion();
}

function updateMarkedPanel() {
  if (!$("markPanelList")) return;

  if (state.markedQuestions.size === 0) {
    $("markPanelList").innerHTML = '<p class="exam-mark-empty">No marked questions yet.</p>';
    return;
  }

  $("markPanelList").innerHTML = "";
  var sorted = Array.from(state.markedQuestions).sort(function(a, b) { return a - b; });

  for (var i = 0; i < sorted.length; i++) {
    var qIndex = sorted[i];
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "exam-mark-item";
    btn.textContent = "Question " + (qIndex + 1);

    (function(idx) {
      btn.onclick = function() {
        state.currentQuestionIndex = idx;
        renderCurrentQuestion();
      };
    })(qIndex);

    $("markPanelList").appendChild(btn);
  }
}

/* ================================================================
   6. CALCULATIONS, HISTORY & LEADERBOARD
   ================================================================ */
function calculateScore() {
  var total = state.currentExam.questions.length;
  var correct = 0;

  for (var i = 0; i < total; i++) {
    if (state.answers[i] === state.currentExam.questions[i].correctIndex) {
      correct++;
    }
  }

  var percent = total ? (correct / total) * 100 : 0;
  return { total: total, correct: correct, percent: percent };
}

function loadHistoryForUser(username) {
  try {
    var raw = localStorage.getItem("examHistory_" + username);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveHistory(result, timedOut) {
  if (!state.user) return;
  var history = loadHistoryForUser(state.user);

  history.unshift({
    exam: state.currentExam.name,
    date: new Date().toLocaleString(),
    score: result.correct,
    total: result.total,
    percent: Math.round(result.percent),
    timedOut: !!timedOut
  });

  localStorage.setItem("examHistory_" + state.user, JSON.stringify(history.slice(0, 30)));
}

function showHistory() {
  var history = state.user ? loadHistoryForUser(state.user) : [];
  if ($("historyList")) {
    if (history.length === 0) {
      $("historyList").innerHTML = '<p class="res-empty">No history found yet.</p>';
    } else {
      var html = "";
      for (var i = 0; i < history.length; i++) {
        var item = history[i];
        html += '<div class="res-history-item">' +
                  '<div><h4>' + item.exam + '</h4><span>' + item.date + '</span></div>' +
                  '<div class="res-history-score">' + item.score + '/' + item.total + '</div>' +
                '</div>';
      }
      $("historyList").innerHTML = html;
    }
  }
  showScreen("historyScreen");
}

function handleTimeout() {
  var result = calculateScore();
  saveHistory(result, true);

  if ($("timeoutContent")) {
    $("timeoutContent").innerHTML = 
      '<div class="res-score-box">' +
        '<div class="big">' + result.correct + '/' + result.total + '</div>' +
        '<div class="small">Your answers were saved to history.</div>' +
      '</div>';
  }
  showScreen("timeoutScreen");
}

function handleSubmitExam() {
  clearTimer();
  var result = calculateScore();
  saveHistory(result, false);

  if ($("gradeExamName")) $("gradeExamName").textContent = state.currentExam.name;
  if ($("gradeTitle")) $("gradeTitle").textContent = (result.percent >= 70) ? "Well done!" : "Good effort";

  var statusStr = (result.percent >= 70) ? "Passed" : "Review required";
  var html = 
    '<div class="res-score-box">' +
      '<div class="big">' + result.correct + '/' + result.total + '</div>' +
      '<div class="small">' + Math.round(result.percent) + '% correct</div>' +
    '</div>' +
    '<div class="res-rank-row"><span>Exam</span><strong>' + state.currentExam.name + '</strong></div>' +
    '<div class="res-rank-row"><span>Status</span><strong>' + statusStr + '</strong></div>';

  if (result.percent < 70) {
    html += '<div class="res-warn-banner">Keep practicing and try again to improve your score.</div>';
  }

  if ($("gradeContent")) $("gradeContent").innerHTML = html;
  showScreen("gradeScreen");
}

function showLeaderboard() {
  var board = [];
  for (var i = 0; i < state.accounts.length; i++) {
    var acc = state.accounts[i];
    var h = loadHistoryForUser(acc.username);

    var bestPercent = 0;
    var bestExam = "—";

    for (var j = 0; j < h.length; j++) {
      if (h[j].percent > bestPercent) {
        bestPercent = h[j].percent;
        bestExam = h[j].exam;
      }
    }

    board.push({ username: acc.username, top: bestPercent, lastExam: bestExam });
  }

  board.sort(function(a, b) { return b.top - a.top; });

  if ($("leaderboardList")) {
    var hasData = board.some(function(row) { return row.top > 0; });
    if (!hasData) {
      $("leaderboardList").innerHTML = '<p class="res-empty">No leaderboard data available yet.</p>';
    } else {
      var rowsHtml = "";
      for (var k = 0; k < board.length; k++) {
        rowsHtml += '<tr><td>' + board[k].username + '</td><td>' + board[k].top + '%</td><td>' + board[k].lastExam + '</td></tr>';
      }
      $("leaderboardList").innerHTML = 
        '<table class="leaderboard-table">' +
          '<thead><tr><th>User</th><th>Best Score</th><th>Top Exam</th></tr></thead>' +
          '<tbody>' + rowsHtml + '</tbody>' +
        '</table>';
    }
  }

  showScreen("leaderboardScreen");
}

function handleSwitchUser() {
  clearTimer();
  state.user = null;
  state.currentExam = null;
  state.answers = {};
  state.markedQuestions.clear();
  state.timeLeft = 0;

  setAuthState("login");
  showScreen("loginScreen");
}

/* ================================================================
   7. APP INITIALIZATION
   ================================================================ */
function init() {
  if ($("loginForm")) $("loginForm").addEventListener("submit", handleAuthSubmit);
  if ($("authToggleBtn")) {
    $("authToggleBtn").addEventListener("click", function() {
      setAuthState(state.authMode === "login" ? "signup" : "login");
    });
  }
  if ($("switchUserBtn")) $("switchUserBtn").addEventListener("click", handleSwitchUser);
  if ($("leaderboardBtn")) $("leaderboardBtn").addEventListener("click", showLeaderboard);

  if ($("prevBtn")) {
    $("prevBtn").addEventListener("click", function() {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        renderCurrentQuestion();
      }
    });
  }

  if ($("nextBtn")) {
    $("nextBtn").addEventListener("click", function() {
      if (state.currentQuestionIndex < state.currentExam.questions.length - 1) {
        state.currentQuestionIndex++;
        renderCurrentQuestion();
      }
    });
  }

  if ($("submitExamBtn")) $("submitExamBtn").addEventListener("click", handleSubmitExam);
  if ($("markBtn")) $("markBtn").addEventListener("click", toggleMarkQuestion);
  if ($("gradeHistoryBtn")) $("gradeHistoryBtn").addEventListener("click", showHistory);
  if ($("timeoutHistoryBtn")) $("timeoutHistoryBtn").addEventListener("click", showHistory);
  if ($("historyBackBtn")) $("historyBackBtn").addEventListener("click", showExamList);
  if ($("leaderboardBackBtn")) $("leaderboardBackBtn").addEventListener("click", showExamList);

  state.accounts = getStoredAccounts();
  setAuthState("login");
  showScreen("loginScreen");
}

window.addEventListener("DOMContentLoaded", init);