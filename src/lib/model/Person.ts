import { Mapped, MappedClass } from "../Mapped";

@MappedClass({ namespace: 'DB', prefix: 'ZIM_$1', casing: 'constantCase'  })
export class Person {
  @Mapped(
    "Person",
    { field: "FULL_NAME", namespace: "DB" },
    { field: "commonName", namespace: "userInterface" }
  )
  name: string | undefined;
  @Mapped(
    "Person",
    {
      field: (out: any, val: any) => {
        out["DATE_OF_BIRTH"] = val;
      },
      namespace: "DB"
    },
    { field: "dateOfBirth", namespace: "userInterface" }
  )
  dob: string | null | undefined;
  age: number | null | undefined;
}