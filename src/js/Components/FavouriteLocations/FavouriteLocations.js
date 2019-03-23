import Component from '../../framework/Component.js';

export default class FavouriteLocations extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return this.props.temperature + this.props.unit;
  }
}
