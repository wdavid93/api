// Fonction pour récupérer les données météo
async function getWeatherData(city) {
    const apiUrl = `https://wttr.in/${city}?format=j1`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Erreur de requête API');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erreur:', error);
        return null;
    }
}

// Fonction pour afficher la popup avec les données météo
async function showWeatherPopup(map, lat, lon, cityName) {
    const weatherData = await getWeatherData(cityName);
    
    if (weatherData) {
        const weather = weatherData.current_condition[0];
        const temperature = weather.temp_C;
        const weatherDesc = weather.weatherDesc[0].value.toLowerCase();
        const humidity = weather.humidity;
        const windSpeed = weather.windspeedKmph;

        // Déterminer l'URL de l'image en fonction des conditions météorologiques
        let weatherImageUrl;
        if (weatherDesc.includes('sunny') || weatherDesc.includes('clear')) {
            weatherImageUrl = 'https://cdn.pixabay.com/photo/2018/08/06/22/55/sun-3588618_1280.jpg'; // Image ensoleillée
        } else if (weatherDesc.includes('cloudy')) {
            weatherImageUrl = 'https://cdn.pixabay.com/photo/2024/01/29/17/49/ai-generated-8540500_1280.jpg'; // Image nuageuse
        } else if (weatherDesc.includes('rain') || weatherDesc.includes('showers')) {
            weatherImageUrl = 'https://cdn.pixabay.com/photo/2020/02/05/09/02/cloud-4820504_1280.jpg'; // Image pluie
        } else if (weatherDesc.includes('storm') || weatherDesc.includes('thunderstorm')) {
            weatherImageUrl = 'https://cdn.pixabay.com/photo/2015/09/23/08/16/thunder-953118_1280.jpg'; // Image orage
        } else {
            weatherImageUrl = 'https://cdn.pixabay.com/photo/2016/11/29/04/19/ocean-1867285_1280.jpg'; // Image par défaut
        }

        const popupContent = `<h4>Météo pour ${cityName}</h4>
                              <p>Température : ${temperature}°C</p>
                              <p>Météo : ${weatherDesc}</p>
                              <p>Humidité : ${humidity}%</p>
                              <p>Vent : ${windSpeed} km/h</p>
                              <img src='${weatherImageUrl}' alt='${weatherDesc}' style='width:100px;height:100px;'>`;

        L.popup()
         .setLatLng([lat, lon])
         .setContent(popupContent)
         .openOn(map);
    } else {
        L.popup()
         .setLatLng([lat, lon])
         .setContent('<p>Erreur de récupération des données météo</p>')
         .openOn(map);
    }
}

// Initialisation de la carte
var map = L.map('map').setView([48.8566, 2.3522], 6); // Position initiale sur Paris

// Ajouter une couche de tuiles (map)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Liste des villes avec leurs coordonnées
var cities = [
    {name: "Paris", coords: [48.8566, 2.3522]},
    {name: "Marseille", coords: [43.2965, 5.3698]},
    {name: "Lyon", coords: [45.764, 4.8357]},
    {name: "Toulouse", coords: [43.6047, 1.4442]},
    {name: "Nice", coords: [43.7102, 7.262]},
    {name: "Nantes", coords: [47.2184, -1.5536]},
    {name: "Strasbourg", coords: [48.5734, 7.7521]},
    {name: "Montpellier", coords: [43.6119, 3.8772]},
    {name: "Bordeaux", coords: [44.8378, -0.5792]},
    {name: "Lille", coords: [50.6292, 3.0573]},
    {name: "Rennes", coords: [48.1173, -1.6778]},
    {name: "Reims", coords: [49.2583, 4.0317]},
    {name: "Le Havre", coords: [49.4944, 0.1079]},
    {name: "Saint-Étienne", coords: [45.4397, 4.3872]},
    {name: "Toulon", coords: [43.1242, 5.928]},
    {name: "Grenoble", coords: [45.1885, 5.7245]},
    {name: "Dijon", coords: [47.322, 5.0415]},
    {name: "Angers", coords: [47.4784, -0.5632]},
    {name: "Villeurbanne", coords: [45.7669, 4.8792]},
    {name: "Nîmes", coords: [43.8367, 4.3601]},
    {name: "Clermont-Ferrand", coords: [45.7772, 3.087]},
    {name: "Aix-en-Provence", coords: [43.5297, 5.4474]},
    {name: "Brest", coords: [48.3904, -4.4861]},
    {name: "Limoges", coords: [45.8336, 1.2611]},
    {name: "Tours", coords: [47.3941, 0.6848]},
    {name: "Amiens", coords: [49.895, 2.3023]},
    {name: "Perpignan", coords: [42.6986, 2.8956]},
    {name: "Metz", coords: [49.1193, 6.1757]},
    {name: "Besançon", coords: [47.2378, 6.0241]},
    {name: "Orléans", coords: [47.9029, 1.9092]},
    {name: "Mulhouse", coords: [47.7508, 7.3359]},
    {name: "Rouen", coords: [49.4431, 1.0993]},
    {name: "Caen", coords: [49.1829, -0.3707]},
    {name: "Nancy", coords: [48.6921, 6.1844]},
    {name: "Argenteuil", coords: [48.9472, 2.2467]},
    {name: "Saint-Denis", coords: [48.9362, 2.3574]},
    {name: "Roubaix", coords: [50.6927, 3.1746]},
    {name: "Tourcoing", coords: [50.723, 3.1612]},
    {name: "Montreuil", coords: [48.8642, 2.4432]},
    {name: "Avignon", coords: [43.9493, 4.8055]},
    {name: "Nanterre", coords: [48.8924, 2.2061]},
    {name: "Créteil", coords: [48.7904, 2.4556]}
];

// Ajouter les marqueurs sur la carte
cities.forEach(city => {
    var marker = L.marker(city.coords).addTo(map);
    marker.on('click', function() {
        showWeatherPopup(map, city.coords[0], city.coords[1], city.name);
    });
});
