/* eslint-disable no-plusplus */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const nunjucks = require('nunjucks');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class VhTemplate {
  constructor({ ListVhRepository, UpstreamModel }) {
    this.listVh = ListVhRepository;
    this.UpstreamModel = UpstreamModel;

    this.nunjucks = nunjucks.configure('/app/api/src/templates', {
      trimBlocks: true,
    });
  }

  async render(vhModel, populate = false) {
    let res = vhModel;
    if (populate) {
      // eslint-disable-next-line no-underscore-dangle
      res = await this.listVh.findSingleForRender(vhModel._id);
    }

    return new Promise((resolve) => {
      nunjucks.render(
        'vh.j2',
        {
          vh: JSON.parse(JSON.stringify(res)),
        },
        (e, config) => {
          if (e) {
            // @ts-ignore
            throw new Error(e);
          }
          resolve(config);
        },
      );
    });
  }

  async renderToFile(vhModel) {
    const host = vhModel.host[0];

    const hostWithoutWildcard = host.replace(/[^a-zA-Z0-9]/g, '');

    const result = await this.render(vhModel, true);
    await writeFile(
      `/app/api/addon/sites-enabled/htm_${vhModel.id}_${vhModel.name}_${hostWithoutWildcard}.conf`,
      result,
      { encoding: 'utf8' },
    );
  }

  async renderAllVhToFile() {
    // await exec([`cd /app/api/`, `rm -rf addon`, `mkdir addon`].join(' && '));

    const filePath = '/app/api/addon/sites-enabled';
    const vh = await this.listVh.findAllVh();

    const { stdout, stderr } = await exec(`rm -rf ${filePath}/htm_*.conf`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }
    const promises = [];

    if (stdout === '' && vh.length > 0) {
      for (let index = 0; index < vh.length; index++) {
        promises.push(this.renderToFile(vh[`${index}`]));
      }
      await Promise.all(promises);
    }
  }
}

module.exports = VhTemplate;
