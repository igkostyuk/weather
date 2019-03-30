// const base = 'http://api.openweathermap.org/data/2.5/';
// const unit = '&units=metric';
// const key = '&APPID=72e4c511f65e4706ad1a983c6eed3dc9';

class WeatherDataService {
  constructor() {
    this.geocoderBase = 'https://api.opencagedata.com/geocode/v1/json?q='
    this.forecastBase = 'https://api.darksky.net/forecast/';
    this.currentLocationBase = 'https://ipapi.co/json';
    this.geocoderKey = '&key=39b7025dc04d4a47a61c8866819b5161';
    this.forecastKey = 'f5bcd9de3734de86a2d47a58d91793ab/';
    this.corsAnywhere = 'https://cors-anywhere.herokuapp.com/'
    this.forecastData = {};
    this.subscribers = [];
  }

  // subscribeForCurrentWeather(callback) {
  //   this.getCurrentWeather().then(callback);
  // }
  getCurrentLocation() {
    return this.getData(this.currentLocationBase).then(response => response.city);
  }

  // `${this.geocoderBase}${city}${this.geocoderFormat}`
  forwardGeocoding(city = 'Kiev') {
    this.forecastData.city = city;
    console.log('this.forecastData.city', this.forecastData.city);
    return this.getData(`${this.geocoderBase}${city}${this.geocoderKey}`)
      .then(response => response.results[0].geometry)
      .then(response => this.geWeatherForecast(response.lat, response.lng));
  }

  geWeatherForecast(lat, lng) {
    return this.getData(`${this.corsAnywhere}${this.forecastBase}${this.forecastKey}${lat},${lng}?units=ca`)
      .then(response => {
        this.forecastData = Object.assign({}, this.forecastData, response);
        this.subscribers.forEach(subscriber => subscriber(this.forecastData, this.forecastData.city));
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
