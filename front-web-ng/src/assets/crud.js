let JWT_TOKEN = localStorage.getItem('token');

function mostrarError(error) {
    // Crear el elemento de la alerta
    let alertElement = document.createElement("div");
    alertElement.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show", "fixed-top");

    // Crear el contenido de la alerta
    alertElement.innerHTML = `
    <button type="button" class="close-error-dspl" data-dismiss="alert" aria-label="Close" style="background-color: transparent; border: 0;">
      <i class="fa fa-times"></i>
    </button>
    <strong>Error:</strong> ${error}
  `;

    // Agregar la alerta al cuerpo del documento
    document.body.appendChild(alertElement);

    // Agregar el evento para cerrar la alerta
    alertElement.querySelector(".close-error-dspl").addEventListener("click", function () {
        alertElement.remove();
    });
}


function mostrarExito(mensaje) {
    // Crear el elemento de la alerta
    let alertElement = document.createElement("div");
    alertElement.classList.add("alert", "alert-success", "alert-dismissible", "fade", "show", "fixed-top");

    // Crear el contenido de la alerta
    alertElement.innerHTML = `
    <button type="button" class="close-success-dspl" data-dismiss="alert" aria-label="Close" style="background-color: transparent; border: 0;">
      <i class="fa fa-times"></i>
    </button>
    <strong>Éxito:</strong> ${mensaje}
  `;

    // Agregar la alerta al cuerpo del documento
    document.body.appendChild(alertElement);

    // Agregar el evento para cerrar la alerta
    alertElement.querySelector(".close-success-dspl").addEventListener("click", function () {
        alertElement.remove();
    });

    // Establecer el temporizador para eliminar la alerta después de 3 segundos
    setTimeout(function () {
        // Reducir gradualmente la opacidad de la alerta
        let opacity = 1;
        let fadeOutInterval = setInterval(function () {
            opacity -= 0.02;
            alertElement.style.opacity = opacity;
            if (opacity <= 0) {
                // Eliminar la alerta cuando la opacidad llegue a 0
                clearInterval(fadeOutInterval);
                alertElement.remove();
            }
        }, 50);
    }, 4000);
}



function verElemento(id) {
    const modalText = document.getElementById('modal-text');
    let modal = document.getElementById("myModal");
    modalText.innerHTML = "";
    let filaObtained = null;
    let texto = "";

    let tabla = document.querySelector("table");


    let filas = document.querySelectorAll("table tbody tr");

    // Recorrer las filas y buscar el elemento con el ID especificado
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let elementoId = fila.querySelector("td:first-child").textContent; // Obtener el ID del elemento

        // Verificar si el ID coincide con el ID especificado
        if (parseInt(elementoId) === parseInt(id)) {
            // Eliminar el elemento de la tabla
            filaObtained = fila
        }
    }


    // Obtener el encabezado de la tabla
    let encabezado = tabla.getElementsByTagName("thead")[0].getElementsByTagName("th");

    // Obtener las celdas de la fila seleccionada
    let celdas = filaObtained.getElementsByTagName("td");

    // Recorrer cada celda de la fila y generar el texto
    for (let i = 0; i < celdas.length - 1; i++) {
        let columna = encabezado[i].textContent.trim();
        let valor = celdas[i].textContent.trim();

        texto += "<strong>" + columna + "</strong>: " + valor + "<br>";
    }

    modalText.innerHTML = texto;
    modal.style.display = "block";
}


function eliminarElementoTablaHTML(id) {
    // Obtener todas las filas de la tabla
    let filas = document.querySelectorAll("table tbody tr");

    // Recorrer las filas y buscar el elemento con el ID especificado
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let elementoId = fila.querySelector("td:first-child").textContent; // Obtener el ID del elemento

        // Verificar si el ID coincide con el ID especificado
        if (parseInt(elementoId) === parseInt(id)) {
            // Eliminar el elemento de la tabla
            fila.remove();
            break; // Terminar el bucle después de encontrar y eliminar el elemento
        }
    }
}

