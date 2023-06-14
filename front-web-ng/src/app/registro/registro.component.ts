import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {
  username: string | undefined;
  email: string | undefined;
  password: string | undefined;

  constructor(private http: HttpClient) { }

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

  submitRegistro() {
    const registroData = {
      nombre: this.username,
      email: this.email,
      password: this.password
    };



    // Realizar la petición HTTP al endpoint de registro en la API
    this.http.post<any>('http://localhost:3000/registro', registroData).subscribe(
      response => {
        // Manejar la respuesta del servidor
        console.log('Registro exitoso');
        window.location.href = '/login';


      },
      error => {
        console.error('Error al realizar el registro:', error);
        this.mostrarError("Error con la conexión");
        // ...
      }
    );
  }
}
