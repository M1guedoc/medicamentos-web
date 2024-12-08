// Variables globales
let medicos = [];
let medicamentos = [];
let seleccionados = [];
let datosGuardados = [];

// Cargar datos desde CSV
Papa.parse("MEDICOS_NEW.csv", {
  download: true,
  header: true,
  complete: function (results) {
    medicos = results.data;
    console.log("Datos de médicos cargados:", medicos);
  },
});

Papa.parse("MUESTRA_MEDICA_NEW.csv", {
  download: true,
  header: true,
  complete: function (results) {
    medicamentos = results.data;
    console.log("Medicamentos cargados:", medicamentos);
  },
  error: function (error) {
    console.error("Error al cargar el archivo CSV:", error);
  },
});

// Cargar datos guardados desde localStorage al iniciar la aplicación
document.addEventListener("DOMContentLoaded", function () {
  cargarDatosDelUsuario();
});

// Cargar datos específicos del usuario
function cargarDatosDelUsuario() {
  const activeUser = localStorage.getItem("activeUser");

  if (!activeUser) {
    console.warn("No hay usuario activo.");
    return;
  }

  // Limpiar datos antiguos
  datosGuardados = [];

  // Cargar los datos específicos de cada usuario desde localStorage
  const storedData = localStorage.getItem(`tablaDatos_${activeUser}`);
  if (storedData) {
    datosGuardados = JSON.parse(storedData);
    actualizarTabla();
  } else {
    datosGuardados = [];
    actualizarTabla();
  }
}

// Guardar datos específicos del usuario
function guardarDatosDelUsuario() {
  const activeUser = localStorage.getItem("activeUser");
  if (!activeUser) {
    console.error("No hay usuario activo. No se pueden guardar los datos.");
    return;
  }

  // Guardar los datos del usuario con el nombre de usuario único
  localStorage.setItem(`tablaDatos_${activeUser}`, JSON.stringify(datosGuardados));
}

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
    localStorage.setItem("activeUser", username); // Guardar usuario activo en localStorage

    // Limpiar la tabla de datos guardados previos de otros usuarios
    datosGuardados = [];
    cargarDatosDelUsuario();

    // Cambiar vista a la aplicación principal
    document.getElementById("app").style.display = "block";
    document.getElementById("user-system").style.display = "none";
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

