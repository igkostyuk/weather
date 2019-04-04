import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';
import { animatedImageUrl } from '../../utils/icons';

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
      city: ''
    };
    if (this.state.city === '') {
      WeatherDataService.getCurrentLocation();
    }
  }

  onServerResponse(weatherData) {
    const { currently, city } = weatherData;
    const { units } = weatherData.flags;
    if (currently) {
      currently.date = new Date(currently.time * 1000).toLocaleDateString(
        'en-US',
        {
          month: 'long',
          day: 'numeric'
        }
      );
      currently.temperature = Math.round(currently.temperature);
      currently.city = city;
      currently.units = units;
      this.updateState(currently);
    }
  }

  render() {
    return `
  <div class="temp">
  ${this.state.temperature}
  ${
    this.state.units === 'ca'
      ? '<span>C |<a>F</a></span>'
      : '<span>C|<a>F</a></span>'
  }
  </div>
  <div class="right">
    <div class="date">${this.state.date}</div>
    <div class="summary">${this.state.city}</div>
    <div class="date">${this.state.humidity}</div>
    <div class="date">${this.state.windSpeed}</div>
  </div>
  <div class="weather-icon">
  <img src="${animatedImageUrl[this.state.icon]}" />
  </div>`;
  }
}
ComponentFactory.register(CurrentWeather);
