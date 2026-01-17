// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const submitButton = loginForm.querySelector('.btn-primary');

    // Email validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Clear error message
    function clearError(input, errorElement) {
        input.style.borderColor = '';
        errorElement.textContent = '';
    }

    // Show error message
    function showError(input, errorElement, message) {
        input.style.borderColor = 'var(--danger-color)';
        errorElement.textContent = message;
    }

    // Input field listeners
    emailInput.addEventListener('input', function() {
        clearError(emailInput, emailError);
    });

    passwordInput.addEventListener('input', function() {
        clearError(passwordInput, passwordError);
    });

    // Form submission
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Reset errors
        clearError(emailInput, emailError);
        clearError(passwordInput, passwordError);

        let isValid = true;

        // Validate email
        if (!emailInput.value.trim()) {
            showError(emailInput, emailError, 'Email is required');
            isValid = false;
        } else if (!validateEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email');
            isValid = false;
        }

        // Validate password
        if (!passwordInput.value) {
            showError(passwordInput, passwordError, 'Password is required');
            isValid = false;
        } else if (passwordInput.value.length < 6) {
            showError(passwordInput, passwordError, 'Password must be at least 6 characters');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        // Add loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;

        // Simulate API call (replace with actual authentication)
        setTimeout(() => {
            // Store user data in localStorage (for demo purposes)
            const userData = {
                name: emailInput.value.split('@')[0],
                email: emailInput.value,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('user', JSON.stringify(userData));

            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        }, 1500);
    });

    // Add input animations
    const inputs = document.querySelectorAll('.form-group input');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
            this.parentElement.style.transition = 'transform 0.3s ease';
        });

        input.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });

    // Auto-focus email field
    emailInput.focus();
});
