const protocol = /^http.*/;
const upstreamName = /[a-z][a-z0-9_]{4,30}[a-z]/;
const domainPort =
  /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,}):\d{4}$|^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})/;

export { protocol, upstreamName, domainPort };