function removeAPIElement(jwt, pathWithId) {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", jwt);

        let requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(pathWithId, requestOptions)
            .then(response => response.text())
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


function getAPIElements(jwt, path) {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Authorization", jwt);

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(path, requestOptions)
            .then(response => response.text())
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}

function postAPIElements(jwt, path, object) {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", jwt);

        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(object),
            redirect: 'follow'
        };

        fetch(path, requestOptions)
            .then(response => response.text())
            .then(text => resolve(text))
            .catch(error => reject(error));
    });
}

function putAPIElements(jwt, pathWithId, object) {
    return new Promise((resolve, reject) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", jwt);

        let requestOptions = {
            method: 'PUT',
            headers: myHeaders,
            body: JSON.stringify(object),
            redirect: 'follow'
        };

        fetch(pathWithId, requestOptions)
            .then(result => resolve(result))
            .catch(error => reject(error));
    });
}


function generateTableHTML(entryDoc, elementos) {
    if (elementos.length == 0) {
        throw new Error("Error: No hay elementos para generar, refresque la página o vuelva a intentarlo más tarde")
    }
    // Crear la tabla
    let table = document.createElement("table");
    table.classList.add("table", "table-striped", "table-bordered", "table-hover", "table-responsive");

    // Crear la cabecera de la tabla
    let thead = document.createElement("thead");
    let headerRow = document.createElement("tr");

    // Agregar los índices de columna a la cabecera
    for (let key in elementos[0]) {
        let th = document.createElement("th");
        th.textContent = key;
        headerRow.appendChild(th);
    }

    // Agregar encabezado para los botones
    let accionesTh = document.createElement("th");
    accionesTh.textContent = "Acciones";
    headerRow.appendChild(accionesTh);

    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Crear el cuerpo de la tabla
    let tbody = document.createElement("tbody");

    if (!elementos.error) {
        // Agregar los objetos elemento como filas en el cuerpo de la tabla
        elementos.forEach(function (el) {
            let row = document.createElement("tr");

            for (let key in el) {
                let td = document.createElement("td");
                td.textContent = el[key];
                row.appendChild(td);
            }

            // Agregar botones de edición y eliminación
            let accionesTd = document.createElement("td");

            // Botón de edición
            let editarBtn = document.createElement("button");
            editarBtn.classList.add("btn", "btn-warning");
            editarBtn.innerHTML = '<i class="fa fa-pencil"></i> Editar';
            editarBtn.addEventListener("click", function () {
                editElemento(el.id);
            });
            accionesTd.appendChild(editarBtn);

            // Botón de eliminación
            let eliminarBtn = document.createElement("button");
            eliminarBtn.classList.add("btn", "btn-danger");
            eliminarBtn.innerHTML = '<i class="fa fa-trash"></i> Eliminar';
            eliminarBtn.addEventListener("click", function () {
                eliminarElemento(el.id);
            });
            accionesTd.appendChild(eliminarBtn);


            // Botón de vista
            let viewBtn = document.createElement("button");
            viewBtn.classList.add("btn", "btn-info", "w-100");
            viewBtn.innerHTML = '<i class="fa fa-eye"></i> Ver';
            viewBtn.addEventListener("click", function () {
                verElemento(el.id);
            });
            accionesTd.appendChild(viewBtn);

            row.appendChild(accionesTd);
            tbody.appendChild(row);
        });

        table.appendChild(tbody);

        // Agregar la tabla al contenedor
        entryDoc.appendChild(table);
    }
}


