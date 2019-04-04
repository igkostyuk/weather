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
    this.state = {};
  }

  updateMyself(subState) {
    this.updateState(subState);
  }

  onSubmit(e) {
    e.preventDefault();
    const city = e.target.elements.city.value;
    if (city) {
      e.target.elements.city.value = '';
      WeatherDataService.setCity(city);
    }
  }

  render() {
    return ` <form on-Submit={this.onSubmit}>
               <input class="search__input " name="city" placeholder="city" type="text" value="" />
               <button class="search__button" type="submit"/>search</button>
             </form>`;
  }
}

//

ComponentFactory.register(SearchBar); // to register component class with factory
