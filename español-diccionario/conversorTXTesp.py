import json

# Ruta del archivo de texto
ruta_txt = r'C:\Users\ale32\OneDrive - UNIVERSIDAD ABIERTA INTERAMERICANA\Documents\Belen\Boggle\español-diccionario\palabrasEsp_limpias.txt'
# Ruta del archivo JSON
ruta_json = r'C:\Users\ale32\OneDrive - UNIVERSIDAD ABIERTA INTERAMERICANA\Documents\Belen\Boggle\español-diccionario\palabrasEspanol.json'

# Leer el archivo de texto con la codificación adecuada
with open(ruta_txt, 'r', encoding='utf-8') as file:
    palabras = file.read().splitlines()

# Convertir la lista de palabras a JSON
with open(ruta_json, 'w', encoding='utf-8') as json_file:
    json.dump(palabras, json_file, ensure_ascii=False, indent=4)

print("Conversión completada. El archivo palabrasEspanol.json ha sido creado.")
