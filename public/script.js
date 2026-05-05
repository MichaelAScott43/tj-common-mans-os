(() => {
  const path = window.location.pathname;
  if (path === '/chat') {
    const chatWindow = document.getElementById('chatWindow');
    const input = document.getElementById('chatInput');
    const sendBtn = document.getElementById('sendBtn');
    const persona = document.getElementById('persona');
    const voices = {
      TJ: (m) => `TJ: Focus. Next best step for "${m}" is to pick one 20-minute action and start now.`,
      Arlane: (m) => `Arlane: You're not behind. For "${m}", begin gently with one small task and breathe.`
    };
    const addMsg = (text, cls) => { const d = document.createElement('div'); d.className = `msg ${cls}`; d.textContent = text; chatWindow.appendChild(d); chatWindow.scrollTop = chatWindow.scrollHeight; };
    sendBtn.addEventListener('click', () => {
      const text = input.value.trim(); if (!text) return;
      addMsg(text, 'me');
      setTimeout(() => addMsg(voices[persona.value](text), 'bot'), 300);
      input.value = '';
    });
  }
  if (path === '/resume') {
    const fields = ['name', 'experience', 'skills'];
    const preview = document.getElementById('resumePreview');
    const render = () => {
      preview.innerHTML = `<h2>${document.getElementById('name').value || 'Your Name'}</h2><h4>Experience</h4><p>${document.getElementById('experience').value || 'Your experience will appear here.'}</p><h4>Skills</h4><p>${document.getElementById('skills').value || 'Your skills will appear here.'}</p>`;
    };
    fields.forEach((id) => document.getElementById(id).addEventListener('input', render));
    render();
  }
})();
