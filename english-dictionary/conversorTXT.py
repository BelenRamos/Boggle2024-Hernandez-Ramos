import json

# Ruta del archivo de texto
ruta_txt = r'C:\Users\belen\OneDrive\Documentos\Boggle2024\english-dictionary\palabras.txt'
# Ruta del archivo JSON
ruta_json = r'C:\Users\belen\OneDrive\Documentos\Boggle2024\english-dictionary\palabras.json'

# Leer el archivo de texto
with open(ruta_txt, 'r') as file:
    palabras = file.read().splitlines()

# Convertir la lista de palabras a JSON
with open(ruta_json, 'w') as json_file:
    json.dump(palabras, json_file, indent=4)

print("Conversión completada. El archivo palabras.json ha sido creado.")

