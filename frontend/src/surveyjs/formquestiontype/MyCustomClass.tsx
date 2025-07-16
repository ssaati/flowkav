import { Question, ElementFactory } from "survey-core";

export class MyCustomClass extends Question {
  getType() {
    return "my-custom-class";
  }
  get myCustomProperty() {
    return this.getPropertyValue("myCustomProperty");
  }
  set myCustomProperty(val) {
    this.setPropertyValue("myCustomProperty", val);
  }
}

ElementFactory.Instance.registerElement("my-custom-class", (name) => {
  return new MyCustomClass(name);
});
