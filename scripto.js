let modifyIndex = -1;

function storeBookingData() {
    if (!validateAge()) {
        alert('You must be 21+ to book a room.');
        return false;
    }

    // Get form data
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const address = document.getElementById('address').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;
    const guests = document.getElementById('guests').value;
    const rooms = document.getElementById('rooms').value;
    const availableRooms = Array.from(document.querySelectorAll('input[name="availableRooms"]:checked')).map(cb => cb.value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentDetails = getPaymentDetails(paymentMethod);
    let totalAmount = document.getElementById('totalAmount').value;

    // Double amount based on selected rooms
    const selectedRoomsCount = availableRooms.length;
    if (selectedRoomsCount > 0) {
        totalAmount *= selectedRoomsCount; // Assuming totalAmount is already calculated
    }

    // Create booking object
    const booking = {
        name: `${firstName} ${lastName}`,
        address,
        dob,
        email,
        phone,
        checkin,
        checkout,
        guests,
        rooms,
        availableRooms : availableRooms,
        paymentMethod,
        totalAmount
    };

    // Get existing bookings from local storage
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    if (modifyIndex === -1) {
        // Add new booking to the list
        bookings.push(booking);
    } else {
        // Modify existing booking
        bookings[modifyIndex] = booking;
        modifyIndex = -1;
    }

    // Save updated bookings back to local storage
    localStorage.setItem('bookings', JSON.stringify(bookings));

    // Display the bookings
    displayBookings();

    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('paymentDetails').innerHTML = '';
    document.getElementById('totalAmount').value = '';

    // Prevent form submission
    return false;
}


function showPaymentDetails() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentDetailsDiv = document.getElementById('paymentDetails');

    let html = '';

    switch (paymentMethod) {
        case 'UPI':
            html = `
                <label for="upiOptions">Choose UPI App:</label>
                <select id="upiOptions" name="upiOptions" required>
                    <option value="PhonePe">PhonePe</option>
                    <option value="Paytm">Paytm</option>
                    <option value="Google Pay">Google Pay</option>
                </select>
            `;
            break;
        case 'Card':
            html = `
                <label for="cardNumber">Card Number:</label>
                <input type="text" id="cardNumber" name="cardNumber" required>

                <label for="cardExpiry">Expiry Date:</label>
                <input type="month" id="cardExpiry" name="cardExpiry" required>

                <label for="cardCVV">CVV:</label>
                <input type="text" id="cardCVV" name="cardCVV" required>
            `;
            break;
        case 'Bank Transfer':
            html = `
                <label for="bankName">Bank Name:</label>
                <input type="text" id="bankName" name="bankName" required>

                <label for="accountNumber">Account Number:</label>
                <input type="text" id="accountNumber" name="accountNumber" required>

                <label for="ifscCode">IFSC Code:</label>
                <input type="text" id="ifscCode" name="ifscCode" required>
            `;
            break;
        case 'Offline':
            html = '';
            break;
    }

    paymentDetailsDiv.innerHTML = html;
}

function getPaymentDetails(paymentMethod) {
    let details = '';
    switch (paymentMethod) {
        case 'UPI':
            details = document.getElementById('upiOptions').value;
            break;
        case 'Card':
            details = `Card Number: ${document.getElementById('cardNumber').value}, Expiry: ${document.getElementById('cardExpiry').value}, CVV: ${document.getElementById('cardCVV').value}`;
            break;
        case 'Bank Transfer':
            details = `Bank: ${document.getElementById('bankName').value}, Account Number: ${document.getElementById('accountNumber').value}, IFSC: ${document.getElementById('ifscCode').value}`;
            break;
        case 'Offline':
            details = 'Offline Payment';
            break;
    }
    return details;
}

function setPaymentDetails(paymentMethod, details) {
    switch (paymentMethod) {
        case 'UPI':
            document.getElementById('upiOptions').value = details;
            break;
        case 'Card':
            const [cardNumber, cardExpiry, cardCVV] = details.split(', ').map(item => item.split(': ')[1]);
            document.getElementById('cardNumber').value = cardNumber;
            document.getElementById('cardExpiry').value = cardExpiry;
            document.getElementById('cardCVV').value = cardCVV;
            break;
        case 'Bank Transfer':
            const [bankName, accountNumber, ifscCode] = details.split(', ').map(item => item.split(': ')[1]);
            document.getElementById('bankName').value = bankName;
            document.getElementById('accountNumber').value = accountNumber;
            document.getElementById('ifscCode').value = ifscCode;
            break;
        case 'Offline':
            // No details needed for offline
            break;
    }
}

function validateAge() {
    const dob = document.getElementById('dob').value;
    if (!dob) return false;

    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
        age--;
    }

    return age >= 21;
}

function calculateAmount() {
    const checkin = document.getElementById('checkin').value;
    const checkout = document.getElementById('checkout').value;

    if (checkin && checkout) {
        const checkinDate = new Date(checkin);
        const checkoutDate = new Date(checkout);
        const timeDiff = checkoutDate - checkinDate;
        const days = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (days > 0) {
            const amount = days * 345;
            document.getElementById('totalAmount').value = amount;
        }
    }
}

// Display bookings on page load
function displayBookings() {
    const storedBookingsDiv = document.getElementById("storedBookings");
    const bookings = JSON.parse(localStorage.getItem("bookings")) || [];

    storedBookingsDiv.innerHTML =
      "<ul>" +
      bookings
        .map(
          (booking, index) => `
        <li>
            <strong>Name:</strong> ${booking.firstName + booking.lastName}<br>
            <strong>Address:</strong> ${booking.address}<br>
            <strong>Date of Birth:</strong> ${booking.dob}<br>
            <strong>Email:</strong> ${booking.email}<br>
            <strong>Phone:</strong> ${booking.phone}<br>
            <strong>Check-in:</strong> ${booking.checkin}<br>
            <strong>Check-out:</strong> ${booking.checkout}<br>
            <strong>Guests:</strong> ${booking.guests}<br>
            <strong>Rooms:</strong> ${booking.rooms}<br>
            <strong>Room Numbers:</strong> ${Array.isArray(booking.availableRooms) ? booking.availableRooms.join(', ') : booking.availableRooms}<br>
            <strong>Payment Method:</strong> ${booking.paymentMethod}<br>
            <strong>Total Amount:</strong> $${booking.totalAmount}<br>
            <div class="booking-controls">
                <button class="modify-btn" onclick="modifyBooking(${index})"><i class="fa-solid fa-plus fa-rotate-by" style="--fa-rotate-angle: 80deg;"></i></button>
                <button class="delete-btn" onclick="deleteBooking(${index})"><i class="fa-solid fa-trash-can fa-rotate-by" style="--fa-rotate-angle: 350deg;""></i></button>
            </div>
        </li>
    `
        )
        .join("") +
      "</ul>";
  }

  function deleteBooking(index) {
    let bookings = JSON.parse(localStorage.getItem("bookings")) || [];
    bookings.splice(index, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    displayBookings();
  }

  function modifyBooking(index) {
    window.location.href = `order.html?modifyIndex=${index}`;
  }

  // Display bookings on page load
  window.onload = displayBookings;

window.onload = () => {
    displayBookings();
    const params = new URLSearchParams(window.location.search);
    modifyIndex = params.get('modifyIndex');
    if (modifyIndex !== null) {
        modifyBooking(modifyIndex);
    }
};
