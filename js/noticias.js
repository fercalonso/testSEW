class Noticias {
  constructor(selector) {
    this.$seccion = $(selector);
    this.feedRSS = "https://www.europapress.es/rss/rss.aspx?ch=00268";
    this.urlRSS = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(
      this.feedRSS
    )}`;
    this.cargarNoticias();
  }

  cargarNoticias() {
    $.getJSON(this.urlRSS, (data) => {
      if (!data || !data.items) return;

      const noticias = data.items.slice(0, 5);
      const $contenedor = $("<section></section>");
      $contenedor.append(
        "<h2>Últimas Noticias cercanas a Grado y Asturias</h2>"
      );

      noticias.forEach((noticia) => {
        const $articulo = $("<article></article>");
        $articulo.append(
          `<h3><a href="${noticia.link}" target="_blank">${noticia.title}</a></h3>`,
          `<p>${noticia.description}</p>`
        );
        $contenedor.append($articulo);
      });

      this.$seccion.append($contenedor);
    }).fail(() => {
      this.$seccion.append("<p>No se pudieron cargar las noticias.</p>");
    });
  }
}

// Inicializar la clase una vez que el documento esté listo
$(document).ready(function () {
  new Noticias("main > section");
});
