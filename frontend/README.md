### Comando con el que se ha inicializado la app

>npx create-react-app name --template typescript

### Forma de utilizar el github+
Para crear el repo y hacer la primera actualizacion
>git init -b master

>git add .

>git commit -m "mensaje"

>git remote add origin  hettps://githab.com..........

>git push origin master

Para actualizar cambios
>git add .

>git commit -m "mensaje"

>git push origin master


## Librerias necesarias 
>npm install react-router-dom react-firebase-hooks
>npm install firebase --save

### Control de sesion y variables que utilizo
+ He creado un estado LOGGED con un contexto global , que se inicializa con false y se puede poner a true en el login si este pasa el la verificacion de credenciales.

+ He guardado los datos de sesion en el almacenamiento local.

+ A la hora de utilizar renderizados condicionales vamosa  mirar ese estado LOGGED.

### REDUX

>npm i -S redux
Normalmente también vas a querer usar la conexión a React y las herramientas de desarrollo.
>npm i -S react-redux
>npm i -D redux-devtools
>npm i redux-persist

### BOOTSTRAP ,esto para menu desplegabe
>npm i react-bootstrap
>npm i bootstrap

### ICONOS
>npm install react-icons --save


### Notas a tener en cuenta y mejoras
#### Front-end features
+ Con el tema de cargar listas , por ejemplo la de los profesores , tengo que ver como hacerlo de forma modular, es decir pedir por ejemplo los 10 primeros profes , y  dividir el contenido en cuenta 

#### Back-end features
+ Debo definir un enum con todos los popsibles campos que se pueden pedir en la funcion getBy, algo parecido al By. de selenium para acotar  las opciones por las que podemos buscar algo . 

### General features
+ Tanto en el front como en el back tengo que pensar algo para unificar las rutas de la API , no es nada elegante ir ponienodlas de una en una , ademas de que me puedo equivocar con el nombre.

+ Tengo que conseguir que la sesion se cancele por tiempo y que se borre el store cuando se detecte este tipo de situacion.

+ Debo de definir tambien los codigos de las respuestas del API dentro de un ENUM , es mucho mas limpio , por ejemplo en la parte de registro lo tengo puesto a mano que es una guarreria.

## Check out ultimo dia 25/02/23
+ He conseguido añadir redux y es muy muy interesante , por fin voy a poder quitar las variables y las props y toda las mierdas de estado , y concentrarlos en un solo sitio.