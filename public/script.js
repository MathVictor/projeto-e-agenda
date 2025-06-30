document.getElementById('eventForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const data = {
    title: document.getElementById('title').value,
    date: document.getElementById('date').value
  };

  try {
    const res = await fetch('/events', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (res.ok) {
      showPopup();
      document.getElementById('eventForm').reset();
      fetchAndRenderEvents();
    } else {
      showPopupError(json.error || 'Erro ao salvar');
    }
  } catch (err) {
    showPopupError('Erro de conexão com o servidor.');
  }
});

document.getElementById('searchBtn').addEventListener('click', () => {
  fetchAndRenderEvents();
});

function fetchAndRenderEvents() {
  fetch('/events', { credentials: 'include' })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('eventList');
      list.innerHTML = '';

      if (!data || data.length === 0) {
        list.innerHTML = `<p style="color:#aaa;">Nenhum compromisso encontrado.</p>`;
      } else {
        data.forEach(event => {
          const card = document.createElement('div');
          card.classList.add('event-card');
          card.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Data:</strong> ${new Date(event.date).toLocaleString()}</p>
            <div class="card-actions">
              <button onclick="editEvent('${event._id}', '${event.title}', '${event.date}')">✏️ Editar</button>
              <button onclick="deleteEvent('${event._id}')">🗑️ Excluir</button>
            </div>
          `;
          list.appendChild(card);
        });
      }

      list.classList.remove('hidden');
    })
    .catch(err => {
      console.error('Erro ao buscar eventos:', err);
    });
}

async function editEvent(id, currentTitle, currentDate) {
  const newTitle = prompt("Novo título:", currentTitle);
  if (!newTitle) return;

  const newDate = prompt("Nova data (aaaa-mm-ddTHH:MM):", currentDate);
  if (!newDate) return;

  try {
    const res = await fetch(`/events/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, date: newDate })
    });

    if (res.ok) {
      alert('Evento atualizado.');
      fetchAndRenderEvents();
    } else {
      alert('Erro ao atualizar evento.');
    }
  } catch (err) {
    alert('Falha ao editar evento.');
  }
}

async function deleteEvent(id) {
  if (!confirm('Tem certeza que deseja excluir este evento?')) return;

  try {
    const res = await fetch(`/events/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (res.ok) {
      alert('Evento excluído.');
      fetchAndRenderEvents();
    } else {
      alert('Erro ao excluir.');
    }
  } catch (err) {
    alert('Erro na exclusão.');
  }
}

function showPopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 3000);
}

function closePopup() {
  document.getElementById('popupOverlay').classList.add('hidden');
}

function showPopupError(message) {
  const popup = document.querySelector('#popupOverlay .popup');
  popup.querySelector('h2').textContent = 'Erro';
  popup.querySelector('p').textContent = message;
  document.getElementById('popupOverlay').classList.remove('hidden');
}
