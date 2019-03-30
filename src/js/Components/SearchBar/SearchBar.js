import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';
import AppState from '../../Services/AppState';


export default class SearchBar extends Component {
  constructor(host, props) {
    super(host, props);
    AppState.watch('CITY', this.updateMyself);
    // window.addEventListener('submit', this.onSubmit.bind(this));
  }

  init() {
    this.state = {
      value: this.props.value * 2,
      quantifier: 7,
    };
  }

  updateMyself(subState) {
    // .... transform response


    // do update
    this.updateState(subState);
  }

  onSubmit(e) {
    e.preventDefault();
    const city = e.target.elements.city.value;
    if (city) {
      e.target.elements.city.value = '';
      WeatherDataService.forwardGeocoding(city);
    }
  }

  render() {
    return ` <form on-Submit={this.onSubmit}>
               <input class="search__input " name="city" placeholder="city" type="text" value="" />
               <button class="search__button" type="submit"/>search</button>
             </form>`
  }
}

//

ComponentFactory.register(SearchBar); // to register component class with factory
