// Obtener el formulario y las grillas
const form = document.getElementById("form-libro");
const inputTitulo = document.getElementById("titulo");
const inputAutor = document.getElementById("autor");
const inputCategoria = document.getElementById("categoria");

// Cargar libros desde localStorage al iniciar
document.addEventListener("DOMContentLoaded", cargarLibros);

// Manejar el envío del formulario
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const categoria = inputCategoria.value;
    const archivoImagen = document.getElementById("imagen").files[0];
  
    if (!titulo || !autor || !categoria || !archivoImagen) {
      alert("Completá todos los campos");
      return;
    }
  
    const lector = new FileReader();
    lector.onload = function () {
      const imagenBase64 = lector.result;
  
      const nuevoLibro = {
        id: Date.now(),
        titulo,
        autor,
        categoria,
        imagen: imagenBase64
      };
  
      const libros = obtenerLibros();
      libros.push(nuevoLibro);
      localStorage.setItem("libros", JSON.stringify(libros));
  
      agregarLibroACard(nuevoLibro);
      form.reset();
    };
  
    lector.readAsDataURL(archivoImagen);
  });
  

// Obtener libros del localStorage
function obtenerLibros() {
  return JSON.parse(localStorage.getItem("libros")) || [];
}

// Renderizar todos los libros al cargar
function cargarLibros() {
  const libros = obtenerLibros();
  libros.forEach(agregarLibroACard);
}

// Agregar un libro a la sección correcta como una card de Bootstrap
function agregarLibroACard(libro) {
  const grilla = document.getElementById(`grilla-${libro.categoria}`);
  const columna = document.createElement("div");
  columna.className = "col-md-4 mb-3";

  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `
  <img src="${libro.imagen}" class="card-img-top" alt="${libro.titulo}">
  <div class="card-body">
    <h5 class="card-title">${libro.titulo}</h5>
    <h6 class="card-subtitle mb-2 text-muted">${libro.autor}</h6>
    <p class="card-text">Categoría: ${libro.categoria}</p>
    <button class="btn btn-sm btn-outline-primary me-2">Editar</button>
    <button class="btn btn-sm btn-outline-danger">Eliminar</button>
  </div>
`;


  // Botones
  const botonEditar = card.querySelector(".btn-outline-primary");
  const botonEliminar = card.querySelector(".btn-outline-danger");

  // Eliminar libro
  botonEliminar.addEventListener("click", () => {
    const libros = obtenerLibros().filter((l) => l.id !== libro.id);
    localStorage.setItem("libros", JSON.stringify(libros));
    columna.remove();
  });

  // Editar libro
  botonEditar.addEventListener("click", () => {
    const nuevoTitulo = prompt("Nuevo título:", libro.titulo);
    const nuevoAutor = prompt("Nuevo autor:", libro.autor);
    if (nuevoTitulo && nuevoAutor) {
      libro.titulo = nuevoTitulo;
      libro.autor = nuevoAutor;

      // Actualizar en localStorage
      const libros = obtenerLibros().map((l) =>
        l.id === libro.id ? libro : l
      );
      localStorage.setItem("libros", JSON.stringify(libros));

      // Actualizar en pantalla
      card.querySelector(".card-title").textContent = nuevoTitulo;
      card.querySelector(".card-subtitle").textContent = nuevoAutor;
    }
  });

  columna.appendChild(card);
  grilla.appendChild(columna);
}
