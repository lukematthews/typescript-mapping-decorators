import {
  camelCase,
  constantCase,
  pascalCase,
  pascalSnakeCase,
  snakeCase
} from "change-case";

const mapperMetadataStorage = new Map<string, MappedOptions[]>();
const mapperClassNameStorage = new Map<string, MappedClassOptions[]>();
export const metadataStorage = new Map<string, any>();

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
  field?: string | ((to: any, val: any) => void);
  namespace: string;
  casing?: string;
}

export interface MappedClassOptions {
  namespace: string;
  prefix: string;
  casing: string;
}

export function Mapped(...options: MappedClassOptions[]) {
  return function (target: any, context: ClassDecoratorContext) {
    const metadataKey = `MappedClass_${String(target.name)}`;
    mapperClassNameStorage.set(metadataKey, options);
    context.metadata[context.name!] = options;
    metadataStorage.set(context.name!, context!.metadata);
  };
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
export function Field(...options: MappedOptions[]) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    if (context && context.metadata) {
      context.metadata[context.name] = options;
    }
  };
}

export function mapToNamespace<F extends Object>(
  from: F,
  to: any,
  namespace: string,
  fromClass?: string
) {
  const className = fromClass ? fromClass : from.constructor.name;
  const metadata = metadataStorage.get(className);
  const fieldsToMap = new Map<string, MappedOptions>();
  Object.keys(metadata).map((key) => {
    fieldsToMap.set(
      key,
      metadata[key].filter(
        (o: MappedOptions) => o.namespace === namespace
      )[0] ?? undefined
    );
  });
  const classMetadata = metadata[className] as MappedClassOptions;
  Object.entries(from).forEach(([key, value]) => {
    const option = fieldsToMap.get(key);
    if (option) {
      if (typeof option.field === "function") {
        option.field(to, value);
      } else if (typeof option.field === "string") {
        to[buildFieldName(option.field, option, classMetadata)] = value;
      } else {
        mapUsingClass(className, to, key, value, option);
      }  
    }
  });
}

function mapUsingClass(
  className: string,
  to: any,
  key: string,
  value: any,
  option: MappedOptions
) {
  mapperClassNameStorage
    .get(`MappedClass_${className}`)
    ?.filter((o) => o.namespace === option.namespace)
    ?.forEach((o) => {
      to[buildFieldName(key, option, o)] = value;
    });
}

function buildFieldName(name: string, fieldOptions: MappedOptions, classOptions: MappedClassOptions) {
  const fieldName = `${classOptions.prefix ?? ''}${name}`;
  const casing = fieldOptions.casing ? fieldOptions.casing : classOptions.casing;
  if (casing === "camelCase") {
    return camelCase(fieldName);
  } else if (casing === "constantCase") {
    return constantCase(fieldName);
  } else if (casing === "pascalCase") {
    return pascalCase(fieldName);
  } else if (casing === "pascalSnakeCase") {
    return pascalSnakeCase(fieldName);
  } else if (casing === "snakeCase") {
    return snakeCase(fieldName);
  }
  return fieldName;
}