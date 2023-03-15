export const isNullOrUndefinedOrEmpty = (...args) => {
  return args.length === 0 || args.some(value => value === null || value === undefined || value === "");
};

export const compareArraysOfObjectsAndReturnChanges = (array1, array2) => {
  const changes = [];
  let isFound = false;
  for (let i = 0; i < array1.length; i++) {
    isFound = false;
    for (let j = 0; j < array2.length; j++) {
      const element = array1[i];
      const element2 = array2[j];
      const changesInElement = compareFlatObjects(element, element2);
      if (changesInElement) {
        isFound = true;
        continue;
      }
    }
    if (!isFound) changes.push(array1[i]);
  }
  return changes;
};

export const compareFlatObjects = (object1, object2) => {
  const obj1 = JSON.stringify(object1);
  const obj2 = JSON.stringify(object2);
  return obj1 === obj2;
};
export const compareFlatObjectAndReturnChanges = (object1, object2) => {
  const obj1 = JSON.stringify(object1);
  const obj2 = JSON.stringify(object2);
  if (obj1 === obj2) return null;
  const changes = {};
  for (const key in object1) {
    if (object1.hasOwnProperty(key)) {
      const element = object1[key];
      if (element !== object2[key]) changes[key] = object2[key];
    }
  }
  return changes;
};
