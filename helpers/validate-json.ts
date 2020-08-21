import difference from "lodash/difference";

export const getMissingKeys = (
  requiredKeys: string[],
  object: object
): { missingKeys: string[]; wrongKeys?: string[] } => {
  const missingKeys = difference(requiredKeys, Object.keys(object));
  const wrongKeys = difference(Object.keys(object), requiredKeys);

  return {
    missingKeys: missingKeys.length && missingKeys,
    wrongKeys: wrongKeys.length && wrongKeys,
  };
};
