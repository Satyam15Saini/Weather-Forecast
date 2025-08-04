
const weatherIcons = {
    // Clear sky
    '01d': '☀️', '01n': '🌙',
    // Few clouds
    '02d': '⛅', '02n': '☁️',
    // Scattered clouds
    '03d': '☁️', '03n': '☁️',
    // Broken clouds
    '04d': '☁️', '04n': '☁️',
    // Shower rain
    '09d': '🌦️', '09n': '🌧️',
    // Rain
    '10d': '🌧️', '10n': '🌧️',
    // Thunderstorm
    '11d': '⛈️', '11n': '⛈️',
    // Snow
    '13d': '❄️', '13n': '❄️',
    // Mist
    '50d': '🌫️', '50n': '🌫️'
};

// Additional weather emojis for enhanced display
const weatherEmojis = {
    'clear': '☀️',
    'clouds': '☁️',
    'rain': '🌧️',
    'drizzle': '🌦️',
    'thunderstorm': '⛈️',
    'snow': '❄️',
    'mist': '🌫️',
    'fog': '🌫️',
    'haze': '🌫️',
    'dust': '🌪️',
    'sand': '🌪️',
    'ash': '🌋',
    'squall': '💨',
    'tornado': '🌪️'
};

// Function to get weather icon based on condition
function getWeatherIcon(iconCode, condition) {
    // First try to get icon by code
    if (weatherIcons[iconCode]) {
        return weatherIcons[iconCode];
    }
    
    // Fallback to condition-based icon
    const conditionLower = condition.toLowerCase();
    for (const key in weatherEmojis) {
        if (conditionLower.includes(key)) {
            return weatherEmojis[key];
        }
    }
    
    // Default fallback
    return '🌤️';
}

// Function to set dynamic background based on weather
function setWeatherBackground(condition, isDay) {
    const body = document.body;
    const conditionLower = condition.toLowerCase();
    
    // Remove existing weather classes
    body.classList.remove('weather-sunny', 'weather-cloudy', 'weather-rainy', 'weather-snowy', 'weather-stormy');
    
    // Remove any existing weather effects
    const existingEffects = document.querySelectorAll('.rain-effect, .snow-effect');
    existingEffects.forEach(effect => effect.remove());
    
    if (conditionLower.includes('clear') && isDay) {
        body.classList.add('weather-sunny');
    } else if (conditionLower.includes('cloud')) {
        body.classList.add('weather-cloudy');
    } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
        body.classList.add('weather-rainy');
        createRainEffect();
    } else if (conditionLower.includes('snow')) {
        body.classList.add('weather-snowy');
        createSnowEffect();
    } else if (conditionLower.includes('thunder')) {
        body.classList.add('weather-stormy');
        createRainEffect();
    } else {
        body.classList.add('weather-cloudy');
    }
}

// Create rain effect animation
function createRainEffect() {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-effect';
    document.body.appendChild(rainContainer);
    
    // Create multiple rain drops
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const rainDrop = document.createElement('div');
            rainDrop.className = 'rain-drop';
            rainDrop.style.left = Math.random() * 100 + '%';
            rainDrop.style.animationDelay = Math.random() * 2 + 's';
            rainDrop.style.animationDuration = (Math.random() * 1 + 0.5) + 's';
            rainContainer.appendChild(rainDrop);
            
            // Remove after animation
            setTimeout(() => {
                if (rainDrop.parentNode) {
                    rainDrop.parentNode.removeChild(rainDrop);
                }
            }, 2000);
        }, i * 100);
    }
    
    // Remove rain container after 10 seconds
    setTimeout(() => {
        if (rainContainer.parentNode) {
            rainContainer.parentNode.removeChild(rainContainer);
        }
    }, 10000);
}

// Create snow effect animation
function createSnowEffect() {
    const snowContainer = document.createElement('div');
    snowContainer.className = 'snow-effect';
    document.body.appendChild(snowContainer);
    
    // Create snowflakes
    const snowflakes = ['❄', '❅', '❆'];
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const snowflake = document.createElement('div');
            snowflake.className = 'snowflake';
            snowflake.innerHTML = snowflakes[Math.floor(Math.random() * snowflakes.length)];
            snowflake.style.left = Math.random() * 100 + '%';
            snowflake.style.animationDelay = Math.random() * 3 + 's';
            snowflake.style.animationDuration = (Math.random() * 2 + 2) + 's';
            snowContainer.appendChild(snowflake);
            
            // Remove after animation
            setTimeout(() => {
                if (snowflake.parentNode) {
                    snowflake.parentNode.removeChild(snowflake);
                }
            }, 5000);
        }, i * 150);
    }
    
    // Remove snow container after 15 seconds
    setTimeout(() => {
        if (snowContainer.parentNode) {
            snowContainer.parentNode.removeChild(snowContainer);
        }
    }, 15000);
}