function addElementToTable(elemento) {
    // Obtener la referencia al cuerpo de la tabla
    let tbody = document.querySelector("table tbody");

    // Crear una nueva fila para el elemento
    let row = document.createElement("tr");

    // Agregar el ID como primer elemento de la fila
    let idCell = document.createElement("td");
    idCell.textContent = elemento.id;
    row.appendChild(idCell);

    // Agregar las celdas con los valores del elemento
    for (let key in elemento) {
        if (key !== "id") {
            let td = document.createElement("td");
            td.textContent = elemento[key];
            row.appendChild(td);
        }
    }

    // Agregar botones de edición y eliminación
    let accionesTd = document.createElement("td");

    // Botón de edición
    let editarBtn = document.createElement("button");
    editarBtn.classList.add("btn", "btn-warning");
    editarBtn.innerHTML = '<i class="fa fa-pencil"></i> Editar';
    editarBtn.addEventListener("click", function () {
        editElemento(elemento.id);
    });
    accionesTd.appendChild(editarBtn);

    // Botón de eliminación
    let eliminarBtn = document.createElement("button");
    eliminarBtn.classList.add("btn", "btn-danger");
    eliminarBtn.innerHTML = '<i class="fa fa-trash"></i> Eliminar';
    eliminarBtn.addEventListener("click", function () {
        eliminarElemento(elemento.id);
    });
    accionesTd.appendChild(eliminarBtn);

    row.appendChild(accionesTd);

    // Agregar la nueva fila al cuerpo de la tabla
    tbody.appendChild(row);
}



// Función para eliminar una people
async function eliminarElemento(id) {
    const remove_path = "http://localhost:3000/usuarios/" + id;
    try {
        await removeAPIElement(JWT_TOKEN, remove_path);
        eliminarElementoTablaHTML(id)
        mostrarExito("Elemento eliminado");
    } catch (error) {
        mostrarError(error)
    }
}

async function generateTable() {
    try {
        const people = JSON.parse(await getAPIElements(JWT_TOKEN, "http://localhost:3000/usuarios"));
        generateTableHTML(document.getElementById("tabla-container"), people)
    } catch (error) {
        mostrarError(error)
    }
}

// Función para editar una people // NOTE: EDIT
async function editElemento(id) {
    document.getElementById('formularioPeople').reset();
    let filas = document.querySelectorAll("table tbody tr");
    let filaElemento = null

    // Recorrer las filas y buscar el elemento con el ID especificado
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let elementoId = fila.querySelector("td:first-child").textContent;

        if (parseInt(elementoId) === parseInt(id)) {
            filaElemento = fila;
            break;
        }
    }

    if (filaElemento) {
        document.getElementById("id").value = filaElemento.cells[0].textContent;
        document.getElementById("fecha_nacimiento").value = filaElemento.cells[1].textContent;
        document.getElementById("nacionalidad").value = filaElemento.cells[2].textContent;
        document.getElementById("sexo").value = filaElemento.cells[3].textContent;
        document.getElementById("tipo_ident").value = filaElemento.cells[4].textContent;
        document.getElementById("identificacion").value = filaElemento.cells[5].textContent;
        document.getElementById("nombre").value = filaElemento.cells[6].textContent;
        document.getElementById("apellido1").value = filaElemento.cells[7].textContent;
        document.getElementById("apellido2").value = filaElemento.cells[8].textContent;
        document.getElementById("movil").value = filaElemento.cells[9].textContent;
        document.getElementById("email").value = filaElemento.cells[10].textContent;
        document.getElementById("edad").value = filaElemento.cells[11].textContent;
        document.getElementById("datos_adicionales").value = filaElemento.cells[12].textContent;
        document.getElementById("nombre_titular_banco").value = filaElemento.cells[13].textContent;
        document.getElementById("titular_nif_banco").value = filaElemento.cells[14].textContent;
        document.getElementById("tipo_cuenta_bancaria").value = filaElemento.cells[15].textContent;
        document.getElementById("num_cuenta_bancaria").value = filaElemento.cells[16].textContent;
        document.getElementById("direccion").value = filaElemento.cells[17].textContent;
        document.getElementById("numero_direccion").value = filaElemento.cells[18].textContent;
        document.getElementById("piso_direccion").value = filaElemento.cells[19].textContent;
        document.getElementById("extension_direccion").value = filaElemento.cells[20].textContent;
        document.getElementById("codigo_postal").value = filaElemento.cells[21].textContent;
        document.getElementById("poblacion").value = filaElemento.cells[22].textContent;
        document.getElementById("provincia").value = filaElemento.cells[23].textContent;
        document.getElementById("pais").value = filaElemento.cells[24].textContent;
        document.getElementById("password").value = filaElemento.cells[25].textContent;


        let enviarElemento = document.getElementById("enviarElemento");
        enviarElemento.innerText = "Editar";
        let enviarElementoTopBtn = document.getElementById('crudAddElementToggleButton');
        enviarElementoTopBtn.innerHTML = '<i class="fa fa-eye"></i> Mostrar/Ocultar menú de edición'

        let formularioContainer = document.getElementById("crudFormularioContainer");
        formularioContainer.style.display = "block";
    } else {
        mostrarError("No se encontró el elemento en la tabla");
    }
}

