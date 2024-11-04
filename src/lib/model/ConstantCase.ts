import { Field, MappedClass } from "../Mapped";

@MappedClass({ namespace: "DB", prefix: "ZIM_", casing: "constantCase" })
export class ConstantCase {
  @Field("ConstantCase", { namespace: "DB" })
  name: string | undefined;
  dob: string | null | undefined;
  age: number | null | undefined;
  @Field("ConstantCase", { namespace: "DB" })
  dateOfBirth: string | null | undefined;
}
