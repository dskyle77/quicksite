/* eslint-disable @typescript-eslint/no-explicit-any */
function setDeep(obj: any, path: string, value: any) {
  const keys = path.split(".");
  const copy = structuredClone(obj);

  let current = copy;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) current[keys[i]] = {};
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;

  return copy;
}

export { setDeep };

/**
 * Update an object by path (supports nested fields and array indices).
 *
 * @param obj - The object to update (will be mutated).
 * @param path - A string path, e.g., "projects.items.1.title" (where "1" means items[1]).
 * @param value - The value to set at the specified path.
 */
export function updateByPath(obj: any, path: string, value: any): any {
  const parts = path.split(".");
  let curr = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    const nextKey = parts[i + 1];

    // If nextKey is a number, current key should be an array
    if (!isNaN(Number(nextKey))) {
      if (!Array.isArray(curr[key])) curr[key] = [];
      curr = curr[key];
      i++; // Move to number segment
      const arrIdx = Number(nextKey);
      // If the array doesn't have an object here, ensure it's present
      if (curr[arrIdx] === undefined) curr[arrIdx] = {};
      curr = curr[arrIdx];
    } else {
      // nextKey is not a number, so just an object key
      if (typeof curr[key] !== "object" || curr[key] === null) curr[key] = {};
      curr = curr[key];
    }
  }
  const lastKey = parts[parts.length - 1];
  curr[lastKey] = value;
  return obj;
}

/**
 * Batch update an object by multiple paths.
 *
 * @param obj - The object to update (will be mutated).
 * @param updates - An object where keys are paths and values are the values to set at those paths.
 * @returns The updated object.
 */
export function batchUpdateByPath(obj: any, updates: Record<string, any>): any {
  for (const path in updates) {
    if (updates.hasOwnProperty(path)) {
      updateByPath(obj, path, updates[path]);
    }
  }
  return obj;
}