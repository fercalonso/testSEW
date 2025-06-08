import xml.etree.ElementTree as ET

# Definir el espacio de nombres
NS = {'ns': 'http://www.uniovi.es'}

def extractPlaceMarksFromXML(archivoXML):
    try:
        # Cargar el archivo XML
        arbol = ET.parse(archivoXML)
    except IOError:
        print('No se encuentra el archivo ', archivoXML)
        exit()
    except ET.ParseError:
        print("Error procesando el archivo XML = ", archivoXML)
        exit()

    raiz = arbol.getroot()
    puntos = []

    # Navegar por los nodos <punto> en el XML
    for i, hijo in enumerate(raiz.findall('.//ns:punto', NS)):
        print(f"\nProcesando punto {i+1}...")

        # Encontrar los elementos de distancia y altitud
        distancia_element = hijo.find('.//ns:distancia_del_tramo/ns:valor', NS)
        coordenadas_element = hijo.find('.//ns:coordenadas/ns:altitud', NS)

        # Depuración: Mostrar los elementos encontrados
        print(f"  Distancia: {distancia_element.text if distancia_element is not None else 'No encontrado'}")
        print(f"  Altitud: {coordenadas_element.attrib['valor'] if coordenadas_element is not None else 'No encontrado'}")

        # Comprobar que los elementos no son None y extraer valores
        if distancia_element is not None and coordenadas_element is not None:
            distancia = distancia_element.text.strip()
            altitud = coordenadas_element.attrib.get('valor', None)

            if distancia and altitud:
                try:
                    # Convertir y agregar el punto
                    x = float(distancia)
                    y = float(altitud)
                    puntos.append((x, y))
                except ValueError as e:
                    print(f"Error de conversión: {e}")
            else:
                print(f"Datos incompletos en punto {i+1}")
        else:
            print(f"Faltan datos en punto {i+1}")

    return puntos

def escalar_puntos(puntos, rango_x=(0, 1000)):
    """
    Escala los puntos solo en el eje X para que se ajusten al rango especificado en X,
    manteniendo el valor del eje Y sin cambios.
    """
    # Obtener los valores mínimo y máximo en el eje X
    min_x = min(puntos, key=lambda p: p[0])[0]
    max_x = max(puntos, key=lambda p: p[0])[0]

    # Calcular el factor de escala para X
    scale_x = (rango_x[1] - rango_x[0]) / (max_x - min_x) if max_x != min_x else 1

    # Escalar solo los puntos en X, manteniendo los valores de Y
    puntos_escalados = [
        ((p[0] - min_x) * scale_x + rango_x[0], p[1])
        for p in puntos
    ]

    return puntos_escalados


def generar_svg_con_puntos(puntos, nombre_archivo_svg):
    """
    Genera un archivo SVG a partir de una lista de puntos.
    """
    if not puntos:
        print("No se encontraron puntos para generar el SVG.")
        return

    # Convertir puntos a cadena en formato SVG
    puntos_svg = " ".join(f"{x},{y}" for x, y in puntos)

    # Estructura del archivo SVG
    svg_contenido = f"""<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="2.0">
    <polyline points="{puntos_svg}" 
        style="fill:white;stroke:red;stroke-width:4" />
</svg>
"""

    # Escribir el archivo SVG
    with open(nombre_archivo_svg, "w") as archivo:
        archivo.write(svg_contenido)

def main():
    # Nombre del archivo XML y SVG
    nombre_archivo_xml = "circuitoEsquema.xml"
    nombre_archivo_svg = "perfil.svg"

    # Extraer puntos del XML
    puntos = extractPlaceMarksFromXML(nombre_archivo_xml)

    # Verificar los puntos extraídos
    print(f"\nPuntos extraídos: {puntos}")

    # Escalar los puntos solo en Y para ajustarlos al rango deseado
    puntos_escalados = escalar_puntos(puntos)

    # Generar archivo SVG con los puntos escalados
    generar_svg_con_puntos(puntos_escalados, nombre_archivo_svg)
    print(f"Archivo SVG generado: {nombre_archivo_svg}")

if __name__ == "__main__":
    main()
