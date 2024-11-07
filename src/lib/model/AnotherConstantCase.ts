import { Field, Mapped } from "../Mapped";

@Mapped({ namespace: "DB", prefix: "ZIM_ACC_", casing: "constantCase" })
export class AnotherConstantCase {
  @Field({ namespace: "DB" })
  name: string | undefined;
  dob: string | null | undefined;
  age: number | null | undefined;
  @Field({ namespace: "DB" })
  dateOfBirth: string | null | undefined;
}
