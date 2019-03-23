import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';

export default class Wind extends Component {
  constructor(host, props) {
    super(host, props);
  }

  render() {
    return [`${this.props.speed  } ${  this.props.unit}`];
  }
}

ComponentFactory.register(Wind); // to register component class with factory
