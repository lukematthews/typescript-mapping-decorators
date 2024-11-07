import { Field, Mapped } from "../Mapped";

@Mapped({ namespace: 'DB', prefix: 'ZIM_$1', casing: 'constantCase'  })
export class Person {
  @Field(
    { field: "FULL_NAME", namespace: "DB" },
    { field: "commonName", namespace: "userInterface" }
  )
  name: string | undefined;
  @Field(
    {
      field: (out: any, val: any) => {
        out.age = { full: val };
      },
      namespace: "DB"
    },
    { field: "dateOfBirth", namespace: "userInterface" }
  )
  dob: string | null | undefined;
  age: number | null | undefined;
}