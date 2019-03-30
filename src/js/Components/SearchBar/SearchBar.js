import Component from '../../framework/Component';
import ComponentFactory from '../../framework/ComponentFactory';
import WeatherDataService from '../../Services/WeatherDataService';
import AppState from '../../Services/AppState';


export default class SearchBar extends Component {
  constructor(host, props) {
    super(host, props);
    AppState.watch('CITY', this.updateMyself);
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


    // do update
    this.updateState(subState);
  }

  onSubmit(e) {
    e.preventDefault();
    WeatherDataService.forwardGeocoding('kiev');
    console.log('nn,mnm');
    // const city = e.target.elements.city.value;
    // console.log('onSubmit run', city);
    // this.props.onSubmit(city);
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
