import { mapToNamespace, metadataStorage } from "./Mapped";
import { Person } from "./model/Person";
import { ConstantCase } from "./model/ConstantCase";
import { AnotherConstantCase } from "model/AnotherConstantCase";
import { RfsbCreateMlnAccountRequest } from "model/RfsbCreateMlnAccount";
import { RequestFields } from "model/RequestFields";

let anotherConstantCaseTest = new AnotherConstantCase();
anotherConstantCaseTest = {
  name: "Luke",
  dob: "10/2/1981",
  age: 43,
  dateOfBirth: "10/2/1981"
};

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
constantCaseTest.name = "Luke";
constantCaseTest.dob = "10/2/1981";
constantCaseTest.age = 43;
constantCaseTest.dateOfBirth = "10/2/1981";
to = {};
mapToNamespace<ConstantCase>(constantCaseTest, to, "DB");

console.log(`ConstantCase: ${JSON.stringify(to)}`);
