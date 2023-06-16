import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crud',
  templateUrl: './crud-productos.component.html',
  styleUrls: ['./crud-productos.component.css']
})
export class CrudProductosComponent implements OnInit {


  mostrarError(error: string) {
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
    let elm = alertElement.querySelector(".close-error-dspl");
    // Agregar el evento para cerrar la alerta
    if (elm !== null) {
      elm.addEventListener("click", function () {
        alertElement.remove();
      });
    }
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');;

    if (!token) {
      this.mostrarError("Debes logearte para acceder a ésta página")
    }
  }






}
