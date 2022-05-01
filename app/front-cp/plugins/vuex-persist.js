// eslint-disable-next-line import/no-named-as-default
import VuexPersistence from 'vuex-persist';

export default ({ store }) => {
  new VuexPersistence({
    /* your options */
    key: '_persistStates',
    modules: ['user', 'helper', 'setting'],
  }).plugin(store);
};

// export default ({ store }) => {
//   window.onNuxtReady(() => {
//     new VuexPersistence({
//       storage: window.localStorage,
//       key: '_persistStates',
//       modules: ['user', 'helper', 'setting'],
//     }).plugin(store);
//   });
// };
