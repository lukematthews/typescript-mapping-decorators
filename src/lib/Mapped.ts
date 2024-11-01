const mapperMetadataStorage = new Map<string, MappedOptions[]>();

export interface MappedOptions {
  field: string | ((out: any, val: any) => void);
  namespace: string;
}

/**
 * '@Mapped'
 * 
 * This decorator is used to specify how a field should be mapped to a target object.
 * 
 * You can have different logic for mapping properties to different namespaces.
 * 
 * For example, you may map to a database column name for the DB namespace and then
 * map to a different format field name for the cache or ui.
 * 
 * 
 * @param className This is the name of the class that has the property decoratored.
 * This is needed because unfortunately, the type of the class is not available when
 * the decorator is created.
 * @param options The options for the mapping. field is the target field you are mapping to.
 * This can either be a string to map directly to any property specified or a callback function
 * that has 'out' which is the object that you are mapping to and the 'val' value that is being
 * mapped. As this is a callback, you can do whatever transformations you want.
 */
export function Mapped(className: string, ...options: MappedOptions[]) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    const metadataKey = `Mapped_${className}_${String(context.name)}`;
    mapperMetadataStorage.set(metadataKey, options);
  };
}

export const classNames = new WeakMap<object, string>();

export function MappedToNamespace() {
  return function (target: any, _context: ClassDecoratorContext) {
    classNames.set(target.prototype, target.name);
  };
}

export function getMetadata(target: any, propertyName: string) {
  const key = `Mapped_${target.constructor.name}_${propertyName}`;
  return mapperMetadataStorage.get(key);
}

export function mapToNamespace(
  from: any,
  to: any,
  namespace: string,
  fromClass: string
) {
  Object.entries(from).forEach(([key, value]) => {
    mapperMetadataStorage
      .get(`Mapped_${String(fromClass)}_${key}`)
      ?.filter((option) => option.namespace === namespace)
      ?.forEach((option) => {
        if (typeof option.field === "function") {
          option.field(to, value);
        } else if (typeof option.field === "string") {
          to[option.field] = value;
        }
      });
  });
}

class Person {
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
}

class Human {}

const person: Person = { name: "Luke", dob: "10/2/1981" };
const to = new Human();

mapToNamespace(person, to, "DB", "Person");
console.log(JSON.stringify(to));
