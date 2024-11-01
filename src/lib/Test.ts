import { mapToNamespace } from "./Mapped";
import { Person } from "./model/Person";

let person = new Person();
person.name = "Luke";
person.dob = "10/2/1981";
person.age = 43;

let to = {};
mapToNamespace<Person>(person, to, "DB");
console.log(`DB: ${JSON.stringify(to)}`);


person =  { name: "Luke", dob: "10/2/1981", age: 43};
to = {};
mapToNamespace<Person>(person, to, "userInterface", "Person");
console.log(`userInterface: ${JSON.stringify(to)}`);
