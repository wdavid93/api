from flask import Flask, render_template, request, jsonify
import folium
import requests

app = Flask(__name__)

# Liste des villes avec leurs coordonnées
cities = [
    {'name': "Paris", 'coords': [48.8566, 2.3522]},
    {'name': "Marseille", 'coords': [43.2965, 5.3698]},
    {'name': "Lyon", 'coords': [45.764, 4.8357]},
    {'name': "Toulouse", 'coords': [43.6047, 1.4442]},
    {'name': "Nice", 'coords': [43.7102, 7.262]},
    {'name': "Nantes", 'coords': [47.2184, -1.5536]},
    {'name': "Strasbourg", 'coords': [48.5734, 7.7521]},
    {'name': "Montpellier", 'coords': [43.6119, 3.8772]},
    {'name': "Bordeaux", 'coords': [44.8378, -0.5792]},
    {'name': "Lille", 'coords': [50.6292, 3.0573]},
    {'name': "Rennes", 'coords': [48.1173, -1.6778]},
    {'name': "Reims", 'coords': [49.2583, 4.0317]},
    {'name': "Le Havre", 'coords': [49.4944, 0.1079]},
    {'name': "Saint-Étienne", 'coords': [45.4397, 4.3872]},
    {'name': "Toulon", 'coords': [43.1242, 5.928]},
    {'name': "Grenoble", 'coords': [45.1885, 5.7245]},
    {'name': "Dijon", 'coords': [47.322, 5.0415]},
    {'name': "Angers", 'coords': [47.4784, -0.5632]},
    {'name': "Villeurbanne", 'coords': [45.7669, 4.8792]},
    {'name': "Nîmes", 'coords': [43.8367, 4.3601]},
    {'name': "Clermont-Ferrand", 'coords': [45.7772, 3.087]},
    {'name': "Aix-en-Provence", 'coords': [43.5297, 5.4474]},
    {'name': "Brest", 'coords': [48.3904, -4.4861]},
    {'name': "Limoges", 'coords': [45.8336, 1.2611]},
    {'name': "Tours", 'coords': [47.3941, 0.6848]},
    {'name': "Amiens", 'coords': [49.895, 2.3023]},
    {'name': "Perpignan", 'coords': [42.6986, 2.8956]},
    {'name': "Metz", 'coords': [49.1193, 6.1757]},
    {'name': "Besançon", 'coords': [47.2378, 6.0241]},
    {'name': "Orléans", 'coords': [47.9029, 1.9092]},
    {'name': "Mulhouse", 'coords': [47.7508, 7.3359]},
    {'name': "Rouen", 'coords': [49.4431, 1.0993]},
    {'name': "Caen", 'coords': [49.1829, -0.3707]},
    {'name': "Nancy", 'coords': [48.6921, 6.1844]},
    {'name': "Argenteuil", 'coords': [48.9472, 2.2467]},
    {'name': "Saint-Denis", 'coords': [48.9362, 2.3574]},
    {'name': "Roubaix", 'coords': [50.6927, 3.1746]},
    {'name': "Tourcoing", 'coords': [50.723, 3.1612]},
    {'name': "Montreuil", 'coords': [48.8642, 2.4432]},
    {'name': "Avignon", 'coords': [43.9493, 4.8055]},
    {'name': "Nanterre", 'coords': [48.8924, 2.2061]},
    {'name': "Créteil", 'coords': [48.7904, 2.4556]}
]

# Fonction pour obtenir les données météorologiques
def get_weather(city_name):
    try:
        response = requests.get(f'https://wttr.in/{city_name}?format=j1')
        response.raise_for_status()
        data = response.json()
        return data['current_condition'][0]
    except Exception as e:
        return None

@app.route('/')
def index():
    # Créer la carte avec Folium
    m = folium.Map(location=[46.603354, 1.888334], zoom_start=6)

    # Ajouter les marqueurs pour les villes
    for city in cities:
        weather_data = get_weather(city['name'])
        if weather_data:
            weather_info = (
                f"Température : {weather_data['temp_C']}°C<br>"
                f"Météo : {weather_data['weatherDesc'][0]['value']}<br>"
                f"Humidité : {weather_data['humidity']}%<br>"
                f"Vent : {weather_data['windspeedKmph']} km/h"
            )
        else:
            weather_info = "Données météo non disponibles."

        folium.Marker(
            location=city['coords'],
            popup=folium.Popup(weather_info, max_width=300),
            tooltip=city['name']
        ).add_to(m)

    # Enregistrer la carte dans un fichier HTML
    map_html = m._repr_html_()

    # Charger la liste des villes pour la liste déroulante
    cities_list = [city['name'] for city in cities]

    return render_template('index.html', map_html=map_html, cities_list=cities_list)

@app.route('/weather', methods=['POST'])
def weather():
    city_name = request.form.get('city')
    weather_data = get_weather(city_name)
    if weather_data:
        return jsonify({
            'temp_C': weather_data['temp_C'],
            'weather': weather_data['weatherDesc'][0]['value'],
            'humidity': weather_data['humidity'],
            'windspeedKmph': weather_data['windspeedKmph']
        })
    else:
        return jsonify({'error': 'Unable to retrieve weather data'})

if __name__ == '__main__':
    app.run(debug=True)
