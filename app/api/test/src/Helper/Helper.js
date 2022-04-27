class Helper {
  constructor(container) {
    this.container = container;
  }

  /**
   *
   * @param {*} email
   * @param {*} role
   * @param {*} active
   * @returns
   */
  async CreateUserHeaderAndToken(email, role, active) {
    const user = await this.CreateHelperUser(email, role, active);

    const token = await this.container.resolve('JWT').sign(
      {
        uid: user.id,
        roles: user.roles,
      },
      600,
    );
    return {
      user,
      token,
    };
  }

  /**
   *
   * @param {*} email
   * @param {*} role
   * @param {*} active
   * @returns
   */
  async CreateHelperUser(email, role, active = true) {
    const userData = {
      email,
      password: 'onCHGni7i7EfdF$@',
      roles: role,
      active,
    };

    const createUser = this.container.resolve('CreateUserRepository');

    return createUser.addUser(
      userData.email,
      userData.password,
      userData.roles,
      active,
    );
  }

  async createAdvanceVh() {
    const createVh = this.container.resolve('CreateVhRepository');

    const sample = {
      name: 'testvhadv',
      advance: 1,
      advancedBody: `
      server {
        listen   80;
        server_name example.org www.example.org
        error_page 404 errors/404.html;
        access_log logs/star.yourdomain.com.access.log;

        index index.php index.html index.htm;

        # static file 404's aren't logged and expires header is set to maximum age
        location ~* .(jpg|jpeg|gif|css|png|js|ico|html)$ {
          access_log off;
          expires max;
        }
      }
      `,
    };

    // add advanced server
    return createVh.addVh(sample);
  }

  async createAdvanceUpstream() {
    const createUps = this.container.resolve('CreateUpstreamRepository');

    const sample = {
      name: 'testadvanced',
      advance: 1,
      advancedBody: `server backend1.example.com weight=5;
      server 127.0.0.1:8080       max_fails=3 fail_timeout=30s;
      server unix:/tmp/backend3;
      server backup1.example.com  backup;`,
    };

    // add advanced upstream
    return createUps.addUpstream(sample);
  }

  async createProtection() {
    const createProtection = this.container.resolve(
      'CreateProtectionRepository',
    );

    const sample = {
      name: 'imagrprotecttest',
      country: ['IR'],
      cidr: ['192.168.0.0/21'],
      asn: ['32934', '13414'],
      asnRange: ['61952-62465'],
      protectionDefaultLang: 'fa',
      protectionSupportedLang: ['fa', 'en'],
      protectionI18nOrgTitle: {
        fa: 'تصویر برای امنیت',
        en: 'Image for security',
      },
      protectionConfigTtl: 3600,
      protectionConfigTimeout: 300,
      protectionConfigWaitToSolve: 60,
      challenge: 'captcha',
      captchaDifficulty: 'easy',
    };

    // add protection
    return createProtection.addProtection(sample);
  }

  async createNode() {
    const node = await this.container.resolve('CreateNodeRepository');

    const sample = {
      ip: '192.168.0.2',
      nodeToken: 'jbnh5yzdirjinqaorq0odx1tf383nb3xr',
      tlsVersion: 'legacy',
      port: '8080',
      nodeId: 'asds.com',
    };

    // add node
    return node.addNode(
      sample.ip,
      sample.nodeToken,
      sample.tlsVersion,
      sample.port,
      sample.nodeId,
    );
  }
}

module.exports = Helper;
