class Pregunta {
  constructor(texto, opciones, correcta) {
    this.texto = texto;
    this.opciones = opciones;
    this.correcta = correcta;
  }

  esCorrecta(indiceSeleccionado) {
    return this.correcta === indiceSeleccionado;
  }
}

class JuegoTest {
  constructor(preguntas) {
    this.preguntas = preguntas;
    this.respuestas = new Array(preguntas.length).fill(null);
    this.$contenedor = $("section").last(); // Apunta al último <section>
    this.renderizarPreguntas();
  }

  renderizarPreguntas() {
    const $form = $("<form></form>");

    this.preguntas.forEach((pregunta, i) => {
      const $fieldset = $("<fieldset></fieldset>");
      $fieldset.append(`<legend>${i + 1}. ${pregunta.texto}</legend>`);

      pregunta.opciones.forEach((opcion, j) => {
        const id = `pregunta-${i}-opcion-${j}`;

        const $input = $(
          `<input type="radio" id="${id}" name="pregunta-${i}" value="${j}">`
        );
        const $label = $(`<label for="${id}">${opcion}</label>`);

        $fieldset.append($input, $label, "<br>");
      });

      $form.append($fieldset);
    });

    const $boton = $('<button type="submit">Enviar respuestas</button>');
    $form.append($boton);
    this.$contenedor.append($form);

    $form.on("submit", (e) => {
      e.preventDefault();
      this.obtenerRespuestas();
      if (this.validarRespuestas()) {
        this.mostrarResultado();
      } else {
        alert("Por favor, responde todas las preguntas antes de enviar.");
      }
    });
  }

  obtenerRespuestas() {
    this.preguntas.forEach((_, i) => {
      const seleccionada = $(`input[name="pregunta-${i}"]:checked`).val();
      this.respuestas[i] =
        seleccionada !== undefined ? parseInt(seleccionada) : null;
    });
  }

  validarRespuestas() {
    return this.respuestas.every((r) => r !== null);
  }

  mostrarResultado() {
    let aciertos = 0;
    this.respuestas.forEach((respuesta, i) => {
      if (this.preguntas[i].esCorrecta(respuesta)) aciertos++;
    });

    const $resultado = $(
      `<p>Has obtenido una puntuación de ${aciertos} / ${this.preguntas.length}</p>`
    );
    this.$contenedor.append($resultado);
  }
}

$(document).ready(() => {
  const preguntas = [
    new Pregunta(
      "¿Cómo se conoce popularmente al mercado de los domingos en Grado?",
      [
        "El Mercadillo de la Pola",
        "El Mercadón",
        "El Mercado de la Villa",
        "El Rastro de Grado",
        "Feria del Domingo",
      ],
      0
    ),
    new Pregunta(
      "¿Qué tipo de museo se encuentra en Grado?",
      [
        "Museo del Ferrocarril",
        "Museo Etnográfico",
        "Museo de la Minería",
        "Museo del Azúcar",
        "Museo del Prerrománico",
      ],
      1
    ),
    new Pregunta(
      "¿Cuál es una de las fiestas más tradicionales de Grado?",
      [
        "El Carmín de La Pola",
        "El Festival de la Sidra",
        "Fiestas de Santiago y Santa Ana",
        "Fiesta de la Vendimia",
        "Romería del Alba",
      ],
      2
    ),
    new Pregunta(
      "¿Qué producto típico se elabora en la zona de Grado?",
      [
        "Queso de Cabrales",
        "Queso de Afuega’l Pitu",
        "Queso Gamonéu",
        "Queso de Tresviso",
        "Queso de Taramundi",
      ],
      1
    ),
    new Pregunta(
      "¿Qué río atraviesa el concejo de Grado?",
      ["Nalón", "Narcea", "Sella", "Eo", "Cares"],
      0
    ),
    new Pregunta(
      "¿Cuál es una parroquia perteneciente al concejo de Grado?",
      [
        "Candás",
        "San Martín de Gurullés",
        "Colunga",
        "Soto del Barco",
        "San Juan de Villapañada",
      ],
      1
    ),
    new Pregunta(
      "¿Qué elemento patrimonial es característico en las casas tradicionales de Grado?",
      [
        "Hórreo",
        "Molino hidráulico",
        "Torre defensiva",
        "Galería acristalada",
        "Corredor asturiano",
      ],
      0
    ),
    new Pregunta(
      "¿Qué nombre recibe el mercado tradicional de productos ecológicos que se celebra en Grado?",
      [
        "Mercado de San Mateo",
        "Mercado de Productos Asturianos",
        "Mercado de la Primavera",
        "Feria Verde",
        "Mercado del Alimento Sano",
      ],
      2
    ),
    new Pregunta(
      "¿Qué actividad se puede realizar en las rutas turísticas de Grado?",
      ["Esquí alpino", "Senderismo", "Surf", "Ciclismo de montaña", "Vela"],
      1
    ),
    new Pregunta(
      "¿Cuál es un edificio destacado del patrimonio arquitectónico de Grado?",
      [
        "Palacio de Valdecarzana",
        "Teatro Campoamor",
        "Universidad Laboral",
        "Castillo de Salas",
        "Palacio de Miranda-Valdecarzana",
      ],
      0
    ),
  ];

  new JuegoTest(preguntas);
});
