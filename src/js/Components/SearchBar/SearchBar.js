import Component from '../../framework/Component';
import AppState from '../../Services/AppState';
import ComponentFactory from '../../framework/ComponentFactory';

export default class SearchBar extends Component {
  constructor(host, props) {
    super(host, props);
    AppState.watch('COUNT', this.updateMyself);
  }

  init() {
    this.onSubmit = this.onSubmit.bind(this);
    this.state = {
      value: this.props.value * 2,
      quantifier: 7,
    };
  }

  updateMyself(subState) {
    // .... transform response
    console.log('PNumber in CountControls', subState);
    // do update
    this.updateState(subState);
  }

  onSubmit(e) {
    console.log('onSubmit run');
    e.preventDefault();
    const city = e.target.elements.city.value;
    this.props.onSubmit(city);
  }

  render() {
    return ` <form on-Submit={this.onSubmit}>
               <input class="search__input " name="city" placeholder="city" type="text" value="" />
               <button class="search__button" type="submit" on-Click={this.onSubmit} />search</button>
             </form>`
  }
}

//

ComponentFactory.register(SearchBar); // to register component class with factory
