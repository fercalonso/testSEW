class Carrusel {
  constructor(selector, imagenes) {
    this.$seccion = $(selector);
    this.imagenes = imagenes;
    this.indice = 0;
    this.inicializar();
  }

  inicializar() {
    const $article = $("<article></article>");
    $article.append("<h2>Carrusel de Imágenes</h2>");

    const $img = $("<img>")
      .attr("src", this.imagenes[this.indice])
      .attr("alt", "Imagen turística");

    const $botonAnterior = $("<button>⟨</button>").on("click", () =>
      this.anterior()
    );
    const $botonSiguiente = $("<button>⟩</button>").on("click", () =>
      this.siguiente()
    );

    $article.append($botonAnterior, $img, $botonSiguiente);
    this.$seccion.append($article);
    this.$img = $img;
  }

  anterior() {
    this.indice =
      (this.indice - 1 + this.imagenes.length) % this.imagenes.length;
    this.actualizarImagen();
  }

  siguiente() {
    this.indice = (this.indice + 1) % this.imagenes.length;
    this.actualizarImagen();
  }

  actualizarImagen() {
    this.$img.attr("src", this.imagenes[this.indice]);
  }
}

$(document).ready(function () {
  const imagenes = [
    "multimedia/imagenes/mapa_grado.jpeg",
    "multimedia/imagenes/mercado.webp",
    "multimedia/imagenes/ayuntamiento.png",
    "multimedia/imagenes/parque_san_antonio.jpg",
    "multimedia/imagenes/casa_arcos.jpg",
  ];

  new Carrusel("main > section", imagenes);
});
