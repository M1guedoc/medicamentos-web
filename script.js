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

    if (medicamentos.length === 0) {
      console.error("El archivo MUESTRA_MEDICA_NEW.csv no tiene datos.");
    }
  },
  error: function (error) {
    console.error("Error al cargar el archivo CSV:", error);
  },
});

// Eventos
document.getElementById("buscarMedico").addEventListener("click", buscarMedico);
document.getElementById("siguiente").addEventListener("click", pasarASiguientePaso);
document.getElementById("siguienteCantidad").addEventListener("click", pasarAAsignarCantidades);
document.getElementById("guardar").addEventListener("click", guardarDatos);
document.getElementById("exportar").addEventListener("click", exportarDatos);
document.getElementById("agregar").addEventListener("click", agregarMedicamento);
document.getElementById("regresar").addEventListener("click", regresarMedicamento);

// Función para buscar médico
function buscarMedico() {
  const jvpm = document.getElementById("jvpm").value.trim();
  const medico = medicos.find((m) => m.Colegiado === jvpm);

  const nombreMedicoElement = document.getElementById("nombreMedico");

  if (!nombreMedicoElement) {
    console.error("Elemento con ID 'nombreMedico' no encontrado en el DOM.");
    return;
  }

  if (medico) {
    nombreMedicoElement.innerText = `Nombre: ${medico.NombreLargo}`;
  } else {
    nombreMedicoElement.innerText = "Médico no encontrado";
  }
}

// Pasar al siguiente paso
function pasarASiguientePaso() {
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
}

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

  seleccionados = []; // Reiniciar los medicamentos seleccionados
  actualizarSeleccionados();
}

// Agregar un medicamento
function agregarMedicamento() {
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
}

// Regresar un medicamento a la lista
function regresarMedicamento() {
  const lista = document.getElementById("listaSeleccionados");
  const seleccionado = lista.options[lista.selectedIndex];

  if (seleccionado) {
    const medicamentosContainer = document.getElementById("listaMedicamentos");
    const option = document.createElement("option");
    option.value = seleccionado.value;
    option.textContent = seleccionado.textContent;
    medicamentosContainer.appendChild(option);

    seleccionados = seleccionados.filter((med) => med.ID !== seleccionado.value);
    lista.remove(lista.selectedIndex);
    actualizarSeleccionados();
  }
}

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

  document.getElementById("siguienteCantidad").style.display =
    seleccionados.length === 8 ? "block" : "none";
}

// Pasar a la asignación de cantidades
function pasarAAsignarCantidades() {
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
    // Desplazamiento entre campos con flechas
    input.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown" && index < inputs.length - 1) {
        event.preventDefault();
        inputs[index + 1].focus();
      } else if (event.key === "ArrowUp" && index > 0) {
        event.preventDefault();
        inputs[index - 1].focus();
      }
    });

    // Validación al salir del campo
    input.addEventListener("blur", () => {
      if (input.value > 4) {
        input.value = 4;
      } else if (input.value < 1 && input.value !== "") {
        input.value = 1;
      }
    });
  });
}

// Guardar los datos ingresados
function guardarDatos() {
  const jvpm = document.getElementById("jvpm").value.trim();
  const dia = document.getElementById("dia").value;
  const semana = document.getElementById("semana").value;
  const medico = medicos.find((m) => m.Colegiado === jvpm);

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
      cantidadMM: med.cantidad,
      semana: semana,
      dia: dia,
    });
  });

  actualizarTabla();

  // Reiniciar todo para el próximo médico
  document.getElementById("jvpm").value = "";
  document.getElementById("dia").value = "";
  document.getElementById("semana").value = "";
  seleccionados = [];
  mostrarMedicamentos();

  document.getElementById("step-3").style.display = "none";
  document.getElementById("step-1").style.display = "block";
}

// Actualizar la tabla de resultados
function actualizarTabla() {
  const tablaResultados = document.getElementById("tablaResultados");
  tablaResultados.innerHTML = `
    <tr>
      <th>Nombre</th>
      <th>JVPM</th>
      <th>CodigoMM</th>
      <th>Medicamentos</th>
      <th>CantidadMM</th>
      <th>Semana</th>
      <th>Día</th>
    </tr>
  `;

  datosGuardados.forEach((dato) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${dato.nombreMedico}</td>
      <td>${dato.jvpm}</td>
      <td>${dato.codigoProducto}</td>
      <td>${dato.nombreProducto}</td>
      <td>${dato.cantidadMM}</td>
      <td>${dato.semana}</td>
      <td>${dato.dia}</td>
    `;
    tablaResultados.appendChild(tr);
  });

  document.getElementById("tablaDatos").style.display = "block";
}

// Exportar los datos a Excel
function exportarDatos() {
  const ws = XLSX.utils.json_to_sheet(datosGuardados);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Datos");
  XLSX.writeFile(wb, "AsignacionMedica.xlsx");
}
