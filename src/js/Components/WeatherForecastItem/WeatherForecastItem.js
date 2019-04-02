import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import imageUrl from '../../utils/icons';

export default class WeatherForecastItem extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return `
  <li>
    <h4>${this.props.weekday}</h4>
    <p>${this.props.temperatureHigh}</p>
    <p>${this.props.temperatureLow}</p>
  </li>`
  }
}
ComponentFactory.register(WeatherForecastItem);
