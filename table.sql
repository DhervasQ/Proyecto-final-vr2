CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Fecha_Nacimiento VARCHAR(64),
    Nacionalidad VARCHAR(50),
    Sexo VARCHAR(20),
    Tipo_Ident VARCHAR(20),
    Identificacion VARCHAR(20),
    Nombre VARCHAR(50),
    Apellido1 VARCHAR(50),
    Apellido2 VARCHAR(50),
    Movil VARCHAR(20),
    Email VARCHAR(50),
    Edad INT,
    Datos_Adicionales TEXT,
    Nombre_Titular_Banco VARCHAR(100),
    Titular_Nif_Banco VARCHAR(20),
    Tipo_Cuenta_Bancaria VARCHAR(50),
    Num_Cuenta_Bancaria VARCHAR(50),
    Direccion VARCHAR(100),
    Numero_Direccion VARCHAR(10),
    Piso_Direccion VARCHAR(10),
    Extension_Direccion VARCHAR(10),
    Codigo_Postal VARCHAR(20),
    Poblacion VARCHAR(50),
    Provincia VARCHAR(50),
    Pais VARCHAR(50),
    Password VARCHAR(128)
);

