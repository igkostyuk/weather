// // clear sky
// // import star from '../../../animated/day.svg';

// // import Component from '../../framework/Component';
// // import 01n from '../../../animated/night.svg';
// // //few clouds
// // import 02d from "../../../animated/day.svg";
// // import 02n from './';
// // //scattered clouds
// // import 03d from "../../../animated/day.svg";
// // import 03n from './';
// // //broken clouds
// // import 04d from "../../../animated/day.svg";
// // import 04n from './';
// // //shower rain
// // import 09d from "../../../animated/day.svg";
// // import 09n from './';
// // //rain
// // import 10d from "../../../animated/day.svg";
// // import 10n from './';
// // //thunderstorm
// // import 11d from "../../../animated/day.svg";
// // import 11n from './';
// // //snow
// // import 13d from "../../../animated/day.svg";
// // import 13n from './';
// // //mist
// // import 50d from "../../../animated/day.svg";
// // import 50n from './';
// // import WeatherDataService from '../../../Services/WeatherDataService'
import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';

export default class CurrentWeather extends Component {
  constructor(host, props) {
    super(host, props);
    this.onServerResponse = this.onServerResponse.bind(this);
    WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
  }

  onServerResponse(weatherData) {
    if (weatherData.currently) {

    }
  }

  render() {
    return `
  <div class="temp">
    20<span><a>C</a> |<a>F</a></span>
  </div>
  <div class="right">
    <div class="date">Monday 22 August</div>
    <div class="summary">Kiev</div>
    <div class="date">22</div>
    <div class="date">30</div>
    <div class="date">40</div>
  </div>
  <div class="weather-icon">
    <img src="./animated/day.svg" />
  </div>`
  }
}
ComponentFactory.register(CurrentWeather);
