import json

# Ruta del archivo de texto
ruta_txt = r'C:\Users\belen\OneDrive\Documentos\Boggle2024\español-diccionario\palabrasEsp.txt'
# Ruta del archivo JSON
ruta_json = r'C:\Users\belen\OneDrive\Documentos\Boggle2024\español-diccionario\palabrasEsp.json'

# Leer el archivo de texto con codificación utf-8
with open(ruta_txt, 'r', encoding='utf-8') as file:
    palabras = file.read().splitlines()

# Convertir la lista de palabras a JSON
with open(ruta_json, 'w', encoding='utf-8') as json_file:
    json.dump(palabras, json_file, ensure_ascii=False, indent=4)

print("Conversión completada. El archivo palabras.json ha sido creado.")
