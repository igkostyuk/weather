import Component from '../../framework/Component.js';

import {WeatherForecastItem} from '../WeatherForecastItem';

export default class WeatherForecast extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return [{
      tag: 'div',
      classList: ['forcast'],
      children: [{
        tag: 'ul',
        children: [{
            tag: WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C',
            },
          },
          {
            tag: WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C',
            },
          },
          {
            tag: WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C',
            },
          },
          {
            tag: WeatherForecastItem,
            props: {
              temperature: 18,
              unit: 'C',
            },
          },
        ],
      }, ],
    }, ]
  }
}
