const mapperMetadataStorage = new Map<string, MappedOptions[]>();

/**
 * @field field This is the field you want to map to. This can either be a string
 * which will directly map the value onto the target object. The other option is to
 * use a function. The function can be typed so you can use intellisense to map onto
 * a specific field on an object. This function could also do type conversion or any
 * other customer logic required.
 * @field namespace This is which namespace to apply a mapping to. For example, you
 * might have different naming conventions or logic between a database and a user
 * interface.
 */
export interface MappedOptions {
  field: string | ((to: any, val: any) => void);
  namespace: string;
}

/**
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

export function mapToNamespace<F extends object>(
  from: F,
  to: any,
  namespace: string,
  fromClass?: string
) {
  const className = fromClass ? fromClass : from.constructor.name;
  Object.entries(from).forEach(([key, value]) => {
    mapperMetadataStorage
      .get(`Mapped_${String(className)}_${key}`)
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
