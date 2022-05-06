const { Organization } = require('@aasaam/information');
const project = require('@aasaam/information/logo/service/htm/info-en');

module.exports = {
  aasaam: Organization,
  copyright: 'Copyright {name}',
  dir: 'ltr',
  projectName: project.name,
  projectShortName: project.name,
  projectDescription: project.description,
  loading: 'Loading...',
  contactSupport: 'Contact {name} support',
  telSupport: 'Tel {name}',
  welcome: 'welcome',
  oops: 'Ooops!!',
  pageNotFound: 'That page not found or not available.',
  goBack: 'Go back Home...',
  noPermission: 'You have no permission to access this page.',
  updateConfiguration: 'Update Configuration',
  remove: 'Remove',
  itemsPerPage: 'Items per page',
  areYouSureDelete: 'Are you sure you want to delete this record?',
  copyText: 'Copy text',
  showConfig: 'Generated Configuration',
  configTextShow: 'Generated configuration is like this:',
  value: 'Value',
  checkingUploadResult: 'Checking upload result...',
  solveErrors: 'Dear user, please solve the following errors:',
  virtualhost: 'Virtualhost',
  tryAgain: 'Try again',
  updateAvailable: 'Update Available',
  startUploadConfiguration: 'Start upload configuration',
  uploadedResult: 'Uploaded result',
  Persian: 'Persian',
  English: 'English',
  deleted: 'Deleted',
  totpSetting: 'TOTP Config',
  synced: 'Synced',
  otp: 'OTP',
  daysLeft: 'Days left',

  // Special Errors
  protectionI18nOrgTitleRequired: 'Protection Organization Title is required.',

  // ## Login
  email: 'Email',
  password: 'Password',
  otpCode: 'OTP Code',
  login: 'Login',
  forgotPassword: 'Forgot Password ?',
  forgot_password: 'Forgot Password',
  captcha: 'Captcha',
  required: 'Field is required',
  sendMeCode: 'Send Code',
  resetPassword: 'Reset Password',
  recoverPassword: 'Recover Password',
  code: 'Code',
  newPassword: 'New password',
  repeatPassword: 'Repeat password',
  changePassword: 'Change Password',
  enterEmail: 'Enter your email in order to send you a code.',
  back: 'Back',
  resendCode: 'Resend Code?',
  totpSettings: 'TOTP Settings',

  // ## Toolbar
  showProfile: 'Show Profile',
  editProfile: 'Edit Profile',
  logOut: 'Logout',

  // ## Menu
  dashboard: 'Dashboard',
  certificateManagement: 'Certificate Management',
  certificateAdd: 'Add Certificate',
  certificateList: 'Certificate List',
  upstreamManagement: 'Upstream Management',
  upstreamList: 'Upstream List',
  upstreamAdd: 'Add Upstream',
  vhManagement: 'Virtual Hosts Management',
  vhAdd: 'Add Virtual Host',
  vhList: 'Virtual Host List',
  protectionManagement: 'Protection Management',
  protectionAdd: 'Add Protection Profile',
  protectionList: 'Protection Profile List',
  wafManagement: 'WAF Management',
  wafAdd: 'Add WAF Profile',
  wafList: 'WAF Profile List',
  nodeManagement: 'Node Management',
  nodeAdd: 'Add Node',
  nodeList: 'Node List',
  aclManagement: 'ACL Management',
  aclAdd: 'Add ACL Profile',
  aclList: 'ACL Profile List',
  userManagement: 'User Management',
  userAdd: 'Add User',
  userList: 'User List',
  setting: 'Setting',
  generalSetting: 'General Config',
  backupRestore: 'Backup/Restore',

  // ## Settings
  settingDoc1: `Editing this setting requires high skill knowledge of how HTM and it's
  dependencies works. If you are an expert then you can change these
  values, but if you are NOT do not change it. It can
  breaks the operation of HTM functionalities.`,
  settingDoc2: 'I sure hope you know what you are doing.',
  iKnow: 'I know',
  restore: 'Restore',
  backupDoc1:
    'Click on backup button therefore you can download your backup file.',
  startBackup: 'Start Backup',
  downloadBackup: 'Download Backup',
  restoreDoc2: 'You can upload your restore file. the allowed extensions is:',

  // ## Certificate
  certificateName: 'Certificate name',
  deleteCertificate: 'Delete certificate',
  certEdit: 'Edit certificate',
  fullChain: 'Full Chain',
  privateKey: 'Private Key',
  chain: 'Chain',
  name: 'Name',
  issuer: 'Issuer',
  endDate: 'Expire Date',
  sans: 'Sans',
  sigalg: 'Signature Algorithm',
  notAfter: 'Not After',

  // ## Upstream
  weightHint: 'sets the weight of the server, by default, 1.',
  deleteUpstream: 'Delete upstream',
  hashIp: 'Hash IP',
  resolver: 'Resolver',
  loadBalanceMethod: 'Load balance method',
  cookie: 'Cookie',
  roundRobin: 'Round Robin',
  configMood: 'Config Mode',
  standard: 'Standard',
  addServerFields: 'Add server fields',
  server: 'Server',
  weight: 'Weight',
  maxConnection: 'Max connection',
  maxFails: 'Max fails',
  failTimeout: 'Fail Timeout',
  backup: 'Backup',
  down: 'Down',
  method: 'Method',
  chooseMethod: 'Choose method',
  keepaliveRequest: 'Keep alive request',
  keepalive: 'Keepalive',
  keepaliveTime: 'Keepalive Time',
  keepaliveTimeout: 'Keepalive timeout',
  addAdvUpstream: 'Add advanced upstream',
  upstreamName: 'Upstream name',
  upstreamEdit: 'Edit upstream',
  orgTitle: 'Organization Title',
  orgIcon: 'Organization Icon',
  clientBodyBufferSize: 'Client Body Buffer Size',
  fillDoc:
    'Dear user, fill the advanced upstream fields or standard upstream fields. the important note is save the mode.',

  addStandardUpstream: 'Save as standard',
  addAdvancedUpstream: 'Save as advanced',
  standardUpstream: 'Standard upstream',
  advancedUpstream: 'Advanced upstream',
  serverHint: 'Server could be IP or domain',
  maxConnectionHint:
    'Limits the maximum number of simultaneous active connections to the proxied server.Could be 0 to unlimited.',

  maxFailsHint:
    'Sets the number of unsuccessful attempts to communicate with the server that should happen in the duration set by the fail_timeout parameter to consider the server unavailable for a duration also set by the fail_timeout parameter.',
  failTimeoutHint:
    'The time during which the specified number of unsuccessful attempts to communicate with the server should happen to consider the server unavailable.',
  keepaliveHint: 'Activates the cache for connections to upstream servers.',

  keepaliveTimeHint:
    'Limits the maximum time during which requests can be processed through one keepalive connection. After this time is reached, the connection is closed following the subsequent request processing.',
  keepaliveRequestHint:
    ' Sets the maximum number of requests that can be served through one keepalive connection. After the maximum number of requests is made, the connection is closed.  ',
  keepAliveTimeoutHint:
    ' Sets a timeout during which an idle keepalive connection to an upstream server will stay open.',

  // ## Virtualhost
  chooseWafProfile: 'Choose WAF Profile',
  saveAdvance: 'Save advanced',
  location: 'Location',
  locationFields: 'Location fields',
  orgIconHint: 'Example: si_linux. Click on the icon and choose icon.',
  agent: 'Agent',
  chooseAgent: 'Choose agent',
  addHost: 'Add host',
  chooseCertificate: 'Choose certificate',
  vhEdit: 'Edit Virtual Host',
  profileAdd: 'Add Profile',
  loadbalance: 'Load Balance',
  chooseProtocol: 'Choose Protocol',
  protocol: 'Protocol',
  deleteProfile: 'Delete Profile',
  virtualhostList: 'Virtualhost List',
  deleteVirtual: 'Delete virtualhost',
  certificate: 'Certificate',
  chooseSchema: 'Choose Schema',
  path: 'Path',
  locationType: 'Location Type',
  chooseType: 'Choose Type',
  vhName: 'Virtual host name',
  mood: 'Mode',
  mode: 'Mode',
  waf: 'WAF',
  host: 'Host',
  status: 'Status',
  toUrl: 'To Url',
  addStandardVh: 'Add Standard VirtualHost',
  addAdvanceVh: 'Add Advanced VirtualHost',
  keepAliveRq: 'Keep Alive Request',
  keepAliveTimeout: 'Keep Alive Timeout',
  requestPullSize: 'Request Pull Size',
  clientHeaderTimeout: 'Client Header Timeout',
  clientHeaderBufferSize: 'Client Header Buffer Size',
  largeClientHeaderBufferSize: 'Large Client Header Buffer Size',
  hostList: 'Host List',
  chooseAcl: 'Choose Acl',
  chooseUpstream: 'Choose Upstream',
  acl: 'Acl',
  standardCache: 'Standard Cache',
  activeProtection: 'Active Protection',
  key: 'Key',
  deleteVh: 'Delete VirtualHost',
  sortBy: 'Sort By',
  alwaysServeHttps: 'Always Serve HTTPS',
  standardVhost: 'Standard VirtualHost',
  advancedVhost: 'Advanced VirtualHost',
  saveStandard: 'Save Standard',
  saveAdvanced: 'Save Advanced',
  vhGuid:
    'Dear user, fill the mood you are most comfortable with. But the important note is you have to decide in witch mood you want to save the configuration. Make sure to fill the radio button fields.',
  chooseWafMode: 'Choose WAF Mode',
  requestPoolSize: 'Request Pool Size',
  serverKeepAliveRqHint:
    'Sets the maximum number of requests that can be served through one keep-alive connection. After the maximum number of requests are made, the connection is closed.',

  serverKeepAliveTimeout: 'KeepAlive Timeout',
  serverKeepAliveTimeoutHint:
    'Sets a timeout during which a keep-alive client connection will stay open on the server side. The zero value disables keep-alive client connections.',

  serverRequestPoolSize: 'Request Pool Size',
  serverRequestPoolSizeHint:
    'Default is 4k. Allows accurate tuning of per-request memory allocations. This directive has minimal impact on performance and should not generally be used.',

  hostListHint: 'Separate Each hostname by enter.',
  serverClientHeaderTimeoutHint:
    'Default is 60s. Defines a timeout for reading client request header. If a client does not transmit the entire header within this time, the request is terminated with the 408 (Request Time-out) error.',
  serverClientHeaderBufferSizeHint:
    'Default is 1k. Sets buffer size for reading client request header. For most requests, a buffer of 1K bytes is enough.',

  serverLargeClientHeaderBufferSizeHint:
    'Default is 8k. If a request includes long cookies, or comes from a WAP client, it may not fit into 1K. If a request line or a request header field does not fit into this buffer then larger buffers, configured.',

  largeClientHeaderBufferNumber: 'Large Client Header Buffer Number',
  serverLargeClientHeaderBufferNumberHint:
    'Default is 4. Sets the maximum number of buffers used for reading large client request.',
  redirect: 'Redirect',
  proxy: 'Proxy',
  clientMaxBodySize: 'Client Max Body Size',
  clientMaxBodySizeHint:
    'Sets the maximum allowed size of the client request body.',
  clientBodyBufferSizeHint:
    'Sets buffer size for reading client request body. default is 10M.',
  addProxyHeader: 'Add Proxy Header',
  addHeader: 'Add Header',

  // ## Protection
  ldapUri: 'LDAP URI',
  ldapUriHint: 'Example: ldap://ldap.example.com:389',
  ldapRoPasswordHint: 'Example: readonlyPassword',
  ldapBaseDnHint: 'Example: dc=example,dc=com',
  ldapFilterHint: 'Example: (uid=__USERNAME__)',
  ldapAttributesHint: 'Example: ["dn", "cn", ""]',
  ldapRoUsernameHint: 'Example: readonlyUser',
  challenge: 'Challenge',
  deleteProtectionProfile: 'Delete profile',
  profileName: 'Profile name',
  chooseChallenge: 'Choose challenge',
  chooseCaptchaLang: 'Choose captcha language',
  captchaTtl: 'Captcha ttl',
  configuration: 'Configuration',
  chooseDefaultLang: 'Choose default lang',
  protectionOtpTime: 'Protection OTP time',
  GenerateSecret: 'Generate Secret',
  protectionConfigWaitToSolve: 'Protection Config Wait To Solve',
  protectionConfigTimeout: 'Protection config timeout',
  editProtectionProfile: 'Edit Protection Profile',
  profileEdit: 'Profile Edit',
  aclConfiguration: 'ACL Configuration',
  challengeConfiguration: 'Challenge Configuration',
  protectionAclConfDescription: `
  Dear User, By selecting any of the following rules, the client can receive the response without facing the challenge of protection.
  Note that the following rules are "or";
  That is mean; if the country rule was true for the client, other rules will not be checked.
  `,
  protectionChallengeDescription: `
  <h5> JS Challange :</h5>
  <p class="pt-1 pb-1 caption">
  In this mechanism, after executing the JavaScript code in the client browser, access will be opened.
  This mechanism is used to block software bots that do not have a JavaScript engine.
  </p>
  <h5> Captcha Challange :</h5>
  <p class="pt-1 pb-1 caption">
  In this mechanism, the user sees an image containing numbers and after entering the code, access will be opened for user.
  This mechanism is used to block software bots that do not have captcha resolution methods.
  </p>
  <h5> TOTP Challange :</h5>
  <p class="pt-1 pb-1 caption">
  In this mechanism, assuming a limited number of users, you share the possibility of accessing the desired destination with them. This mechanism is used to further ensure access to enterprise resources with limited users.
  You can install special software for generating otp secret.
  </p>
  <h5> LDAP Challange :</h5>
  <p class="pt-1 pb-1 caption">
  In this mechanism, by connecting to the Active Directory or OpenLDAP service, or any service that has the LDAP standard, create authorized access for users using the following settings.
  This mechanism is used to access the desired resources using the access system of any organization.
  </p>
  <h5> BLOCK Challange:</h5>
  <p class="pt-1 pb-1 caption">
  Access will be blocked if the user profile does not contain any of the ACL rules.
  </p>
  `,
  attention: 'Attention',
  addOrgTitle: 'Add Organization Title',
  addOrgDesc:
    'Please fill the organization title in front of the each language.',
  protectionConfigTtl: 'Protection Config Ttl',
  captchaDifficulty: 'Captcha Difficulty',
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
  totp_info:
    'Dear user, use otp secret for private website. In order to activate otp, please click on Generate Secret button. Then Scan the QrCode to your application.',
  remainTime: 'Remain Time',
  ldapRoUsername: 'LDAP readonly username',
  ldapRoPassword: 'LDAP readonly password',
  ldapBaseDn: 'Base DN',
  ldapFilter: 'Filter',
  ldapAttributes: 'Attributes',
  duplicateApiTitle: 'Duplicate API Title',
  number: 'No',
  apiKeyTitle: 'API Key Title',
  apiKeyToken: 'API Key Token',
  asnRangeSelect: 'ASN Range Select',
  asnRangeSelectHint: 'Asn range example: 61952-62463',
  asnRangeWrongFormat:
    'This {field} is not valid asn-range & will be removed in 4s.',
  asnSelect: 'ASN Select',
  asnSelectHint: 'ASN example: 15169, 13414, 32934',
  asnWrongFormat: 'This {field} is not valid asn & will be removed in 4s.',
  challengeJs: 'JS',
  challengeCaptcha: 'CAPTCHA',
  challengeTotp: 'TOTP',
  challengeLdap: 'LDAP',
  challengeBlock: 'BLOCK',
  cidrSelect: 'Select CIDR',
  cidrSelectHint: 'CIDR example: 192.168.0.0/23',
  wrongFormat: 'This {field} is not valid & will be removed in 4s.',
  selectCountry: 'Select Country',
  country: 'Country',

  // ## Waf
  docs: 'Docs',
  addWhiteListRules: 'Add WhiteList Rules',
  rule: 'Rule',
  description: 'Description',
  deleteWaf: 'Delete WAF profile',
  matchzone: 'Match Zone',
  target: 'Target',
  wafEdit: 'Edit WAF profile',
  pageSpeed: 'Page Speed',
  whiteList: 'White List',
  naxiDoc1: `
  Whitelists are meant to instruct naxsi to ignore specific patterns in
  specific context(s) to avoid false positives. ie. Allow the '
  character in the field named term at url /search : BasicRule wl:1013
  "mz:$ARGS_VAR:term|$URL:/search";
  `,
  syntax: 'Syntax',
  whiteListId: ' Whitelisted ID (wl:...):',
  allRules: 'All Rules',
  internalRules: 'Internal Rules',
  sqlInjectionRules: 'SQL Injections',
  obviousRfiRules: 'Obvious RFI (Remote File Inclusion)',
  directoryTraversalRules: 'Directory traversal',
  xssRules: 'Cross Site Scripting',
  evadingTrick: 'Evading tricks',
  fileUploadRules: 'File uploads',
  id: 'ID',
  naxiDoc2: `
  4 main zones exist : URL, ARGS, HEADERS, BODY, and matchzone can be
  more or less restrictive.
  A match zone can be wide :
  `,
  naxiDoc3: 'Or more specific :',
  naxiDoc4:
    'Sometime, regular expressions are needed (ie. variable names can vary)',
  naxiDoc5:
    'A matchzone can be restricted to a specific URL : (but is not a zone on its own)',
  naxiDoc6: `
  A matchzone that targets BODY,HEADERS,ARGS can add |NAME to specify
  the target is not the content of a variable, but its name itself.

  It is useful in specific contexts (ie. whitelist [ ] in form var names
    on url /foo).
    for example :
  `,
  ruleGenerator: 'Rule Generator Helper',

  naxiDoc7: `
  This tools will help you to generate valid rule. Try your condition with below form and copy your generated rule. If your rules are so complicated and does not fit in this form, feel free to close this and enter them manually.
  `,
  regexValue: 'Regex Value',
  copyRule: 'Copy Rule',
  wafRuleHint: 'BasicRule wl:0 "mz:$HEADERS_VAR:cookie"',
  wafNameHint: '* No special characters allowed',

  // ## Acl
  deleteAcl: 'Delete ACL',
  aclEdit: 'Edit ACL',
  blackList: 'Black List',
  aclDoc: 'Profile based on IP Address or Subnet',
  list: 'List',
  aclDoc2: 'Private IP Help:',
  aclDoc1: 'Enter IP Address or Subnet',
  aclListHint:
    'Separate IP Address or Subnet with enter. each line is one IP or Subnet.',

  // ## Node
  nodeEdit: 'Edit node',
  deleteNode: 'Delete Node',
  ip: 'IP',
  token: 'Token',
  port: 'Port',
  tlsVersion: 'TLS version',
  nodeToken: 'Node Token',
  nodeId: 'Node ID',
  chooseTlsVersion: 'Choose TLS version',
  checkNodeStatus: 'Check node status',
  intermediate: 'Intermediate',
  modern: 'Modern',
  legacy: 'Legacy',
  nodeInfo: 'Node Information',
  updatingNodeResult: 'Updating node result',
  applyConfiguration: 'Apply configuration & restart',

  // ## User
  username: 'Username',
  currentPassword: 'Current Password',
  superAdmin: 'Super Admin',
  roles: 'Roles',
  active: 'Active',
  rawPassword: 'Password',
  chooseRole: 'Choose Role',
  deleteUser: 'Delete User',
  editUser: 'Edit User',
  showSvg: 'Show QrCode',
  profile: 'My Profile',
  editData: 'Edit Main Data',
  editPassword: 'Edit Password',
  enterRecoverCode: 'A code has been send to your email, Enter the code below',
  otpguidemessage1:
    'Dear user , in order to activate otp, first click on the link below and install the right application witch fit your operating system version.',
  otpGuideMessage2:
    'Now, click on the generate secret button, and scan the qrcode to your application. you have one minute to scan the code. after that the code will be disappear. Each time you click on the generate button , it will create a new otp secret, and the previews code is unreachable.',
  googlePlayDownload: 'Google Play Download',
  appStoreDownload: 'App Store Download',
  fdroidDownload: 'F-Droid Download',

  restoreFile: 'Restore File',
  chooseStatus: 'Choose status',
  apikeytitle: 'Write api key title',
  schema: 'Schema',
  protectionProfile: 'Protection Profile',
  upstream: 'Upstream',

  choosUpstream: 'Choose Upstream',
  choosePageSpeedProfile: 'Choose PageSpeed Profile',
  pageSpeedProfile: 'Page Speed Profile',
  choosWafProfile: 'Choose WAF Profile',
  chooseProtectionProfile: 'Choose Protection Profile',

  wafmood: 'WAF Mood',
  choosCertificate: 'Choose Certificate',
  VhPort: 'VrtualHost Port',

  // ## Global
  advance: 'Advance',
  noResult: 'No Result',
  noData: 'No Data',
  action: 'Action',
  clear: 'Clear',
  accept: 'Accept',
  apply: 'Apply',
  upload: 'Upload',
  title: 'Title',
  reset: 'Reset',
  close: 'Close',
  admin: 'Admin',
  viewer: 'Viewer',
  inactive: 'Inactive',
  nope: 'No',
  add: 'Add',
  edit: 'Edit',
  iAgree: 'I accept the consequences of changing configuration.',
  success: {
    WELCOME: 'Welcome',
    CREATED: 'Successfully Created.',
    EDITED: 'Successfully Edited.',
    UPDATED: 'Successfully Updated.',
    DELETED: 'Successfully Deleted.',
    RESTORED: 'Successfully Restored Backup.',
    HEALTHY: 'Successfully Healthy.',
  },
  errors: {
    ISREQUIRE_FIELD: 'This field is required.',
    INVALID_EMAIL_FORMAT: 'Invalid email format.',
    NOT_SET: 'Not set.',
    UNAUTHORIZED: 'Unauthorized.',
    ISREQUIRE_ID: 'ID is required.',
    ISREQUIRE_EMAIL: 'Email is required.',
    NOT_MATCH_PASSWORD: 'Password is not match.',
    ISREQUIRE_PASSWORD: 'Password is required.',
    PASSWORD_MIN: 'Password must be at least 7 characters.',
    PASSWORD_MAX: 'Password must be less than 32 characters.',
    INVALID_OPTION: 'Invalid option.',
    INVALID_REGEX: 'Invalid regex.',
    INVALID_PASSWORD: 'Invalid password.',
    INVALID_IP_OR_DOMAIN: 'Invalid IP or Domain.',
    NOT_EXIST: 'Not exist.',
    OTHER_ERROR: 'Other error.',
    FORBIDDEN: 'Forbidden.',
    DUPLICATE_ENTRY: 'Duplicate entry.',
    NOT_ALLOWED: 'Not allowed.',
    UNPROCESSABLE_ENTITY: 'Unprocessable entity.',
    INVALID_IP: 'Invalid IP.',
    NOT_MATCH_KEYCHAIN: 'Not match keychain.',
    MOOD_MIN: 'Mode must be at least 0.',
    MOOD_MAX: 'Mode must be less than 1.',
    IS_NOT_IP: 'Invalid IP.',
    INVALID_PORT: 'Invalid port.',
    INVALID_TLS_VERSION: 'Invalid TLS version.',
    INVALID_WAF_RULE: 'Invalid WAF rule.',
    INVALID_PAGE_SPEED: 'Invalid PageSpeed profile.',
    NAME_MIN: 'Name must be at least 4 characters.',
    NAME_MAX: 'Name must be less than 33 characters.',
    COUNTRY_INVALID: 'Invalid country.',
    INVALID_CIDR: '',
    ASN_MIN: 'ASN must be at least 0',
    ASN_MAX: 'ASN must be less than 4294967295',
    SMTP_ERROR: 'SMTP error.',
    // /^[a-zA-Z][a-zA-Z0-9]{3,31}$/
    INVALID_NAME_REGEX:
      'Invalid name format. (Only English letters, numbers are allowed.)',
    DEFAULT_LANGUAGE_INVALID: 'Invalid default language.',
    CHALLENGE_INVALID: 'Invalid challenge.',
    CAPTCHA_LANG_INVALID: 'Invalid captcha language.',
    TTL_MIN: 'TTL must be at least 3600.',
    TTL_MAX: 'TTL must be less than 604800.',
    TIMEOUT_MIN: 'Timeout must be at least 300.',
    TIMEOUT_MAX: 'Timeout must be less than 1800.',
    CONFIG_WAIT_TO_SOLVE_MIN: 'Config wait to solve must be at least 2.',
    CONFIG_WAIT_TO_SOLVE_MAX: 'Config wait to solve must be less than 180.',
    INVALID_ASN_RANGE: 'Invalid ASN range.',
    INVALID_PROTECTION_SUPPORTED_LANG:
      'Invalid supported language for protection.',
    CAPTCHA_DIFFICULTY_INVALID: 'Invalid captcha difficulty value.',
    LDAP_URI_INVALID: 'Invalid LDAP URI.',
    LDAP_ATTRIBUTES_INVALID: '',
    NOT_INTEGER: 'Not integer.',
    INVALID_ADVANCE: 'Invalid advance value. must be 0 or 1.',
    WEIGHT_MIN: 'Weight must be at least 1.',
    MAX_CONNECTION_MIN: 'Max connection must be at least 0.',
    MAX_FAILS_MIN: 'Max fails must be at least 1.',
    FAIL_TIMEOUT_MIN: 'Fail timeout must be at least 10.',
    INVALID_BACKUP: 'Invalid backup.',
    INVALID_DOWN: 'Invalid down.',
    INVALID_LOAD_BALANCE_METHOD: 'Invalid load balance method.',
    KEEPALIVE_MIN: 'Keepalive must be at least 8.',
    KEEPALIVE_RQ_MIN: 'Keepalive rq must be at least 1.',
    KEEPALIVE_TIME_MIN: 'Keepalive time must be at least 1.',
    KEEPALIVE_TIMEOUT_MIN: 'Keepalive timeout must be at least 1.',
    INVALID_OBJECTID: 'Invalid object id.',
    INVALID_HOST: 'Invalid host.',
    INVALID_KEEP_ALIVE_RQ: 'Invalid keep alive request. Min 1.',
    INVALID_KEEP_ALIVE_TIMEOUT: 'Invalid keep alive timeout. Min 0.',
    INVALID_REQUEST_POOL_SIZE: 'Invalid request pool size. Min 1.',
    INVALID_CLIENT_HEADER_TIMEOUT: 'Invalid client header timeout. Min 1.',
    INVALID_CLIENT_HEADER_BUFFER_SIZE:
      'Invalid client header buffer size. Min 1.',
    INVALID_LARGE_CLIENT_HEADER_BUFFER_SIZE:
      'Invalid large client header buffer size. Min 1.',
    INVALID_LARGE_CLIENT_HEADER_BUFFER_NUMBER:
      'Invalid large client header buffer number. Min 1.',
    INVALID_WAF_MODE: 'Invalid WAF mode.',
    INVALID_CLIENT_MAX_BODY_SIZE: 'Invalid client max body size. Min 1.',
    INVALID_LOCATION_TYPE: 'Invalid location type.',
    INVALID_CLIENT_BODY_BUFFER_SIZE: '',
    NOT_BOOLEAN: 'Not boolean.',
    INVALID_HEADER: 'Invalid header.',
    INVALID_PROXY_HEADER: 'Invalid proxy header.',
    INVALID_LOCATION: 'Invalid location.',
    INVALID_ALWAYS_SERVE_HTTP: '',
    ZIP_ERROR: 'Error accrued while zipping.',
    BACKUP_ERROR: 'Error accrued while backing up.',
    INTERNAL_SERVER_ERROR: '',
  },

  // ## validations
  validations: {
    ip: 'The {_field_} field is not a valid IP address.',
    ipPort: 'The {_field_} field is not a valid IP address or port.',
    passwordcnf: 'Password is not match.',
    port: 'The {_field_} field is not a valid port.',
    upstreamServer: 'Invalid upstream server.',
    url: 'The {_field_} field is not a valid URL.',
    profileNameValidation:
      'Name must be between 4 and 31 characters. Only English letters and numbers are allowed. Do not use spaces/special characters/dash/underscore.',
    wafzero: 'WAF rule cant mix with zero.',
    alpha: 'The {_field_} field may only contain alphabetic characters',
    alpha_num: 'The {_field_} field may only contain alpha-numeric characters',
    alpha_dash:
      'The {_field_} field may contain alpha-numeric characters as well as dashes and underscores',
    alpha_spaces:
      'The {_field_} field may only contain alphabetic characters as well as spaces',
    confirmed: 'The {_field_} field confirmation does not match',
    digits:
      'The {_field_} field must be numeric and exactly contain {length} digits',
    email: 'The {_field_} field must be a valid email',
    ext: 'The {_field_} field is not a valid file',
    integer: 'The {_field_} field must be an integer',
    length: 'The {_field_} field must be 0:{length} long',
    max_value: 'The {_field_} field must be 0:{max} or less',
    max: 'The {_field_} field may not be greater than 0:{length} characters',
    min_value: 'The {_field_} field must be 0:{min} or more',
    min: 'The {_field_} field must be at least 0:{length} characters',
    numeric: 'The {_field_} field may only contain numeric characters',
    regex: 'The {_field_} field format is invalid',
    required_if: 'The {_field_} field is required',
    required: 'The {_field_} field is required',
  },
};