// Weather App Class
class WeatherApp {
    constructor() {
        // OpenWeatherMap API configuration
        this.API_KEY = '112307177ff2478d272be5fa45682a3a'; // Your existing API key
        this.API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
        
        // Popular Indian cities data
        this.popularCities = [
            { "name": "New Delhi", "state": "Delhi", "type": "Capital" },
            { "name": "Mumbai", "state": "Maharashtra", "type": "Metro" },
            { "name": "Pune", "state": "Maharashtra", "type": "Major City" },
             { "name": "Lucknow", "state": "Uttar Pradesh", "type": "Capital"},
             { "name": "Chandigarh", "state": "Punjab/Haryana", "type": "Capital" },
              { "name": "Bhopal", "state": "Madhya Pradesh", "type": "Capital" },
            { "name": "Bengaluru", "state": "Karnataka", "type": "Metro" },
            { "name": "Hyderabad", "state": "Telangana", "type": "Metro" },
            { "name": "Chennai", "state": "Tamil Nadu", "type": "Metro" },
            { "name": "Kolkata", "state": "West Bengal", "type": "Metro" },
        ];

        // DOM elements
        this.elements = {
            searchInput: document.getElementById('citySearch'),
            searchBtn: document.getElementById('searchBtn'),
            locationBtn: document.getElementById('locationBtn'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            weatherContent: document.getElementById('weatherContent'),
            errorMessage: document.getElementById('errorMessage'),
            retryBtn: document.getElementById('retryBtn'),
            citiesGrid: document.getElementById('citiesGrid'),
            forecastContainer: document.getElementById('forecastContainer'),
            
            // Weather display elements
            locationName: document.getElementById('locationName'),
            locationCountry: document.getElementById('locationCountry'),
            weatherIcon: document.getElementById('weatherIcon'),
            currentTemp: document.getElementById('currentTemp'),
            weatherDescription: document.getElementById('weatherDescription'),
            humidity: document.getElementById('humidity'),
            windSpeed: document.getElementById('windSpeed'),
            pressure: document.getElementById('pressure')
        };

        this.currentCity = '';
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderPopularCities();
        this.checkAPIKey();
        // Load default city (New Delhi) on startup
        this.searchWeather('New Delhi');
    }

    bindEvents() {
        // Search functionality
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });

        // Current location
        this.elements.locationBtn.addEventListener('click', () => this.getCurrentLocation());