// Función para actualizar una fila en la tabla con los nuevos valores
function actualizarFilaTabla(people) {
    let filas = document.querySelectorAll("table tbody tr");
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let elementoId = fila.querySelector("td:first-child").textContent;

        if (parseInt(elementoId) === parseInt(people.id)) {
            fila.querySelector("td:nth-child(2)").textContent = people.Fecha_Nacimiento;
            fila.querySelector("td:nth-child(3)").textContent = people.Nacionalidad;
            fila.querySelector("td:nth-child(4)").textContent = people.Sexo;
            fila.querySelector("td:nth-child(5)").textContent = people.Tipo_ident;
            fila.querySelector("td:nth-child(6)").textContent = people.Identificacion;
            fila.querySelector("td:nth-child(7)").textContent = people.Nombre;
            fila.querySelector("td:nth-child(8)").textContent = people.Apellido1;
            fila.querySelector("td:nth-child(9)").textContent = people.Apellido2;
            fila.querySelector("td:nth-child(10)").textContent = people.Movil;
            fila.querySelector("td:nth-child(11)").textContent = people.Email;
            fila.querySelector("td:nth-child(12)").textContent = people.Edad;
            fila.querySelector("td:nth-child(13)").textContent = people.Datos_Adicionales;
            fila.querySelector("td:nth-child(14)").textContent = people.Nombre_Titular_banco;
            fila.querySelector("td:nth-child(15)").textContent = people.Titular_Nif_Banco;
            fila.querySelector("td:nth-child(16)").textContent = people.Tipo_Cuenta_Bancaria;
            fila.querySelector("td:nth-child(17)").textContent = people.Num_Cuenta_Bancaria;
            fila.querySelector("td:nth-child(18)").textContent = people.Direccion;
            fila.querySelector("td:nth-child(19)").textContent = people.Numero_Direccion;
            fila.querySelector("td:nth-child(20)").textContent = people.Piso_Direccion;
            fila.querySelector("td:nth-child(21)").textContent = people.Extension_Direccion;
            fila.querySelector("td:nth-child(22)").textContent = people.Codigo_Postal;
            fila.querySelector("td:nth-child(23)").textContent = people.Poblacion;
            fila.querySelector("td:nth-child(24)").textContent = people.Provincia;
            fila.querySelector("td:nth-child(25)").textContent = people.Pais;
            fila.querySelector("td:nth-child(26)").textContent = people.Password;
            break;
        }
    }
}


/* NOTE: EDITAR O CREAR ELEMENTO! */
async function enviarFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    let people = obtenerPeopleFromForm();

    try {
        if (document.getElementById("enviarElemento").textContent === "Editar") {
            // Realizar solicitud de edición (PUT)
            const id = document.getElementById('id').value;
            await putAPIElements(JWT_TOKEN, "http://localhost:3000/usuarios/" + id + "", people);
            people.id = id;
            actualizarFilaTabla(people); // Actualizar los datos en la tabla
            mostrarExito("Elemento editado");
            document.getElementById("enviarElemento").innerText = "Añadir"
            let enviarElementoTopBtn = document.getElementById('crudAddElementToggleButton');
            enviarElementoTopBtn.innerHTML = '<i class="fa fa-eye"></i> Mostrar/Ocultar menú de creación'

        } else {
            // Realizar solicitud de creación (POST)
            const peopleObtained = JSON.parse(await postAPIElements(JWT_TOKEN, "http://localhost:3000/usuarios", people));
            if (!document.querySelector('table tbody')) { // first elemennt added
                generateTable()
            } else {
                addElementToTable(peopleObtained); // Agregar una nueva fila a la tabla
            }
        }
        document.getElementById("formularioPeople").reset();
    } catch (error) {
        mostrarError(error)
    }
}