// Función para cerrar sesión
function logoutUser() {
  localStorage.removeItem("activeUser");
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

// Función para buscar médico
document.getElementById("buscarMedico").addEventListener("click", function () {
  const jvpm = document.getElementById("jvpm").value.trim();
  const medico = medicos.find((m) => m.Colegiado === jvpm); // Buscar por el JVPM en la columna "Colegiado"

  const nombreMedicoElement = document.getElementById("nombreMedico");

  if (medico) {
    nombreMedicoElement.innerText = `Nombre: ${medico.NombreLargo}`;
  } else {
    nombreMedicoElement.innerText = "Médico no encontrado";
  }
});

// Pasar al siguiente paso
document.getElementById("siguiente").addEventListener("click", function () {
  const jvpm = document.getElementById("jvpm").value.trim();
  const dia = document.getElementById("dia").value;
  const semana = document.getElementById("semana").value;
  const medico = medicos.find((m) => m.Colegiado === jvpm);

  if (!jvpm || !medico) {
    alert("Debe ingresar un JVPM válido y buscar al médico.");
    return;
  }

  document.getElementById("datosMedico").innerHTML = `
    <p><strong>JVPM:</strong> ${jvpm}</p>
    <p><strong>Nombre:</strong> ${medico.NombreLargo}</p>
    <p><strong>Día:</strong> ${dia}</p>
    <p><strong>Semana:</strong> ${semana}</p>
  `;

  document.getElementById("step-1").style.display = "none";
  document.getElementById("step-2").style.display = "block";

  mostrarMedicamentos();
});

// Mostrar lista de medicamentos
function mostrarMedicamentos() {
  const medicamentosContainer = document.getElementById("listaMedicamentos");
  medicamentosContainer.innerHTML = "";

  medicamentos.forEach((medicamento) => {
    const option = document.createElement("option");
    option.value = medicamento.ID;
    option.textContent = `${medicamento.DESCRIPCION} (ID: ${medicamento.ID})`;
    medicamentosContainer.appendChild(option);
  });

  seleccionados = [];
  actualizarSeleccionados();
}

// Agregar un medicamento
document.getElementById("agregar").addEventListener("click", function () {
  const lista = document.getElementById("listaMedicamentos");
  const seleccionado = lista.options[lista.selectedIndex];

  if (seleccionado && seleccionados.length < 8) {
    seleccionados.push({
      ID: seleccionado.value,
      DESCRIPCION: seleccionado.textContent,
    });

    lista.remove(lista.selectedIndex);
    actualizarSeleccionados();
  } else if (seleccionados.length >= 8) {
    alert("Solo se permiten 8 medicamentos.");
  }
});

// Regresar un medicamento a la lista original
document.getElementById("regresar").addEventListener("click", function () {
  const listaSeleccionados = document.getElementById("listaSeleccionados");
  const seleccionado = listaSeleccionados.options[listaSeleccionados.selectedIndex];

  if (seleccionado) {
    seleccionados = seleccionados.filter((med) => med.ID !== seleccionado.value);

    const medicamentosContainer = document.getElementById("listaMedicamentos");
    const option = document.createElement("option");
    option.value = seleccionado.value;
    option.textContent = seleccionado.textContent;
    medicamentosContainer.appendChild(option);

    listaSeleccionados.remove(listaSeleccionados.selectedIndex);
    actualizarSeleccionados();
  } else {
    alert("Seleccione un medicamento para regresar.");
  }
});

// Actualizar lista de seleccionados
function actualizarSeleccionados() {
  const seleccionadosContainer = document.getElementById("listaSeleccionados");
  seleccionadosContainer.innerHTML = "";

  seleccionados.forEach((medicamento) => {
    const option = document.createElement("option");
    option.value = medicamento.ID;
    option.textContent = medicamento.DESCRIPCION;
    seleccionadosContainer.appendChild(option);
  });

  if (seleccionados.length === 8) {
    document.getElementById("siguienteCantidad").style.display = "block";
  } else {
    document.getElementById("siguienteCantidad").style.display = "none";
  }
}

// Función para pasar a la asignación de cantidades
document.getElementById("siguienteCantidad").addEventListener("click", function () {
  if (seleccionados.length !== 8) {
    alert("Debe seleccionar exactamente 8 medicamentos antes de continuar.");
    return;
  }

  document.getElementById("step-2").style.display = "none";
  document.getElementById("step-3").style.display = "block";

  const cantidadesContainer = document.getElementById("cantidades");
  cantidadesContainer.innerHTML = "";

  seleccionados.forEach((medicamento) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <label>
        ${medicamento.DESCRIPCION} (ID: ${medicamento.ID})
        <input 
          type="number" 
          min="1" 
          max="4" 
          placeholder="Cantidad" 
          data-id="${medicamento.ID}" 
          class="cantidad-input">
      </label>
    `;
    cantidadesContainer.appendChild(div);
  });

  const inputs = document.querySelectorAll(".cantidad-input");
  inputs.forEach((input, index) => {
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" && index < inputs.length - 1) {
        event.preventDefault();
        inputs[index + 1].focus();
      } else if (event.key === "ArrowUp" && index > 0) {
        event.preventDefault();
        inputs[index - 1].focus();
      }
    });

    input.addEventListener("blur", () => {
      if (input.value > 4) {
        input.value = 4;
      } else if (input.value < 1 && input.value !== "") {
        input.value = 1;
      }
    });
  });
});

// Guardar datos ingresados
document.getElementById("guardar").addEventListener("click", function () {
  const jvpm = document.getElementById("jvpm").value.trim();
  const dia = document.getElementById("dia").value;
  const semana = document.getElementById("semana").value;
  const medico = medicos.find((m) => m.Colegiado === jvpm);

  if (!medico) {
    alert("El JVPM ingresado no es válido. No se guardarán los datos.");
    return;
  }

  const cantidades = Array.from(document.querySelectorAll(".cantidad-input")).map((input) => ({
    id: input.getAttribute("data-id"),
    cantidad: input.value,
  }));

  cantidades.forEach((med) => {
    datosGuardados.push({
      nombreMedico: medico.NombreLargo,
      jvpm: jvpm,
      codigoProducto: med.id,
      nombreProducto: seleccionados.find((s) => s.ID === med.id).DESCRIPCION,
      cantidad: med.cantidad,
      dia: dia,
      semana: semana,
    });
  });

  actualizarTabla();
  guardarDatosDelUsuario();

  document.getElementById("step-3").style.display = "none";
  document.getElementById("step-1").style.display = "block";

  document.getElementById("jvpm").value = "";
  document.getElementById("dia").value = "";
  document.getElementById("semana").value = "";
  seleccionados = [];
  mostrarMedicamentos();
});

// Actualizar la tabla
function actualizarTabla() {
  const tablaResultados = document.getElementById("tablaResultados");
  tablaResultados.innerHTML = `
    <tr>
      <th>Nombre del Médico</th>
      <th>JVPM</th>
      <th>Código del Medicamento</th>
      <th>Nombre del Medicamento</th>
      <th>Cantidad</th>
      <th>Día</th>
      <th>Semana</th>
    </tr>
  `;

  datosGuardados.forEach((dato) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dato.nombreMedico}</td>
      <td>${dato.jvpm}</td>
      <td>${dato.codigoProducto}</td>
      <td>${dato.nombreProducto}</td>
      <td>${dato.cantidad}</td>
      <td>${dato.dia}</td>
      <td>${dato.semana}</td>
    `;
    tablaResultados.appendChild(tr);
  });

  document.getElementById("tablaDatos").style.display = "block";
}

// Exportar los datos a un archivo Excel
document.getElementById("exportar").addEventListener("click", function () {
  if (datosGuardados.length === 0) {
    alert("No hay datos para exportar.");
    return;
  }

  const nombreArchivo = "ParrillaPromocional.xlsx";

  const wsData = datosGuardados.map((dato) => ({
    "Nombre del Médico": dato.nombreMedico,
    JVPM: dato.jvpm,
    "Código del Medicamento": dato.codigoProducto,
    "Nombre del Medicamento": dato.nombreProducto,
    Cantidad: dato.cantidad,
    Día: dato.dia,
    Semana: dato.semana,
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asignación Médica");
  XLSX.writeFile(wb, nombreArchivo);
});

// Borrar todos los datos guardados
document.getElementById("borrarDatos").addEventListener("click", function () {
  if (confirm("¿Estás seguro de que deseas borrar todos los datos? Esta acción no se puede deshacer.")) {
    const activeUser = localStorage.getItem("activeUser");
    if (activeUser) {
      localStorage.removeItem(`tablaDatos_${activeUser}`);
      datosGuardados = [];
      actualizarTabla();
      alert("Todos los datos han sido borrados.");
    } else {
      alert("No hay un usuario activo. No se pueden borrar datos.");
    }
  }
});
