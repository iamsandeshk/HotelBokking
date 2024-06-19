document.getElementById('memberForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.permanent = data.permanent === 'on';

    // Get existing members from localStorage
    let members = JSON.parse(localStorage.getItem('members')) || [];

    // Add new member
    members.push(data);

    // Save back to localStorage
    localStorage.setItem('members', JSON.stringify(members));

    // Reset the form
    event.target.reset();

    // Display members
    displayMembers();
});

function displayMembers() {
    const membersList = document.getElementById('membersList');
    membersList.innerHTML = '';

    const members = JSON.parse(localStorage.getItem('members')) || [];

    members.forEach((member, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'member';
        memberDiv.innerHTML = `
            <strong>Employee ID:</strong> ${member.emp_id}<br>
            <strong>Full Name:</strong> ${member.full_name}<br>
            <strong>Initials:</strong> ${member.initials}<br>
            <strong>University:</strong> ${member.university}<br>
            <strong>Package Type:</strong> ${member.package_type}<br>
            <strong>Permanent:</strong> ${member.permanent}<br>
            <strong>Age:</strong> ${member.age}<br>
            <strong>Title:</strong> ${member.title}<br>
            <strong>Address:</strong> ${member.address}<br>
            <strong>Date of Birth:</strong> ${member.dob}<br>
            <strong>Civil Status:</strong> ${member.civil_status}<br>
            <strong>Department:</strong> ${member.department}<br>
            <strong>Present Post:</strong> ${member.present_post}<br>
            <strong>Comments:</strong> ${member.comments}<br>
        `;
        membersList.appendChild(memberDiv);
    });
}

// Initial display of members
displayMembers();