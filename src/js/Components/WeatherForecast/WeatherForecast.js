import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';
import imageUrl from '../../utils/icons';

export default class WeatherForecast extends Component {
  constructor(host, props) {
    super(host, props);
    this.onServerResponse = this.onServerResponse.bind(this);
    WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
  }

  init() {
    this.state = {
      data: [{
        temperatureHigh: '',
        temperatureLow: '',
        icon: '',
      }, ]
    }
  }

  onServerResponse({
    daily
  }) {
    daily.data.map(day => {
      day.weekday = new Date(day.time * 1000)
        .toLocaleDateString('en-US', {
          weekday: 'short',
        });
    });
    this.updateState(daily);
  }

  render() {
    const data = this.state.data
      .map(day => `
      <WeatherForecastItem weekday=${day.weekday} icon=${day.icon} temperatureHigh=${day.temperatureHigh} temperatureLow=${day.temperatureLow}/>`)
      .join(' ');
    console.log('data', data);
    return `<ul>${data}</ul>`;
  }
}
ComponentFactory.register(WeatherForecast);
