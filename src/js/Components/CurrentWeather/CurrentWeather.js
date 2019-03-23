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

// export default class CurrentWeather extends Component {
//   constructor(host, props) {
//     super(host, props);
//     // WeatherDataService.subscribeForCurrentWeather(this.onServerResponse);
//   }

//   // onServerResponse(weatherData) {
//   //   // ensure weatherData is properly rendered
//   //   // this.props.weather = weatherData;
//   //   // console.log('CurrentWeather', this.props.weather.main.temp);
//   //

//   render() {
//     return [{
//         tag: 'div',
//         classList: ['temp'],
//         content: Math.round(this.props.forcast ? this.props.forcast.main.temp : null),
//       },
//       {
//         tag: 'div',
//         classList: ['right'],
//         children: [{
//             tag: 'div',
//             classList: ['summary'],
//             content: this.props.forcast ? this.props.forcast.name : null,
//           },
//           {
//             tag: 'div',
//             classList: ['date'],
//             content: `${this.props.forcast ?this.props.forcast.wind.speed:null}km/h`,
//           },
//           {
//             tag: 'div',
//             classList: ['date'],
//             content: `${this.props.forcast ?this.props.forcast.main.humidity:null}%`,
//           },
//         ],
//       },
//       {
//         tag: 'div',
//         classList: ['weather-icon'],
//         content: `<img src="${img['01n']}" />`,
//       },
//     ];
//   }
// }
