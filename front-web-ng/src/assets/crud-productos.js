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



// Función para eliminar una producto
async function eliminarElemento(id) {
    const remove_path = "http://localhost:3000/productos/" + id;
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
        const producto = JSON.parse(await getAPIElements(JWT_TOKEN, "http://localhost:3000/productos"));
        generateTableHTML(document.getElementById("tabla-container"), producto)
    } catch (error) {
        mostrarError(error)
    }
}

// Función para editar una producto // NOTE: EDIT
async function editElemento(id) {
    document.getElementById('formularioProducto').reset();
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
        document.getElementById("nombre").value = filaElemento.cells[1].textContent;
        document.getElementById("descripcion").value = filaElemento.cells[2].textContent;
        document.getElementById("precio").value = filaElemento.cells[3].textContent;
        document.getElementById("categoria").value = filaElemento.cells[4].textContent;
        document.getElementById("stock").value = filaElemento.cells[5].textContent;
        document.getElementById("marca").value = filaElemento.cells[6].textContent;
        document.getElementById("modelo").value = filaElemento.cells[7].textContent;
        document.getElementById("fabricante").value = filaElemento.cells[8].textContent;
        document.getElementById("color").value = filaElemento.cells[9].textContent;
        document.getElementById("peso").value = filaElemento.cells[10].textContent;
        document.getElementById("dimensiones").value = filaElemento.cells[11].textContent;
        document.getElementById("material").value = filaElemento.cells[12].textContent;
        document.getElementById("garantia").value = filaElemento.cells[13].textContent;
        document.getElementById("envio").value = filaElemento.cells[14].textContent;



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
function actualizarFilaTabla(producto) {
    let filas = document.querySelectorAll("table tbody tr");
    for (let i = 0; i < filas.length; i++) {
        let fila = filas[i];
        let elementoId = fila.querySelector("td:first-child").textContent;

        if (parseInt(elementoId) === parseInt(producto.id)) {
            fila.querySelector("td:nth-child(2)").textContent = producto.Nombre;
            fila.querySelector("td:nth-child(3)").textContent = producto.Descripcion;
            fila.querySelector("td:nth-child(4)").textContent = producto.Precio;
            fila.querySelector("td:nth-child(5)").textContent = producto.Categoria;
            fila.querySelector("td:nth-child(6)").textContent = producto.Stock;
            fila.querySelector("td:nth-child(7)").textContent = producto.Marca;
            fila.querySelector("td:nth-child(8)").textContent = producto.Modelo;
            fila.querySelector("td:nth-child(9)").textContent = producto.Fabricante;
            fila.querySelector("td:nth-child(10)").textContent = producto.Color;
            fila.querySelector("td:nth-child(11)").textContent = producto.Peso;
            fila.querySelector("td:nth-child(12)").textContent = producto.Dimensiones;
            fila.querySelector("td:nth-child(13)").textContent = producto.Material;
            fila.querySelector("td:nth-child(14)").textContent = producto.Garantia;
            fila.querySelector("td:nth-child(15)").textContent = producto.Envio;

            break;
        }
    }
}


/* NOTE: EDITAR O CREAR ELEMENTO! */
async function enviarFormulario(event) {
    event.preventDefault(); // Evita que el formulario se envíe automáticamente

    let producto = obtenerProductoFromForm();

    try {
        if (document.getElementById("enviarElemento").textContent === "Editar") {
            // Realizar solicitud de edición (PUT)
            const id = document.getElementById('id').value;
            await putAPIElements(JWT_TOKEN, "http://localhost:3000/productos/" + id + "", producto);
            producto.id = id;
            actualizarFilaTabla(producto); // Actualizar los datos en la tabla
            mostrarExito("Elemento editado");
            document.getElementById("enviarElemento").innerText = "Añadir"
            let enviarElementoTopBtn = document.getElementById('crudAddElementToggleButton');
            enviarElementoTopBtn.innerHTML = '<i class="fa fa-eye"></i> Mostrar/Ocultar menú de creación'

        } else {
            // Realizar solicitud de creación (POST)
            const productoObtained = JSON.parse(await postAPIElements(JWT_TOKEN, "http://localhost:3000/productos", producto));
            if (!document.querySelector('table tbody')) { // first elemennt added
                generateTable()
            } else {
                addElementToTable(productoObtained); // Agregar una nueva fila a la tabla
            }
        }
        document.getElementById("formularioProducto").reset();
    } catch (error) {
        mostrarError(error)
    }
}


function obtenerProductoFromForm() {
    // Obtener los valores de los campos del formulario
    const producto = {
        "Nombre": document.getElementById('nombre').value,
        "Descripcion": document.getElementById('descripcion').value,
        "Precio": document.getElementById('precio').value,
        "Categoria": document.getElementById('categoria').value,
        "Stock": document.getElementById('stock').value,
        "Marca": document.getElementById('marca').value,
        "Modelo": document.getElementById('modelo').value,
        "Fabricante": document.getElementById('fabricante').value,
        "Color": document.getElementById('color').value,
        "Peso": document.getElementById('peso').value,
        "Dimensiones": document.getElementById('dimensiones').value,
        "Material": document.getElementById('material').value,
        "Garantia": document.getElementById('garantia').value,
        "Envio": document.getElementById('envio').value
    };


    return producto;

}



// ------MAIN------ //
document.addEventListener("DOMContentLoaded", function () {
    let timer = setInterval(function () {
        // Verificar si estás en la ruta /crud
        if (window.location.pathname === '/crud-productos') {
            // Ejecutar el código específico para la ruta /crud
            console.log('Estás en la ruta /crud-productos');
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
            document.getElementById('formularioProducto').addEventListener('submit', enviarFormulario);
            generateTable()

            let formularioContainer = document.getElementById('crudFormularioContainer');
            let toggleButton = document.getElementById('crudAddElementToggleButton');
            const enviarElemento = document.getElementById('enviarElemento');

            enviarElemento.addEventListener('click', function () {
                formularioContainer.style.display = 'none';
            });

            document.getElementById('reset-to-post').addEventListener('click', () => {
                document.getElementById('formularioProducto').reset();
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
