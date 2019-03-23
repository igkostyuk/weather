import Component from '../../framework/Component.js';

export default class Temperature extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return this.props.temperature + this.props.unit;
  }
}
