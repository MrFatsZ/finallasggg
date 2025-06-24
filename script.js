function getSelectedCars() {
  const checkboxes = document.querySelectorAll('.car-checkbox');
  const cars = [];

  checkboxes.forEach((cb, i) => {
    if (cb.checked) {
      const name = cb.dataset.name;
      const price = parseInt(cb.dataset.price);
      const startDate = document.querySelectorAll('.start-date')[i].value;
      const duration = parseInt(document.querySelectorAll('.duration')[i].value);
      if (!startDate || isNaN(duration)) return;

      const subtotal = price * duration;
      cars.push({ name, price, startDate, duration, subtotal });
    }
  });

  return cars;
}

function renderSummary(cars) {
  const summaryDiv = document.getElementById('summary');
  summaryDiv.innerHTML = '<h3>Rental Summary</h3>';
  let total = 0;
  const ul = document.createElement('ul');
  cars.forEach(car => {
    total += car.subtotal;
    const li = document.createElement('li');
    li.textContent = `${car.name} (${car.duration} days @ Rp ${car.price}) = Rp ${car.subtotal}`;
    ul.appendChild(li);
  });
  summaryDiv.appendChild(ul);
  summaryDiv.innerHTML += `<p><strong>Total: Rp ${total}</strong></p>`;
}

function getCurrentTimestamp() {
  const now = new Date();
  return now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, '0') + "-" +
    String(now.getDate()).padStart(2, '0') + " " +
    String(now.getHours()).padStart(2, '0') + ":" +
    String(now.getMinutes()).padStart(2, '0') + ":" +
    String(now.getSeconds()).padStart(2, '0');
}

document.getElementById('calculateBtn').addEventListener('click', () => {
  const cars = getSelectedCars();
  if (!cars.length) {
    alert('Please select at least one car with valid date and duration.');
    return;
  }
  renderSummary(cars);
});

document.getElementById('saveBtn').addEventListener('click', () => {
  const name = document.getElementById('customerName').value;
  const cars = getSelectedCars();
  if (!name || !cars.length) {
    alert('Please enter your name and select at least one car.');
    return;
  }

  const timestamp = getCurrentTimestamp();
  const booking = { name, cars, timestamp };
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.push(booking);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  alert('Booking saved successfully!');
  displayBookings();
});

function displayBookings() {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  const list = document.getElementById('bookingsList');
  list.innerHTML = '';

  bookings.forEach((booking, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${booking.name}</strong> 
      <br/><small>Booked at: ${booking.timestamp}</small><br/>
      ${booking.cars.map(car => `${car.name} - ${car.duration} day(s)`).join('<br/>')}
      <br/><button onclick="deleteBooking(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

function deleteBooking(index) {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  bookings.splice(index, 1);
  localStorage.setItem('bookings', JSON.stringify(bookings));
  displayBookings();
}

window.onload = displayBookings;
