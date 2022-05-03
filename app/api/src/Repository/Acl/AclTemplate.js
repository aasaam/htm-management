/* eslint-disable no-plusplus */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const nunjucks = require('nunjucks');
const util = require('util');

const exec = util.promisify(require('child_process').exec);

class AclTemplate {
  constructor({ ListAclRepository }) {
    this.aclList = ListAclRepository;

    this.nunjucks = nunjucks.configure('/app/api/src/templates', {
      trimBlocks: true,
    });
  }

  async render(aclModel) {
    return new Promise((resolve) => {
      this.nunjucks.render(
        'acl.j2',
        {
          acl: JSON.parse(JSON.stringify(aclModel)),
        },
        (e, config) => {
          resolve(config);
        },
      );
    });
  }

  async renderToFile(aclModel) {
    const result = await this.render(aclModel);

    await writeFile(
      `/app/api/addon/acl/acl_${aclModel.name}_${aclModel.id}.conf`,
      result,
      {
        encoding: 'utf8',
      },
    );
  }

  async renderAllAclToFile() {
    // for including
    await this.renderAllAclInclude();

    const filePath = '/app/api/addon/acl';
    const acls = await this.aclList.findAllAcl();
    const { stdout, stderr } = await exec(`rm -rf ${filePath}/*.conf`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }
    const promises = [];

    if (stdout === '' && acls.length > 0) {
      for (let index = 0; index < acls.length; index++) {
        promises.push(this.renderToFile(acls[`${index}`]));
      }
      await Promise.all(promises);
    }
  }

  async getAclListId() {
    const list = await this.aclList.findAllAcl();

    return new Promise((resolve) => {
      nunjucks.render(
        '/app/api/src/templates/allAcl.j2',
        {
          acl: list,
        },
        (e, config) => {
          resolve(config);
        },
      );
    });
  }

  async renderAllAclInclude() {
    const result = await this.getAclListId();
    await writeFile(`/app/api/addon/includes/0_htm_acl.conf`, result, {
      encoding: 'utf8',
      mode: 0o644,
    });
  }
}

module.exports = AclTemplate;
