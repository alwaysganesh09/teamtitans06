// js/auth.js

document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('admin.html')) {
        checkAuthentication();
    }
});

function checkAuthentication() {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const logoutBtn = document.getElementById('logoutButton');
    
    if (isAuthenticated !== 'true') {
        window.location.href = 'login.html';
    } else {
        if (logoutBtn) {
            logoutBtn.style.display = 'block';
            logoutBtn.addEventListener('click', handleLogout);
        }
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const passwordInput = document.getElementById('adminPassword');
    const password = passwordInput.value;

    try {
        // Using a relative path makes the API call work on both localhost and Vercel.
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password }),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            localStorage.setItem('isAuthenticated', 'true');
            window.location.href = 'admin.html';
        } else {
            // Check for a specific message from the server
            const errorMessage = result.message || 'Incorrect password!';
            alert(errorMessage);
            passwordInput.value = '';
        }
    } catch (error) {
        console.error('Login failed:', error);
        alert('An error occurred. Please check the server connection.');
    }
}

function handleLogout() {
    localStorage.removeItem('isAuthenticated');
    window.location.href = 'login.html';
}