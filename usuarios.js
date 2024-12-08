document.addEventListener("DOMContentLoaded", function () {
    const app = document.getElementById("app");
    const userSystem = document.getElementById("user-system");
  
    const activeUser = sessionStorage.getItem("activeUser");
  
    if (activeUser) {
      // Mostrar aplicación principal y ocultar sistema de usuarios
      app.style.display = "block";
      userSystem.style.display = "none";
      console.log(`Usuario activo: ${activeUser}`);
    } else {
      // Mostrar sistema de usuarios y ocultar aplicación principal
      app.style.display = "none";
      userSystem.style.display = "block";
      console.log("No hay usuario activo.");
    }
  });
  
  // Función para registrar usuario
  function registerUser() {
    const username = document.getElementById("reg-username").value.trim();
    const password = document.getElementById("reg-password").value.trim();
  
    if (!username || !password) {
      alert("Por favor, ingrese un usuario y una contraseña.");
      return;
    }
  
    if (localStorage.getItem(username)) {
      alert("El usuario ya existe.");
      return;
    }
  
    localStorage.setItem(username, password);
    alert("Usuario registrado exitosamente.");
  }
  
  // Función para iniciar sesión
  function loginUser() {
    const username = document.getElementById("login-username").value.trim();
    const password = document.getElementById("login-password").value.trim();
  
    if (!username || !password) {
      alert("Por favor, ingrese un usuario y una contraseña.");
      return;
    }
  
    const storedPassword = localStorage.getItem(username);
  
    if (storedPassword && storedPassword === password) {
      alert("Inicio de sesión exitoso.");
      sessionStorage.setItem("activeUser", username);
  
      // Cambiar vista a la aplicación principal
      document.getElementById("app").style.display = "block";
      document.getElementById("user-system").style.display = "none";
    } else {
      alert("Usuario o contraseña incorrectos.");
    }
  }
  
  // Función para cerrar sesión
  function logoutUser() {
    sessionStorage.removeItem("activeUser");
    alert("Has cerrado sesión.");
    location.reload(); // Recargar la página
  }
  
  // Función para "Olvidé mi contraseña"
  function forgotPassword() {
    const username = document.getElementById("login-username").value.trim();
  
    if (!username) {
      alert("Por favor, ingrese su usuario para recuperar la contraseña.");
      return;
    }
  
    const storedPassword = localStorage.getItem(username);
  
    if (storedPassword) {
      alert(`Su contraseña es: ${storedPassword}`);
    } else {
      alert("Usuario no encontrado.");
    }
  }
  
  // Función para mostrar/ocultar contraseña
  function togglePassword(inputId, toggleButton) {
    const passwordField = document.getElementById(inputId);
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type);
  
    // Cambiar texto del botón
    toggleButton.textContent = type === "password" ? "👁️ Mostrar/Ocultar" : "👁️ Ocultar";
  }
   