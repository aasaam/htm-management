/* eslint-disable security/detect-object-injection */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable security/detect-child-process */
const { writeFile } = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { ErrorWithProps } = require('mercurius').default;
const {
  constantsMerge: errorConstMerge,
} = require('../../Schema/ErrorMessage');

class CreateBackup {
  constructor({
    ListAclRepository,
    ListCertificateRepository,
    ListNodeRepository,
    ListProtectionRepository,
    ActionSettingRepository,
    ListUpstreamRepository,
    ListVhRepository,
    ListWafRepository,
    Config,
  }) {
    this.acl = ListAclRepository;
    this.certificate = ListCertificateRepository;
    this.node = ListNodeRepository;
    this.protection = ListProtectionRepository;
    this.setting = ActionSettingRepository;
    this.upstream = ListUpstreamRepository;
    this.vh = ListVhRepository;
    this.waf = ListWafRepository;
    this.Config = Config;
  }

  async getCollocationToFile() {
    const { stderr } = await exec(`cd /tmp/ && rm -rf backup && mkdir backup`);
    if (stderr) {
      throw new Error(`${stderr}`);
    }

    // @ts-ignore
    const aclResult = await this.acl.findAllAclBackup();
    const nodeResult = await this.node.findAllNodeBackup();
    const certificateResult = await this.certificate.findAllCertBackup();
    const protectionResult = await this.protection.findAllProtectionBackup();
    const settingResult = await this.setting.findAllSettingBackup();
    const upstreamResult = await this.upstream.findAllUpstreamBackup();
    const vhResult = await this.vh.findAllVhBackup();
    const wafResult = await this.waf.findAllWafBackup();
    let readyToZip = false;

    const info = [
      {
        data: aclResult,
        title: 'acl',
      },
      {
        data: nodeResult,
        title: 'node',
      },
      {
        data: certificateResult,
        title: 'certificate',
      },
      {
        data: protectionResult,
        title: 'protection',
      },
      {
        data: upstreamResult,
        title: 'upstream',
      },
      {
        data: wafResult,
        title: 'waf',
      },
      {
        data: vhResult,
        title: 'virtualhost',
      },
      {
        data: settingResult,
        title: 'setting',
      },
    ];

    const promises = [];

    for (let index = 0; index < info.length; index++) {
      const element = info[index];
      promises.push(this.writeCollectionToFile(element.data, element.title));
    }

    const b = await Promise.allSettled(promises);

    for (let index = 0; index < b.length; index++) {
      const element = b[index];

      if (element.status === 'fulfilled') {
        readyToZip = true;
      } else if (element.status === 'rejected') {
        readyToZip = false;
        throw new ErrorWithProps(errorConstMerge.BACKUP_ERROR, {
          statusCode: 500,
        });
      }
    }

    return readyToZip;
  }

  async writeCollectionToFile(result, name) {
    const data = JSON.stringify(result);
    await writeFile(`/tmp/backup/${name}.json`, data);
  }

  async makeZip() {
    const res = await this.getCollocationToFile();

    const date = new Date().toISOString();
    const time = date.replace(/[^0-9]+/g, '_');
    const fileName = `backup${time}`;
    const zipPassword = this.Config.ASM_ZIP_PASSWORD;

    if (res) {
      const { stderr } = await exec(
        `cd /tmp/ && 7z a  -t7z -m0=lzma2 -mx=9 -mfb=64   -md=32m -ms=on -mhe=on -p'${zipPassword}' ${fileName}.7z backup`,
      );

      if (stderr) {
        throw new Error(`${stderr}`);
      }
      return fileName;
    }

    throw new ErrorWithProps(errorConstMerge.ZIP_ERROR, {
      statusCode: 500,
    });
  }
}

module.exports = CreateBackup;
