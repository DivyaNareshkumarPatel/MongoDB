document.addEventListener('DOMContentLoaded', () => {
    async function submitForm(event) {
        event.preventDefault();
        const username = document.getElementById('insertUsername').value;
        const firstName = document.getElementById('insertFirstName').value;
        const lastName = document.getElementById('insertLastName').value;
        const hobby = document.getElementById('insertHobby').value;
        const body = JSON.stringify({ username, firstName, lastName, hobby });

        try {
            const response = await fetch('/users/insert', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (response.ok) {
                alert('User inserted successfully');
                fetchUsers(); // Refresh the user list after inserting a new user
            } else {
                const errorMessage = await response.text();
                alert(`Error: ${errorMessage}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    }

    async function fetchUsers() {
        try {
            const response = await fetch('/users/all');

            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }

            const users = await response.json();
            populateTable(users);
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while fetching users. Please try again later.');
        }
    }

    function populateTable(users) {
        const table = document.querySelector('table');
        // Clear existing rows except for the header
        table.querySelectorAll('tr:not(:first-child)').forEach(row => row.remove());

        users.forEach(user => {
            const row = table.insertRow();
            const cellUsername = row.insertCell(0);
            const cellFirstName = row.insertCell(1);
            const cellLastName = row.insertCell(2);
            const cellHobby = row.insertCell(3);

            cellUsername.textContent = user.username;
            cellFirstName.textContent = user.details.firstName;
            cellLastName.textContent = user.details.lastName;
            cellHobby.textContent = user.details.hobby;
        });
    }

    document.getElementById('insertForm').addEventListener('submit', submitForm);
    fetchUsers();
});
