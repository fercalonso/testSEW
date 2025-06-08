import xml.etree.ElementTree as ET

def extract_routes(xml_file):
    tree = ET.parse(xml_file)
    root = tree.getroot()

    rutas = []

    for ruta_elem in root.findall('ruta'):
        nombre_ruta = ruta_elem.find('nombre').text.strip() if ruta_elem.find('nombre') is not None else "Ruta sin nombre"
        hitos = ruta_elem.find('hitos')
        if hitos is None:
            continue

        puntos = []
        for hito in hitos.findall('hito'):
            try:
                nombre_elem = hito.find('nombreHito')
                descripcion_elem = hito.find('descripcionHito')
                coordenadas = hito.find('coordenadasHito')

                if nombre_elem is None or descripcion_elem is None or coordenadas is None:
                    raise ValueError("Faltan elementos obligatorios en el hito.")

                nombre = nombre_elem.text.strip()
                descripcion = descripcion_elem.text.strip()
                longitud = float(coordenadas.find('longitud').text)
                latitud = float(coordenadas.find('latitud').text)
                altitud = float(coordenadas.find('altitud').text)

                puntos.append({
                    "nombre": nombre,
                    "descripcion": descripcion,
                    "longitud": longitud,
                    "latitud": latitud,
                    "altitud": altitud
                })

            except Exception as e:
                print(f"Error procesando un hito en {xml_file}: {e}")
                continue

        rutas.append({
            "nombre": nombre_ruta,
            "puntos": puntos
        })

    return rutas

def generate_kml(rutas, output_file):
    kml_content = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
"""

    for idx, ruta in enumerate(rutas):
        ruta_name = ruta["nombre"] or f"Ruta {idx + 1}"

        # Crear una línea con todos los puntos de la ruta
        kml_content += f"""
    <Placemark>
      <name>{ruta_name}</name>
      <LineString>
        <tessellate>1</tessellate>
        <coordinates>
"""

        for punto in ruta["puntos"]:
            kml_content += f"          {punto['longitud']},{punto['latitud']},{punto['altitud']}\n"

        kml_content += """        </coordinates>
      </LineString>
    </Placemark>
"""

        # Añadir los puntos individuales
        for punto in ruta["puntos"]:
            kml_content += f"""
    <Placemark>
      <name>{punto['nombre']}</name>
      <description>{punto['descripcion']}</description>
      <Point>
        <coordinates>{punto['longitud']},{punto['latitud']},{punto['altitud']}</coordinates>
      </Point>
    </Placemark>
"""

    kml_content += """
  </Document>
</kml>
"""

    with open(output_file, "w", encoding="utf-8") as file:
        file.write(kml_content)

def main():
    archivos_xml = ["ruta1.xml", "ruta2.xml", "ruta3.xml"]

    for xml_file in archivos_xml:
        rutas = extract_routes(xml_file)
        print(f"Procesando {xml_file}: {len(rutas)} ruta(s) encontrada(s)")

        # Generar nombre para el KML basado en el XML
        kml_file = xml_file.replace(".xml", ".kml")
        generate_kml(rutas, kml_file)
        print(f"✅ KML generado: {kml_file}\n")

if __name__ == "__main__":
    main()
