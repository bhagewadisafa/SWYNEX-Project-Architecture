/**
 * CampusDesk - Authentication Page Scripts
 * Handles login, registration, and session token storage
 */

document.addEventListener('DOMContentLoaded', () => {
  const tabLogin = document.getElementById('tab-login');
  const tabRegister = document.getElementById('tab-register');
  const formLogin = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const authMessage = document.getElementById('auth-message');

  // Tab switching
  if (tabLogin && tabRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      formLogin.style.display = 'block';
      formRegister.style.display = 'none';
      clearMessage();
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      formRegister.style.display = 'block';
      formLogin.style.display = 'none';
      clearMessage();
    });
  }

  // Handle Login Submission
  if (formLogin) {
    formLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();

      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;
      const submitBtn = formLogin.querySelector('button[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing In...';

        const result = await api.login(email, password);

        // Store auth state
        localStorage.setItem('campusdesk_token', result.token);
        localStorage.setItem('campusdesk_user', JSON.stringify(result.user));

        showMessage('Login successful! Redirecting to dashboard...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (err) {
        showMessage(err.message || 'Login failed. Please check credentials.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In';
      }
    });
  }

  // Handle Registration Submission
  if (formRegister) {
    formRegister.addEventListener('submit', async (e) => {
      e.preventDefault();
      clearMessage();

      const fullName = document.getElementById('reg-name').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      const password = document.getElementById('reg-password').value;
      const role = document.getElementById('reg-role').value;
      const department = document.getElementById('reg-dept').value;
      const rollNumber = document.getElementById('reg-roll').value.trim();
      const submitBtn = formRegister.querySelector('button[type="submit"]');

      try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';

        const result = await api.register({
          fullName,
          email,
          password,
          role,
          department,
          rollNumber
        });

        localStorage.setItem('campusdesk_token', result.token);
        localStorage.setItem('campusdesk_user', JSON.stringify(result.user));

        showMessage('Registration successful! Redirecting...', 'success');
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 800);
      } catch (err) {
        showMessage(err.message || 'Registration failed.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Create Account';
      }
    });
  }

  function showMessage(msg, type) {
    if (!authMessage) return;
    authMessage.textContent = msg;
    authMessage.className = `toast ${type}`;
    authMessage.style.display = 'block';
  }

  function clearMessage() {
    if (!authMessage) return;
    authMessage.style.display = 'none';
  }
});
