$(document).ready(function () {
  let map;

  function initMap(contenedorId) {
    map = new google.maps.Map(document.getElementById(contenedorId), {
      center: { lat: 43.735288306165586, lng: -6.068738 }, // Coordenadas de Grado
      zoom: 10,
    });
  }

  function loadGoogleMapsAPI() {
    return new Promise((resolve, reject) => {
      if (window.google && window.google.maps) return resolve(); // Evita cargar dos veces
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA_fXPjBnFDCe3feRXhNGbYGAxQ5ZWAdY0`;
      script.onload = () => resolve();
      script.onerror = (error) => reject(error);
      document.head.appendChild(script);
    });
  }

  // XML
  $("#xmlInput").on("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const xml = $.parseXML(e.target.result);
        const rootElement = xml.documentElement;
        let htmlContent = `<h3>Elemento raíz: ${rootElement.nodeName}</h3>`;
        htmlContent += parseXMLElement(rootElement);

        const seccion = $("<section></section>").html(htmlContent);
        $("#xmlInput").after(seccion);
      };
      reader.readAsText(file);
    }
  });

  function parseXMLElement(element) {
    let htmlContent = "<ul>";
    $(element)
      .children()
      .each(function () {
        const childName = this.nodeName;
        const childText = $(this)
          .clone()
          .children()
          .remove()
          .end()
          .text()
          .trim();
        htmlContent += `<li><strong>${childName}:</strong> ${childText}`;
        if ($(this).children().length > 0) {
          htmlContent += parseXMLElement(this);
        }
        htmlContent += "</li>";
      });
    htmlContent += "</ul>";
    return htmlContent;
  }

  // KML
  $("#kmlInput").on("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      loadGoogleMapsAPI()
        .then(() => {
          const mapaId = "mapa-kml-dinamico-" + Date.now();
          const contenedor = $(
            `<div id="${mapaId}" style="height:400px; margin-top:1em;"></div>`
          );
          $("#kmlInput").after(contenedor);

          initMap(mapaId);

          const reader = new FileReader();
          reader.onload = function (e) {
            const kml = e.target.result;
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(kml, "text/xml");
            const placemarks = kmlDoc.getElementsByTagName("Placemark");

            const colors = [
              "#FF0000",
              "#0000FF",
              "#008000",
              "#FFA500",
              "#800080",
            ];
            const bounds = new google.maps.LatLngBounds();

            for (let i = 0; i < placemarks.length; i++) {
              const placemark = placemarks[i];
              const name =
                placemark.getElementsByTagName("name")[0]?.textContent || "";
              const desc =
                placemark.getElementsByTagName("description")[0]?.textContent ||
                "";

              const point = placemark.getElementsByTagName("Point")[0];
              const line = placemark.getElementsByTagName("LineString")[0];

              if (point) {
                const coordStr = point
                  .getElementsByTagName("coordinates")[0]
                  ?.textContent.trim();
                if (coordStr) {
                  const [lng, lat] = coordStr.split(",").map(parseFloat);
                  const latLng = new google.maps.LatLng(lat, lng);

                  const marker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    title: name,
                  });

                  const infowindow = new google.maps.InfoWindow({
                    content: `<strong>${name}</strong><br>${desc}`,
                  });

                  marker.addListener("click", function () {
                    infowindow.open(map, marker);
                  });

                  bounds.extend(latLng);
                }
              } else if (line) {
                const coordStr = line
                  .getElementsByTagName("coordinates")[0]
                  ?.textContent.trim();
                if (coordStr) {
                  const coords = coordStr.split(/\s+/).map((coord) => {
                    const [lng, lat] = coord.split(",").map(parseFloat);
                    const latLng = new google.maps.LatLng(lat, lng);
                    bounds.extend(latLng);
                    return latLng;
                  });

                  const polyline = new google.maps.Polyline({
                    path: coords,
                    geodesic: true,
                    strokeColor: colors[i % colors.length],
                    strokeOpacity: 1.0,
                    strokeWeight: 2,
                    map: map,
                  });

                  polyline.addListener("click", function (event) {
                    const infowindow = new google.maps.InfoWindow({
                      position: event.latLng,
                      content: `<strong>${name}</strong>`,
                    });
                    infowindow.open(map);
                  });

                  new google.maps.Marker({
                    position: coords[0],
                    map: map,
                    title: name,
                  });
                }
              }
            }

            map.fitBounds(bounds);
            google.maps.event.addListenerOnce(
              map,
              "bounds_changed",
              function () {
                const maxZoom = 15;
                if (map.getZoom() > maxZoom) map.setZoom(maxZoom);
              }
            );
          };
          reader.readAsText(file);
        })
        .catch((error) => {
          console.error("Error cargando Google Maps API: ", error);
        });
    }
  });

  // SVG
  $("#svgInput").on("change", function (event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const seccion = $("<section></section>");
        seccion.append("<h3>Altimetría</h3>");
        seccion.append(e.target.result);
        $("#svgInput").after(seccion);
      };
      reader.readAsText(file);
    }
  });
});
