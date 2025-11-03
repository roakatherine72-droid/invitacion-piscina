// Datos de ejemplo (en una aplicación real, estos datos vendrían de una base de datos)
let guests = [
    { name: "Ana García", email: "ana@ejemplo.com", status: "confirmed", guests: 1, message: "¡No me lo perdería por nada!" },
    { name: "Carlos López", email: "carlos@ejemplo.com", status: "confirmed", guests: 2, message: "" },
    { name: "María Rodríguez", email: "maria@ejemplo.com", status: "declined", guests: 0, message: "Lamentablemente tengo un viaje programado" }
];

// Contraseña para acceder a la lista
const ADMIN_PASSWORD = "cumple40";

// Referencias a elementos del DOM
const confirmationForm = document.getElementById('confirmation-form');
const confirmationMessage = document.getElementById('confirmation-message');
const adminPasswordInput = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const guestList = document.getElementById('guest-list');
const notification = document.getElementById('notification');
const notificationDetails = document.getElementById('notification-details');

// Mostrar notificación
function showNotification(guestName, status, guestsCount) {
    let message = `${guestName} - ${status === 'confirmed' ? 'Asistirá' : 'No asistirá'}`;
    if (status === 'confirmed' && guestsCount > 0) {
        message += ` (+${guestsCount} acompañante${guestsCount > 1 ? 's' : ''})`;
    }
    notificationDetails.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// Manejar el envío del formulario de confirmación
confirmationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const attendance = document.getElementById('attendance').value;
    const guestsCount = document.getElementById('guests').value;
    const message = document.getElementById('message').value;
    
    // Validar que no se exceda el límite de acompañantes
    if (attendance === 'confirmed' && parseInt(guestsCount) > 3) {
        alert('Por favor, si necesitas traer más de 3 acompañantes, contáctame directamente.');
        return;
    }
    
    // Añadir el nuevo invitado a la lista
    guests.push({
        name: name,
        email: email,
        status: attendance,
        guests: parseInt(guestsCount),
        message: message
    });
    
    // Mostrar notificación para la cumpleañera
    showNotification(name, attendance, parseInt(guestsCount));
    
    // Mostrar mensaje de confirmación al invitado
    confirmationMessage.style.display = 'block';
    
    // Limpiar el formulario
    confirmationForm.reset();
    
    // Desplazarse hacia arriba para mostrar el mensaje de agradecimiento
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Manejar el acceso a la lista de invitados
adminLoginBtn.addEventListener('click', function() {
    if (adminPasswordInput.value === ADMIN_PASSWORD) {
        // Mostrar la lista de invitados
        guestList.style.display = 'block';
        renderGuestList();
        adminPasswordInput.value = '';
    } else {
        alert('Contraseña incorrecta. Solo la cumpleañera puede ver la lista.');
    }
});

// Función para renderizar la lista de invitados
function renderGuestList() {
    guestList.innerHTML = '';
    
    if (guests.length === 0) {
        guestList.innerHTML = '<p>No hay confirmaciones aún.</p>';
        return;
    }
    
    // Contadores
    let confirmedCount = 0;
    let totalGuests = 0;
    
    guests.forEach(guest => {
        if (guest.status === 'confirmed') {
            confirmedCount++;
            totalGuests += 1 + guest.guests;
        }
        
        const guestItem = document.createElement('div');
        guestItem.className = 'guest-item';
        
        const guestInfo = document.createElement('div');
        guestInfo.className = 'guest-info';
        
        const guestName = document.createElement('div');
        guestName.className = 'guest-name';
        guestName.textContent = guest.name;
        
        const guestEmail = document.createElement('div');
        guestEmail.className = 'guest-email';
        guestEmail.textContent = guest.email;
        guestEmail.style.fontSize = '0.9rem';
        guestEmail.style.color = '#7a6a5a';
        
        const guestDetails = document.createElement('div');
        guestDetails.className = 'guest-details';
        guestDetails.style.fontSize = '0.9rem';
        guestDetails.style.marginTop = '5px';
        
        if (guest.status === 'confirmed' && guest.guests > 0) {
            guestDetails.textContent = `Acompañantes: ${guest.guests}`;
        } else if (guest.status === 'confirmed') {
            guestDetails.textContent = 'Asiste solo/a';
        }
        
        const guestComment = document.createElement('div');
        guestComment.className = 'guest-comment';
        if (guest.message) {
            guestComment.textContent = `"${guest.message}"`;
            guestComment.style.marginTop = '8px';
        }
        
        const guestStatus = document.createElement('div');
        guestStatus.className = `guest-status ${guest.status === 'confirmed' ? 'status-confirmed' : 'status-declined'}`;
        guestStatus.textContent = guest.status === 'confirmed' ? 'Confirmado' : 'No asistirá';
        
        guestInfo.appendChild(guestName);
        guestInfo.appendChild(guestEmail);
        if (guest.status === 'confirmed') {
            guestInfo.appendChild(guestDetails);
        }
        if (guest.message) {
            guestInfo.appendChild(guestComment);
        }
        guestItem.appendChild(guestInfo);
        guestItem.appendChild(guestStatus);
        
        guestList.appendChild(guestItem);
    });
    
    // Añadir resumen
    const summary = document.createElement('div');
    summary.style.marginTop = '20px';
    summary.style.padding = '15px';
    summary.style.backgroundColor = '#f8f0f5';
    summary.style.borderRadius = '8px';
    summary.innerHTML = `
        <h3>Resumen de Confirmaciones:</h3>
        <p>Personas confirmadas: ${confirmedCount}</p>
        <p>Total de invitados (incluyendo acompañantes): ${totalGuests}</p>
    `;
    guestList.appendChild(summary);
}
