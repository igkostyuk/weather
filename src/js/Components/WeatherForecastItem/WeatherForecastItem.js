import Component from '../../framework/Component.js';

export default class WeatherForecastItem extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return [{
      tag: 'li',
      children: [{
          tag: 'h4',
          content: 'mon'
        },
        {
          tag: 'i',
          content: 'rain'
        },
        {
          tag: 'p',
          content: '22'
        },
        {
          tag: 'p',
          content: '12'
        },
      ],
    }];
  }
}
