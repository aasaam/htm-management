/* eslint-disable no-plusplus */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const nunjucks = require('nunjucks');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

class UpstreamTemplate {
  constructor({ ListUpstreamRepository }) {
    this.upstrList = ListUpstreamRepository;

    this.nunjucks = nunjucks.configure('/app/api/src/templates', {
      trimBlocks: true,
    });
  }

  async render(upstreamModel) {
    return new Promise((resolve) => {
      nunjucks.render(
        'upstream.j2',
        {
          upstream: JSON.parse(JSON.stringify(upstreamModel)),
        },
        (e, config) => {
          resolve(config);
        },
      );
    });
  }

  async renderToFile(upstreamModel) {
    const result = await this.render(upstreamModel);
    await writeFile(
      `/app/api/addon/upstream/upstream_${upstreamModel.id}.conf`,
      result,
      { encoding: 'utf8' },
    );
  }

  async getUpstreamList() {
    const list = await this.upstrList.findAllUpstreamById();

    return new Promise((resolve) => {
      nunjucks.render(
        '/app/api/src/templates/allUpstream.j2',
        {
          upstream: list,
        },
        (e, config) => {
          resolve(config);
        },
      );
    });
  }

  async renderAllUpstream() {
    const result = await this.getUpstreamList();
    await writeFile(`/app/api/addon/includes/0_htm_upstream.conf`, result, {
      encoding: 'utf8',
      mode: 0o644,
    });
  }

  async renderAllUpstreamToFile() {
    // for including
    await this.renderAllUpstream();

    const filePath = '/app/api/addon/upstream';
    const upstream = await this.upstrList.findAllUpstream();

    const { stdout, stderr } = await exec(`rm -rf ${filePath}/*.conf`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }
    const promises = [];

    if (stdout === '' && upstream.length > 0) {
      for (let index = 0; index < upstream.length; index++) {
        promises.push(this.renderToFile(upstream[`${index}`]));
      }
      await Promise.all(promises);
    }
  }
}

module.exports = UpstreamTemplate;
