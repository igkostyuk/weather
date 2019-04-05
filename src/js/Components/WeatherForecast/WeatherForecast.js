import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';

export default class WeatherForecast extends Component {
  constructor(host, props) {
    super(host, props);
    this.onServerResponse = this.onServerResponse.bind(this);
    WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
  }

  init() {
    this.state = {
      data: [
        {
          temperatureHigh: '',
          temperatureLow: '',
          icon: ''
        }
      ]
    };
  }

  onServerResponse({ daily }) {
    daily.data = daily.data.slice(1, 6);
    daily.data.map(day => {
      day.weekday = new Date(day.time * 1000).toLocaleDateString('en-US', {
        weekday: 'short'
      });
      day.temperatureHigh = Math.round(day.temperatureHigh);
      day.temperatureLow = Math.round(day.temperatureLow);
    });
    this.updateState(daily);
  }

  render() {
    return this.state.data
      .map(
        day =>
          `<WeatherForecastItem weekday=${day.weekday}` +
          ` temperatureHigh=${day.temperatureHigh}` +
          ` temperatureLow=${day.temperatureLow}` +
          ` icon=${day.icon}/>`
      )
      .join(' ');
  }
}
ComponentFactory.register(WeatherForecast);
