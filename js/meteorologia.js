class MeteoApp {
  constructor() {
    this.seccion = $("main > section");
    this.apiKey = "2775f43ac6e81621ce7fede6f8048d4c";
    this.url = `https://api.openweathermap.org/data/2.5/forecast?q=Grado&lang=es&units=metric&mode=xml&appid=${this.apiKey}`;
  }

  iniciar() {
    this.obtenerDatos();
  }

  obtenerDatos() {
    $.ajax({
      url: this.url,
      method: "GET",
      dataType: "xml",
      success: (data) => this.procesarDatos(data),
      error: () => this.mostrarError(),
    });
  }

  procesarDatos(data) {
    const contenido = [];

    // === Tiempo actual ===
    const primerTime = $(data).find("time").first();
    const temp = primerTime.find("temperature").attr("value");
    const clima = primerTime.find("symbol").attr("name");
    const icono = primerTime.find("symbol").attr("var");
    const humedad = primerTime.find("humidity").attr("value");
    const viento = primerTime.find("windSpeed").attr("mps");
    const lluvia = primerTime.find("precipitation").attr("value") || "0";

    contenido.push(`<h2>Información Meteorológica</h2>`);

    contenido.push(`
      <article>
        <h3>Tiempo Actual en Grado</h3>
        <p>Temperatura: ${temp}°C</p>
        <p>Clima: ${clima}</p>
        <img src="https://openweathermap.org/img/wn/${icono}.png" alt="${clima}">
        <p>Humedad: ${humedad}%</p>
        <p>Viento: ${viento} m/s</p>
        <p>Precipitación: ${lluvia} mm</p>
      </article>
    `);

    // === Previsión próximos 7 días ===
    contenido.push(`<h2>Previsión para los Próximos 7 Días</h2>`);

    const bloquesTiempo = $(data).find("time");
    const diasMostrados = new Set();
    const hoy = new Date().toISOString().split("T")[0];

    bloquesTiempo.each((_, elemento) => {
      const fecha = $(elemento).attr("from").split("T")[0];

      if (fecha > hoy && !diasMostrados.has(fecha) && diasMostrados.size < 7) {
        diasMostrados.add(fecha);

        const tempMax =
          $(elemento).find("temperature").attr("max") ||
          $(elemento).find("temperature").attr("value");
        const tempMin = $(elemento).find("temperature").attr("min") || tempMax;
        const clima = $(elemento).find("symbol").attr("name");
        const icono = $(elemento).find("symbol").attr("var");
        const lluvia = $(elemento).find("precipitation").attr("value") || "0";

        contenido.push(`
          <article>
            <h3>${fecha}</h3>
            <p>Temperatura máxima: ${tempMax}°C</p>
            <p>Temperatura mínima: ${tempMin}°C</p>
            <p>Clima: ${clima}</p>
            <img src="https://openweathermap.org/img/wn/${icono}.png" alt="${clima}">
            <p>Precipitación: ${lluvia} mm</p>
          </article>
        `);
      }
    });

    this.seccion.html(contenido.join(""));
  }

  mostrarError() {
    this.seccion.html(`
      <h2>Error</h2>
      <p>No se pudieron cargar los datos meteorológicos.</p>
    `);
  }
}

// Inicialización
$(document).ready(function () {
  const app = new MeteoApp();
  app.iniciar();
});
