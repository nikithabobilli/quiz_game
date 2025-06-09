let quizData = [];

function showCreateForm() {
  document.getElementById('createForm').classList.remove('hidden');
}

function generateQuestionFields() {
  const count = parseInt(document.getElementById('questionCount').value);
  const form = document.getElementById('questionForm');
  form.innerHTML = ''; // clear previous

  for (let i = 0; i < count; i++) {
    form.innerHTML += `
      <div><strong>Question ${i + 1}</strong><br>
      <input type="text" placeholder="Enter Question" name="q${i}" required><br>
      <input type="text" placeholder="Option A" name="q${i}o0"><br>
      <input type="text" placeholder="Option B" name="q${i}o1"><br>
      <input type="text" placeholder="Option C" name="q${i}o2"><br>
      <input type="text" placeholder="Option D" name="q${i}o3"><br>
      Correct Option (0-3): <input type="number" min="0" max="3" name="q${i}correct"><br><br></div>
    `;
  }
  form.innerHTML += `<button type="button" class="button-3d" onclick="saveQuiz()">Submit Quiz</button>`;
  form.classList.remove('hidden');
}

function saveQuiz() {
  const form = document.getElementById('questionForm');
  const formData = new FormData(form);
  const count = parseInt(document.getElementById('questionCount').value);
  quizData = [];

  for (let i = 0; i < count; i++) {
    const question = formData.get(`q${i}`);
    const options = [
      formData.get(`q${i}o0`),
      formData.get(`q${i}o1`),
      formData.get(`q${i}o2`),
      formData.get(`q${i}o3`)
    ];
    const correct = parseInt(formData.get(`q${i}correct`));
    quizData.push({ question, options, correct });
  }

  alert('Quiz saved successfully!');
  document.getElementById('attemptBtn').disabled = false;
  document.getElementById('createForm').classList.add('hidden');
  form.classList.add('hidden');
}

function startAttempt() {
  let index = 0;
  let score = 0;
  const quizDiv = document.getElementById('quizArea');
  const resultDiv = document.getElementById('result');
  quizDiv.classList.remove('hidden');
  resultDiv.classList.add('hidden');

  function showQuestion() {
    if (index >= quizData.length) {
      quizDiv.classList.add('hidden');
      resultDiv.innerHTML = `<h2>Your Score: ${score}/${quizData.length}</h2>`;
      resultDiv.classList.remove('hidden');
      return;
    }

    const q = quizData[index];
    quizDiv.innerHTML = `<h3>Q${index + 1}: ${q.question}</h3>`;
    q.options.forEach((opt, i) => {
      quizDiv.innerHTML += `
        <button class="button-3d" onclick="selectAnswer(${i})">${opt}</button><br><br>
      `;
    });

    let timer = 60;
    const timerEl = document.createElement("p");
    timerEl.innerHTML = `Time Left: ${timer} sec`;
    quizDiv.appendChild(timerEl);

    const countdown = setInterval(() => {
      timer--;
      timerEl.innerHTML = `Time Left: ${timer} sec`;
      if (timer === 0) {
        clearInterval(countdown);
        index++;
        showQuestion();
      }
    }, 1000);

    window.selectAnswer = (selected) => {
      clearInterval(countdown);
      if (selected === q.correct) score++;
      index++;
      showQuestion();
    };
  }

  showQuestion();
}