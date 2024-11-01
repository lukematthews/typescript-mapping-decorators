import { Mapped } from "../Mapped";

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
    { field: "commonName", namespace: "userInterface" }
  )
  dob: string | null | undefined;
  age: number | null | undefined;
}
