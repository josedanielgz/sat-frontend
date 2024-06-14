const saveInLocalStorage = (name, json) =>
  localStorage.setItem(name, JSON.stringify(json));

const getValueOfLocalStorage = (name) => JSON.parse(localStorage.getItem(name));

export { saveInLocalStorage, getValueOfLocalStorage };
