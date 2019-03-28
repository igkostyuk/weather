import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import {SearchBar} from '../SearchBar';
import {CurrentWeather} from '../CurrentWeather';
import {WeatherForecast} from '../WeatherForecast';
// import WeatherDataService from '../../../Services/WeatherDataService';

export default class App extends Component {
  constructor(host) {
    super(host);
  }

  init() {
    this.getCityForecast = this.getCityForecast.bind(this);
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
      WeatherDataService.getGeolocation().then(city => this.getCityForecast(city));
      console.log('geo.loc', city)
    }
  }

  getCityForecast(city) {
    console.log('fgfh');
    // this.state.inputValue = city;
    // WeatherDataService.getForecast(city).then(([today, week]) => {
    //   return {
    //     todayForecast: today,
    //     weekForecast: week
    //   }
    // }).then(this.updateState)
  }

  render() {
    const {
      todayForecast,
      weekForecast
    } = this.state;
    return '<nav class="search__container"><div><SearchBar onSubmit={this.getCityForecast}/></div><div><SearchBar onSubmit={this.getCityForecast}/></div></nav>'
  }
}
ComponentFactory.register(SearchBar); // to register component class with factory
