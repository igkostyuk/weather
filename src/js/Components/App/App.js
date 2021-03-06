import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import {
  SearchBar
} from '../SearchBar';
import {
  CurrentWeather
} from '../CurrentWeather';
import {
  WeatherForecast
} from '../WeatherForecast';
import {
  WeatherForecastItem
} from '../WeatherForecastItem';


export default class App extends Component {
  constructor(host) {
    super(host);
  }

  init() {
    this.updateState = this.updateState.bind(this);
    this.state = {
      inputValue: '',
      hasError: false,
      todayForecast: null,
      weekForecast: null,
    };
  }

  getWeattherFromGeolocation() {
    if (!this.state.todayForecast) {
      WeatherDataService.getGeolocation().then(city =>
        this.getCityForecast(city),
      );
      console.log('geo.loc', city);
    }
  }

  render() {
    return `
    <nav class="search__container">
      <SearchBar/>
    </nav>
    <div id="card" class="weather">
      <div class="details">
        <CurrentWeather/>
        <div class="forcast">
          <WeatherForecast/>
        </div>
      </div>
    </div>
    `;
  }
}
// to register component class with factory
