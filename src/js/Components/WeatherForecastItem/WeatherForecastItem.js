import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import {
  animatedImageUrl
} from '../../utils/icons';

export default class WeatherForecastItem extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return `
    <h4>${this.props.weekday}</h4>
    <img src="${animatedImageUrl[this.props.icon]}" />
    <p>${this.props.temperatureHigh}</p>
    <p>${this.props.temperatureLow}</p>
  `
  }
}
ComponentFactory.register(WeatherForecastItem);
