import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mail: string | undefined;
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

  submitLogin() {
    const loginData = {
      email: this.mail,
      password: this.password
    };

    // Realizar la petición HTTP al endpoint de login en la API
    this.http.post<any>('http://localhost:3000/login', loginData).subscribe(
      response => {
        // Manejar la respuesta del servidor
        const token = response.token; // Obtener el token del objeto de respuesta

        // Guardar el token en el almacenamiento local o en una cookie (según tus necesidades)
        localStorage.setItem('token', token);

        window.location.href = '/crud';
      },
      error => {
        console.error('Error al realizar el login:', error);
        this.mostrarError("Credenciales incorrectas")
        // Mostrar un mensaje de error al usuario o realizar cualquier otra acción necesaria
        // ...
      }
    );
  }
}
