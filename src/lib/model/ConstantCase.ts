import { Field, Mapped } from "../Mapped";

@Mapped({ namespace: "DB", prefix: "ZIM_", casing: "constantCase" })
export class ConstantCase {
  @Field({ namespace: "DB" })
  name: string | undefined;
  dob: string | null | undefined;
  age: number | null | undefined;
  @Field({ namespace: "DB", casing: 'snakeCase' })
  dateOfBirth: string | null | undefined;
}
