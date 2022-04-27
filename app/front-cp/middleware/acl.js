/* eslint-disable no-useless-return */
export default function ({ store, redirect, route, app, error }) {
  // role based check.
  const permissions = [].concat(
    ...route.matched.map((r) => {
      return r.components.default.options
        ? r.components.default.options.permissions
        : r.components.default.permissions;
    }),
  );

  const currentRole = store.getters['user/auth/GET_ROLE'];

  if (route.path === '/' || currentRole === ['SA']) {
    return;
  } else if (permissions.includes(...currentRole)) {
    return;
  } else {
    return error({
      statusCode: 403,
    });
  }
}
