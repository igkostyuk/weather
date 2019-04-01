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
      temperature: '',
      icon: '',
      windSpeed: '',
      humidity: '',
      date: '',
      city: '',
    };
  }

  render() {

  }
}
ComponentFactory.register(WeatherForecast);
