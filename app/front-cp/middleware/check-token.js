export default function ({ store, redirect, route }) {
  if (store.getters['user/auth/GET_AUTHENTICATED']) {
    store.dispatch('user/auth/refreshToken');
  } else {
    console.log('not authenticated');

    if (route.path !== '/') {
      return redirect('/');
    }
  }
}
