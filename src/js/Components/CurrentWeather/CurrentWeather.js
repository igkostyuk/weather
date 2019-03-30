import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';


// list = [
//   'clear-day', 'clear-night', 'partly-cloudy-day',
//   'partly-cloudy-night', 'cloudy', 'rain', 'sleet', 'snow', 'wind',
//   'fog'
// ];

export default class CurrentWeather extends Component {
  constructor(host, props) {
    super(host, props);
    this.onServerResponse = this.onServerResponse.bind(this);
    WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
  }

  init() {
    this.state = {
      temperature: '',
      icon: '',
      windSpeed: '',
      humidity: '',
      date: '',
      city: '',
    };
  }


  onServerResponse({currently}, city) {
    if (currently) {
      currently.date = new Date(currently.time * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      });
      currently.temperature = Math.round(currently.temperature);
      currently.city = city;
      console.log('state', this.state);
      this.updateState(currently);
    }
  }

  render() {
    return `
  <div class="temp">
  ${this.state.temperature}
  <span><a>C</a> |<a>F</a></span>
  </div>
  <div class="right">
    <div class="date">${this.state.date}</div>
    <div class="summary">${this.state.city}</div>
    <div class="date">${this.state.humidity}</div>
    <div class="date">${this.state.windSpeed}</div>
  </div>
  <div class="weather-icon">
    <canvas id="icon1" width="128" height="128"></canvas>
  </div>`
  }
}
ComponentFactory.register(CurrentWeather);
