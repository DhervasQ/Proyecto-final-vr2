import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Agrega esta línea
import { BrowserModule } from '@angular/platform-browser';
import { CrudComponent } from './crud/crud.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MainComponent } from './main/main.component';
import { NgModule } from '@angular/core';
import { RegistroComponent } from './registro/registro.component';
import { NavbarComponent } from './navbar/navbar.component';
import { LogoutComponent } from './logout/logout.component';
import { CrudProductosComponent } from './crud-productos/crud-productos.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistroComponent,
    CrudComponent,
    MainComponent,
    NavbarComponent,
    LogoutComponent,
    CrudProductosComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule // Agrega esta línea

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
