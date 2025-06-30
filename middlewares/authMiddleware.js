// ✅ Verifica se o usuário está logado pela sessão
fetch('/auth/status', { credentials: 'include' })
  .then(res => res.json())
  .then(data => {
    if (!data.loggedIn) {
      alert('Você precisa estar logado para acessar a agenda.');
      window.location.href = '/login';
    } else {
      fetchAndRenderEvents();
    }
  });

// ✅ Envia novo evento
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
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    if (res.ok) {
      showPopup();
      document.getElementById('eventForm').reset();
      fetchAndRenderEvents(); // atualiza
    } else {
      showPopupError(json.error || 'Erro ao salvar');
    }
  } catch (err) {
    showPopupError('Erro de conexão com o servidor.');
  }
});

// ✅ Buscar e renderizar eventos
function fetchAndRenderEvents() {
  fetch('/events', {
    method: 'GET',
    credentials: 'include'
  })
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
            <p>Data: ${new Date(event.date).toLocaleString()}</p>
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

// ✅ Deletar evento
function deleteEvent(id) {
  if (!confirm('Tem certeza que deseja excluir este evento?')) return;

  fetch(`/events/${id}`, {
    method: 'DELETE',
    credentials: 'include'
  })
    .then(res => res.json())
    .then(data => {
      if (data.deleted === 1) {
        alert('Evento excluído com sucesso!');
        fetchAndRenderEvents();
      } else {
        alert('Erro ao excluir evento.');
      }
    })
    .catch(err => alert('Erro ao excluir: ' + err.message));
}

// ✅ Editar evento
function editEvent(id, oldTitle, oldDate) {
  const title = prompt('Novo título do evento:', oldTitle);
  if (!title) return;

  const date = prompt('Nova data/hora (ex: 2025-06-30T10:00):', oldDate);
  if (!date) return;

  fetch(`/events/${id}`, {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title, date })
  })
    .then(res => res.json())
    .then(data => {
      if (data.modified === 1) {
        alert('Evento editado com sucesso!');
        fetchAndRenderEvents();
      } else {
        alert('Erro ao editar evento.');
      }
    })
    .catch(err => alert('Erro ao editar: ' + err.message));
}

// ✅ Popup
function showPopup() {
  const overlay = document.getElementById('popupOverlay');
  overlay.classList.remove('hidden');
  setTimeout(() => overlay.classList.add('hidden'), 4000);
}

function showPopupError(message) {
  const popup = document.querySelector('#popupOverlay .popup');
  popup.querySelector('h2').textContent = 'Erro ao salvar';
  popup.querySelector('p').textContent = message;
  document.getElementById('popupOverlay').classList.remove('hidden');
}

function closePopup() {
  document.getElementById('popupOverlay').classList.add('hidden');
}
