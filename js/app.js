// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#agregar ul');


// Eventos
eventListener();
function eventListener(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto); 
}

// Classes
class Presupuesto{
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto); 
    this.restante = Number(presupuesto);
    this.gastos = [];

  }
  nuevoGasto(gasto){
    this.gastos = [...this.gastos, gasto]; 
    this.calcularRestante(); 
}

  calcularRestante(){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad,0);
    this.restante = this.presupuesto - gastado; 
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto => gasto.id !== id); 
   this.calcularRestante();
  }
}
class UI{
    insertarPresupuesto(cantidad){
        // Exrayendo los valores
        const {presupuesto, restante} = cantidad;
        
        // Agrergar al HTML
        document.querySelector('#total').textContent = presupuesto; 
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo){
      // crear el div
      const divMensaje = document.createElement('div'); 
      divMensaje.classList.add('text-center', 'alert'); 

      if(tipo === 'error'){
        divMensaje.classList.add('alert-danger'); 
      }else{
        divMensaje.classList.add('alert-success');
      }

      //Mensaje de error
      divMensaje.textContent = mensaje;
      
      //Insertar en el HTML
    document.querySelector('.primario').insertBefore(divMensaje, formulario); 

    // Quitar del HTML
    setTimeout(() =>{
      divMensaje.remove(); 
    },3000);

    }
    mostrarGastos(gastos){
    this.limpiarHTML();// elimina el html previo
        const gastoListado = document.querySelector('#gastos ul'); // Selecciona el UL correcto

        if (!gastoListado) {
            console.error('El contenedor para los gastos no se encontró.');
            return;
        }
        
        //Itera sobre los gastos
        gastos.forEach(gasto => {
        
            const {cantidad, nombre, id} = gasto;
           
            // Crear un LI
           const nuevoGasto = document.createElement('li');
           nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
          // nuevoGasto.setAttribute('data-id', 'id');
           nuevoGasto.dataset.id = id; 

           // Agregar el HTML del gasto
           nuevoGasto.innerHTML = `${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad}</span>
           
           `;

           //boton para borrar el gasto
           const btnBorrar = document.createElement('button'); 
           btnBorrar.classList.add('btn','btn-danger', 'borrar-gasto'); 
           btnBorrar.textContent = 'Borrar';
           btnBorrar.onclick = () => {
            eliminarGasto(id); 
           }
           nuevoGasto.appendChild(btnBorrar); 

           //agregar el HTML
           gastoListado.appendChild(nuevoGasto); 
        })
      }

      limpiarHTML(){
        const gastoListado = document.querySelector('#gastos ul'); 
        if (!gastoListado) {
            console.error('El contenedor para los gastos no se encontró.');
            return;  // Si no existe, no hace nada
        }
    
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }
    comprobarPresupuesto(presupuestoObj){
        const {presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
       
        // Comprobar 25%
        if((presupuesto /4) > restante){
         restanteDiv.classList.remove('alert-success', 'alert-warning');
         restanteDiv.classList.add('alert-danger');
   
        }else if ((presupuesto / 2) > restante){
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        }else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }
      // Si el total es 0 o menor
if (restante <= 0) {
    ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
   formulario.querySelector('button[type="submit"]').disabled = true // Deshabilitar el botón correctamente  
  }
 }
}

// Instanciar
const ui = new UI();
let presupuesto;

// Funciones
function preguntarPresupuesto(){
    const  presupuestoUsuario = prompt('¿Cuál es tú presupuesto?'); 
  //  console.log(Number(presupuestoUsuario)); 

    if(presupuestoUsuario === '' || presupuestoUsuario === null 
        || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload(); 
    }

    presupuesto = new Presupuesto(presupuestoUsuario);  
    ui.insertarPresupuesto(presupuesto);
}

// Añade gastos
function agregarGasto(e){
    e.preventDefault();

    //Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    //Validar 
    if(nombre === '' || cantidad === ''){
     ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
     return; 
    }else if(cantidad <= 0 || isNaN(cantidad)){
     ui.imprimirAlerta('Cantidad no válida', 'error');
     return; 
    } 
   //Generar un objeto con el gasto
   // es lo contrario al destruccion une
   const gasto = {nombre, cantidad, id: Date.now()}

   //añade un nuevo gasto
   presupuesto.nuevoGasto(gasto); 

   // mensaje de todo bien!
   ui.imprimirAlerta('Gasto agregado correctamente');
   
   //imprimir los gastos
   const {gastos, restante } = presupuesto; 
   ui.mostrarGastos(gastos); 
   ui.actualizarRestante(restante);
   ui.comprobarPresupuesto(presupuesto);
   
   //Reinicia formulario
   formulario.reset();
}

function eliminarGasto(id){
// elimina del objeto
    presupuesto.eliminarGasto(id);

// elimina los gastos del HTML
    const {gastos,restante} = presupuesto; 
    ui.mostrarGastos(gastos); 
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
    }