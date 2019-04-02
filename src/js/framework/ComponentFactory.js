const ComponentFactory = {
  mappings: {},
  register: componentClass => ComponentFactory.mappings[componentClass.name] = componentClass,
  get: componentClassName => ComponentFactory.mappings[componentClassName],
};
export default ComponentFactory;
console.log(ComponentFactory);
/*
 Every component will need:
  1) import ComponentFactory from "../framework/ComponentFactory";
  2) ComponentFactory.register(ComponentClass); // to register component class with factory
 */
