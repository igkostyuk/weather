class WeatherDataService {
  constructor() {
    this.geocoderBase = 'https://api.opencagedata.com/geocode/v1/json?q='
    this.forecastBase = 'https://api.darksky.net/forecast/';
    this.currentLocationBase = 'https://ipapi.co/json';
    this.geocoderKey = '&key=39b7025dc04d4a47a61c8866819b5161';
    this.forecastKey = 'f5bcd9de3734de86a2d47a58d91793ab/';
    this.corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
    this.forecastData = {
      city: '',
      latitude: '',
      longitude: '',
    };
    this.subscribers = [];
  }

  setCity(city = 'Kiev') {
    this.forecastData.city = city;
    this.getForwardGeocoding();
  }

  getCurrentLocation() {
    this.getData(this.currentLocationBase)
      .then(response => this.getWeatherForecast(response.latitude, response.longitude));
  }

  getForwardGeocoding() {
    return this.getData(`${this.geocoderBase}${this.forecastData.city}${this.geocoderKey}`)
      .then(response => response.results[0].geometry)
      .then(response => this.getWeatherForecast(response.lat, response.lng));
  }

  getWeatherForecast(lat, lng) {
    return this.getData(`${this.corsAnywhere}${this.forecastBase}${this.forecastKey}${lat},${lng}?units=ca`)
      .then(response => {
        this.forecastData = Object.assign({}, this.forecastData, response);
        this.subscribers.forEach(subscriber => subscriber(this.forecastData));
      })
  };

  subscribeForCurrentWeather(subscriber) {
    this.subscribers.push(subscriber)
  }

  getData(api) {
    return fetch(`${api}`).then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    });
  }
}

export default new WeatherDataService();