function obtenerPeopleFromForm() {
    // Obtener los valores de los campos del formulario
    const people = {
        "Fecha_Nacimiento": document.getElementById('fecha_nacimiento').value,
        "Nacionalidad": document.getElementById('nacionalidad').value,
        "Sexo": document.getElementById('sexo').value,
        "Tipo_Ident": document.getElementById('tipo_ident').value,
        "Identificacion": document.getElementById('identificacion').value,
        "Nombre": document.getElementById('nombre').value,
        "Apellido1": document.getElementById('apellido1').value,
        "Apellido2": document.getElementById('apellido2').value,
        "Movil": document.getElementById('movil').value,
        "Email": document.getElementById('email').value,
        "Edad": document.getElementById('edad').value,
        "Datos_Adicionales": document.getElementById('datos_adicionales').value,
        "Nombre_Titular_Banco": document.getElementById('nombre_titular_banco').value,
        "Titular_Nif_Banco": document.getElementById('titular_nif_banco').value,
        "Tipo_Cuenta_Bancaria": document.getElementById('tipo_cuenta_bancaria').value,
        "Num_Cuenta_Bancaria": document.getElementById('num_cuenta_bancaria').value,
        "Direccion": document.getElementById('direccion').value,
        "Numero_Direccion": document.getElementById('numero_direccion').value,
        "Piso_Direccion": document.getElementById('piso_direccion').value,
        "Extension_Direccion": document.getElementById('extension_direccion').value,
        "Codigo_Postal": document.getElementById('codigo_postal').value,
        "Poblacion": document.getElementById('poblacion').value,
        "Provincia": document.getElementById('provincia').value,
        "Pais": document.getElementById('pais').value,
        "Password": document.getElementById('password').value

    };

    return people;

}



// ------MAIN------ //
document.addEventListener("DOMContentLoaded", function () {
    let timer = setInterval(function () {
        // Verificar si estás en la ruta /crud
        if (window.location.pathname === '/crud') {
            // Ejecutar el código específico para la ruta /crud
            console.log('Estás en la ruta /crud');
            clearInterval(timer);

            JWT_TOKEN = localStorage.getItem('token');




            let closeModalButton = document.getElementById("closeModalButton");


            closeModalButton.addEventListener("click", function () {
                document.getElementById("myModal").style.display = "none";
            });

            // Cerrar el pop-up al hacer clic fuera de él
            window.addEventListener("click", function (event) {
                if (event.target == document.getElementById("myModal")) {
                    document.getElementById("myModal").style.display = "none";
                }
            })


            if (!JWT_TOKEN) {
                mostrarError("No estás logeado");
            }
            document.getElementById('formularioPeople').addEventListener('submit', enviarFormulario);
            generateTable()

            let formularioContainer = document.getElementById('crudFormularioContainer');
            let toggleButton = document.getElementById('crudAddElementToggleButton');
            const enviarElemento = document.getElementById('enviarElemento');

            enviarElemento.addEventListener('click', function () {
                formularioContainer.style.display = 'none';
            });

            document.getElementById('reset-to-post').addEventListener('click', () => {
                document.getElementById('formularioPeople').reset();
                document.getElementById("enviarElemento").innerText = "Añadir"
                let enviarElementoTopBtn = document.getElementById('crudAddElementToggleButton');
                enviarElementoTopBtn.innerHTML = '<i class="fa fa-eye"></i> Mostrar/Ocultar menú de creación'
                document.getElementById('id').value = ""
            })


            toggleButton.addEventListener('click', function () {
                if (formularioContainer.style.display === 'none') {
                    formularioContainer.style.display = 'block';

                } else {
                    formularioContainer.style.display = 'none';
                }
            });



        }
    }, 500);
});
