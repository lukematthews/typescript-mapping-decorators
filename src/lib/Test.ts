import { mapToNamespace } from "./Mapped";
import { Person } from "./model/Person";

const person: Person = { name: "Luke", dob: "10/2/1981", age: 43 };
const to = {};

mapToNamespace(person, to, "DB", 'Person');

console.log(`to: ${to} ${JSON.stringify(to)}`);