        // Retry button
        this.elements.retryBtn.addEventListener('click', () => {
            if (this.currentCity) {
                this.searchWeather(this.currentCity);
            } else {
                this.getCurrentLocation();
            }
        });
    }

    checkAPIKey() {
        if (this.API_KEY === 'YOUR_API_KEY_HERE') {
            this.showError('Please add your OpenWeatherMap API key in the JavaScript file to use this app.');
            return false;
        }
        return true;
    }

    handleSearch() {
        const city = this.elements.searchInput.value.trim();
        if (city) {
            this.searchWeather(city);
            this.elements.searchInput.value = '';
        }
    }

    async searchWeather(city) {
        if (!this.checkAPIKey()) return;

        this.currentCity = city;
        this.showLoading();

        try {
            // Fetch current weather
            const currentWeatherResponse = await fetch(
                `${this.API_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
            );

            if (!currentWeatherResponse.ok) {
                if (currentWeatherResponse.status === 404) {
                    throw new Error('City not found. Please check the spelling and try again.');
                } else if (currentWeatherResponse.status === 401) {
                    throw new Error('Invalid API key. Please check your OpenWeatherMap API key.');
                } else {
                    throw new Error('Failed to fetch weather data. Please try again later.');
                }
            }

            const currentWeather = await currentWeatherResponse.json();

            // Fetch 5-day forecast
            const forecastResponse = await fetch(
                `${this.API_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${this.API_KEY}&units=metric`
            );

            if (!forecastResponse.ok) {
                throw new Error('Failed to fetch forecast data.');
            }

            const forecastData = await forecastResponse.json();

            // Display weather data with enhanced graphics
            this.displayCurrentWeather(currentWeather);
            this.displayForecast(forecastData);
            this.showWeatherContent();

        } catch (error) {
            console.error('Weather fetch error:', error);
            this.showError(error.message);
        }
    }

    getCurrentLocation() {
        if (!navigator.geolocation) {
            this.showError('Geolocation is not supported by this browser.');
            return;
        }

        if (!this.checkAPIKey()) return;

        this.showLoading();

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Fetch current weather by coordinates
                    const currentWeatherResponse = await fetch(
                        `${this.API_BASE_URL}/weather?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
                    );

                    if (!currentWeatherResponse.ok) {
                        throw new Error('Failed to fetch weather data for your location.');
                    }

                    const currentWeather = await currentWeatherResponse.json();

                    // Fetch forecast by coordinates
                    const forecastResponse = await fetch(
                        `${this.API_BASE_URL}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.API_KEY}&units=metric`
                    );

                    if (!forecastResponse.ok) {
                        throw new Error('Failed to fetch forecast data for your location.');
                    }

                    const forecastData = await forecastResponse.json();

                    this.currentCity = currentWeather.name;
                    this.displayCurrentWeather(currentWeather);
                    this.displayForecast(forecastData);
                    this.showWeatherContent();

                } catch (error) {
                    console.error('Location weather fetch error:', error);
                    this.showError(error.message);
                }
            },
            (error) => {
                let errorMessage;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Location access denied. Please enable location services and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Location request timed out.';
                        break;
                    default:
                        errorMessage = 'An unknown error occurred while retrieving location.';
                        break;
                }
                this.showError(errorMessage);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    }

    displayCurrentWeather(data) {
        // Set dynamic background and effects
        const isDay = (data.dt > data.sys.sunrise && data.dt < data.sys.sunset);
        setWeatherBackground(data.weather[0].main, isDay);
        
        // Location info
        this.elements.locationName.textContent = data.name;
        this.elements.locationCountry.textContent = data.sys.country;

        // Weather emoji icon
        const weatherIcon = getWeatherIcon(data.weather[0].icon, data.weather[0].main);
        this.elements.weatherIcon.textContent = weatherIcon;

        // Temperature and description
        this.elements.currentTemp.textContent = Math.round(data.main.temp);
        this.elements.weatherDescription.textContent = data.weather[0].description;

        // Weather details with enhanced formatting
        this.elements.humidity.textContent = `${data.main.humidity}%`;
        this.elements.windSpeed.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
        this.elements.pressure.textContent = `${data.main.pressure} hPa`;
    }

    displayForecast(data) {
        // Clear existing forecast
        this.elements.forecastContainer.innerHTML = '';

        // Process forecast data (get one forecast per day at noon)
        const dailyForecasts = this.processForecastData(data.list);

        dailyForecasts.slice(0, 5).forEach(forecast => {
            const forecastCard = this.createForecastCard(forecast);
            this.elements.forecastContainer.appendChild(forecastCard);
        });
    }

    processForecastData(forecastList) {
        const dailyData = {};

        forecastList.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dateString = date.toDateString();

            // Take the forecast closest to noon (12:00) for each day
            if (!dailyData[dateString] || 
                Math.abs(date.getHours() - 12) < Math.abs(new Date(dailyData[dateString].dt * 1000).getHours() - 12)) {
                dailyData[dateString] = item;
            }
        });

        return Object.values(dailyData);
    }

    createForecastCard(forecast) {
        const card = document.createElement('div');
        card.className = 'forecast-card';

        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        // Determine if it's day time for the forecast
        const isDay = (date.getHours() >= 6 && date.getHours() <= 18);
        const weatherIcon = getWeatherIcon(forecast.weather[0].icon, forecast.weather[0].main);

        card.innerHTML = `
            <div class="forecast-date">${dayName}, ${monthDay}</div>
            <div class="forecast-icon">${weatherIcon}</div>
            <div class="forecast-temps">
                <span class="forecast-high">${Math.round(forecast.main.temp_max)}°</span>
                <span class="forecast-low">${Math.round(forecast.main.temp_min)}°</span>
            </div>
            <div class="forecast-desc">${forecast.weather[0].description}</div>
        `;

        return card;
    }

    renderPopularCities() {
        this.elements.citiesGrid.innerHTML = '';

        this.popularCities.forEach(city => {
            const cityButton = document.createElement('button');
            cityButton.className = 'city-btn';
            cityButton.innerHTML = `
                <span class="city-name">${city.name}</span>
                <span class="city-state">${city.state}</span>
            `;

            cityButton.addEventListener('click', () => {
                this.searchWeather(city.name);
            });

            this.elements.citiesGrid.appendChild(cityButton);
        });
    }

    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.errorState.classList.add('hidden');
        this.elements.weatherContent.classList.add('hidden');
    }

    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorState.classList.remove('hidden');
        this.elements.loadingState.classList.add('hidden');
        this.elements.weatherContent.classList.add('hidden');
    }

    showWeatherContent() {
        this.elements.weatherContent.classList.remove('hidden');
        this.elements.loadingState.classList.add('hidden');
        this.elements.errorState.classList.add('hidden');
    }
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WeatherApp();
});

// Service Worker for offline functionality (basic implementation)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Register service worker for caching (simplified version)
        const cacheName = 'weather-app-v1';
        const staticAssets = [
            './',
            './index.html',
            './style.css',
            './app.js'
        ];

        // Simple cache implementation
        caches.open(cacheName).then(cache => {
            cache.addAll(staticAssets).catch(err => {
                console.log('Cache add failed:', err);
            });
        });
    });
}
