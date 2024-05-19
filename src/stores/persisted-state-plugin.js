export default function createPersistedStatePlugin(store, localItemName) {
  const persistedState = localStorage.getItem(localItemName);
  if (persistedState) {
    store.$state = JSON.parse(persistedState);
  }

  store.$subscribe((mutation, state) => {
    localStorage.setItem(localItemName, JSON.stringify(state));
  });
}
