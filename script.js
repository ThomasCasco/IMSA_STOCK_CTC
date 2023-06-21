var inventario;

function cargarInventario() {
  var inventarioGuardado = localStorage.getItem("inventario");
  inventario = inventarioGuardado ? JSON.parse(inventarioGuardado) : [];

  if (inventario.length === 0) {
    inventario = [
      { tipo: "KRAFT", medida: "7X0.67/68", stock: 39.6, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "KRAFT", medida: "7X0.41", stock: 4.8, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "KRAFT", medida: "7X0.61/62", stock: 4, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "KRAFT", medida: "7X0.70/71", stock: 5.6, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "TERMO", medida: "7X0.70/71", stock: 105.1, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "TERMO", medida: "7X0.67", stock: 24.4, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "TERMO", medida: "7X0.51", stock: 22.5, ubicacion: "FILA:4 COLUMNA: H" },
      { tipo: "DENNISON 22HCC", medida: "7X0.46/51", stock: 65.2, ubicacion: "FILA:4 COLUMNA: G" },
      { tipo: "DENNISON 22HCC", medida: "7X0.65/69", stock: 35.3, ubicacion: "FILA:4 COLUMNA: G" },
      { tipo: "DENNISON 22HCC", medida: "7X0.70/75", stock: 52.9, ubicacion: "FILA:4 COLUMNA: G" }
    ];
  }
}

function guardarInventario() {
  localStorage.setItem("inventario", JSON.stringify(inventario));
}

function mostrarTipos() {
  var medida = document.getElementById("medida").value;
  var tipos = inventario.filter(function (item) {
    return item.medida === medida;
  });

  var tiposDiv = document.getElementById("tipos");
  tiposDiv.innerHTML = "";

  var tipoSelect = document.getElementById("tipo");
  tipoSelect.innerHTML = "";

  if (tipos.length > 0) {
    tiposDiv.innerHTML = "<p>Tipos disponibles:</p>";

    for (var i = 0; i < tipos.length; i++) {
      var tipo = tipos[i];
      var tipoInfo = document.createElement("p");
      tipoInfo.textContent = tipo.tipo + " (Ubicación: " + tipo.ubicacion + ") - Stock: " + tipo.stock.toFixed(2) + " kg";

      tipoInfo.addEventListener("click", function (tipo) {
        return function () {
          document.getElementById("tipo").value = tipo.tipo;
        };
      }(tipo));

      tiposDiv.appendChild(tipoInfo);

      var tipoOption = document.createElement("option");
      tipoOption.value = tipo.tipo;
      tipoOption.textContent = tipo.tipo + " (Ubicación: " + tipo.ubicacion + ") - Stock: " + tipo.stock.toFixed(2) + " kg";

      tipoSelect.appendChild(tipoOption);
    }
  } else {
    tiposDiv.innerHTML = "<p>No hay tipos disponibles para esta medida.</p>";
  }
}

function consumirPapel() {
  var tipo = document.getElementById("tipo").value;
  var medida = document.getElementById("medida").value;
  var cantidad = parseInt(document.getElementById("cantidad").value);

  if (isNaN(cantidad) || cantidad <= 0) {
    alert("Por favor, introduce una cantidad válida.");
    return;
  }

  var papel = inventario.find(function (item) {
    return item.tipo === tipo && item.medida === medida;
  });

  if (papel) {
    if (papel.stock >= cantidad) {
      papel.stock -= cantidad;
      mostrarStock();
      guardarInventario();
    } else {
      alert("No hay suficiente stock disponible.");
    }
  } else {
    alert("Tipo de papel no válido para la medida seleccionada.");
  }
}

function mostrarStock() {
  var stockDiv = document.getElementById("stock");
  stockDiv.innerHTML = "";

  for (var i = 0; i < inventario.length; i++) {
    var item = inventario[i];
    var stockInfo = document.createElement("p");
    stockInfo.textContent = item.tipo + " (Medida: " + item.medida + ") - Stock: " + item.stock.toFixed(2) + " kg";

    var stockColorDiv = document.createElement("div");
    stockColorDiv.classList.add("stock-color");

    var stockVerdeDiv = document.createElement("div");
    stockVerdeDiv.classList.add("stock-indicador", "stock-verde");
    if (item.stock >= 100) {
      stockVerdeDiv.classList.add("active");
    }

    var stockAmarilloDiv = document.createElement("div");
    stockAmarilloDiv.classList.add("stock-indicador", "stock-amarillo");
    if (item.stock >= 50 && item.stock < 100) {
      stockAmarilloDiv.classList.add("active");
    }

    var stockRojoDiv = document.createElement("div");
    stockRojoDiv.classList.add("stock-indicador", "stock-rojo");
    if (item.stock < 50) {
      stockRojoDiv.classList.add("active");
    }

    stockColorDiv.appendChild(stockVerdeDiv);
    stockColorDiv.appendChild(stockAmarilloDiv);
    stockColorDiv.appendChild(stockRojoDiv);

    stockInfo.appendChild(stockColorDiv);

    stockDiv.appendChild(stockInfo);
  }
}


function mostrarFormulario() {
  var formularioDiv = document.getElementById("formulario");
  formularioDiv.style.display = "block";

  // Agregar autocompletado a los campos de formulario
  var tipos = inventario.map(function(item) {
    return item.tipo;
  });

  $("#tipo-agregar").autocomplete({
    source: tipos
  });

  var medidas = inventario.map(function(item) {
    return item.medida;
  });

  $("#medida-agregar").autocomplete({
    source: medidas
  });
}


function cancelarAgregar() {
  var formularioDiv = document.getElementById("formulario");
  formularioDiv.style.display = "none";
}

function agregarStock() {
  var tipo = document.getElementById("tipo-agregar").value;
  var medida = document.getElementById("medida-agregar").value;
  var stock = parseInt(document.getElementById("stock-agregar").value);
  var ubicacion = document.getElementById("ubicacion-agregar").value;

  if (isNaN(stock) || stock <= 0) {
    alert("Por favor, introduce una cantidad válida.");
    return;
  }

  var papel = inventario.find(function (item) {
    return item.tipo === tipo && item.medida === medida;
  });

  if (papel) {
    papel.stock += stock;
  } else {
    inventario.push({ tipo: tipo, medida: medida, stock: stock, ubicacion: ubicacion });
  }

  mostrarStock();
  guardarInventario();
  cancelarAgregar();
}

$(function() {
  var medidas = inventario.map(function(item) {
    return item.medida;
  });

  $("#medida").autocomplete({
    source: medidas
  });
});

cargarInventario();
mostrarStock();
