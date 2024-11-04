// export { Mapped, Field, MappedClass, MappedClassOptions, MappedOptions, mapToNamespace } from "./Mapped";

import { mapToNamespace } from "./Mapped";
import { Person } from "./model/Person";
import { ConstantCase } from "./model/ConstantCase";

let person = new Person();
person.name = "Luke";
person.dob = "10/2/1981";
person.age = 43;

let to = {};
mapToNamespace<Person>(person, to, "DB");
console.log(`DB: ${JSON.stringify(to)}`);

person = { name: "Luke", dob: "10/2/1981", age: 43 };
to = {};
mapToNamespace<Person>(person, to, "userInterface", "Person");
console.log(`userInterface: ${JSON.stringify(to)}`);

let constantCaseTest = new ConstantCase();
constantCaseTest = {
  name: "Luke",
  dob: "10/2/1981",
  age: 43,
  dateOfBirth: "10/2/1981"
};
to = {};
mapToNamespace<ConstantCase>(constantCaseTest, to, "DB", "ConstantCase");
console.log(`ConstantCase: ${JSON.stringify(to)}`);
