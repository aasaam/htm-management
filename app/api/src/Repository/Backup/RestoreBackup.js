/* eslint-disable security/detect-object-injection */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable security/detect-child-process */
const { writeFile, readFile } = require('fs').promises;
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const { ErrorWithProps } = require('mercurius').default;
const fs = require('fs');

class RestoreBackup {
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
    this.virtualhost = ListVhRepository;
    this.waf = ListWafRepository;
    this.Config = Config;
  }

  async uploadBackup(zipFile) {
    await exec(`cd /tmp/ && rm -rf restore && mkdir restore`);
    const decodeZip = Buffer.from(zipFile, 'base64');
    const filepath = '/tmp/restore/restore_backup.7z';
    await writeFile(filepath, decodeZip);

    let exist;
    try {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      exist = await fs.promises.stat(filepath);
    } catch (error) {
      throw new ErrorWithProps(`${error}`, {
        statusCode: 500,
      });
    }

    if (!exist) {
      throw new ErrorWithProps(`No such file found.`, {
        statusCode: 500,
      });
    }

    const { stderr } = await exec(
      `cd /tmp/restore/ && 7z x restore_backup.7z -p'${this.Config.ASM_ZIP_PASSWORD}'`,
    );
    if (stderr) {
      throw new Error(`${stderr}`);
    }

    const fileList = [
      'acl',
      'node',
      'certificate',
      'protection',
      'upstream',
      'waf',
      'virtualhost',
      'setting',
    ];

    // 1. Get All files Data
    const promises = [];
    const filesData = {};

    fileList.forEach((element) => {
      promises.push(
        new Promise((resolve) => {
          readFile(`/tmp/restore/backup/${element}.json`, {
            encoding: 'utf8',
          })
            .then((data) => {
              const parsedData = JSON.parse(data);
              filesData[element] = parsedData;
              resolve(true);
            })
            .catch();
        }),
      );
    });

    await Promise.all(promises);

    // 2. Remove All collections
    await this.acl.rmAclCollection();
    await this.certificate.rmCertCollection();
    await this.node.rmNodeCollection();
    await this.waf.rmWafCollection();
    await this.protection.rmProCollection();
    await this.upstream.rmUpstrCollection();
    await this.virtualhost.rmVhCollection();
    await this.setting.rmSettingCollection();

    // 3. Insert Backup collections
    if (filesData) {
      await this.acl.insertAclCollection(filesData.acl);
      await this.certificate.insertCertCollection(filesData.certificate);
      await this.node.insertNodeCollection(filesData.node);
      await this.waf.insertWafCollection(filesData.waf);
      await this.protection.insertProCollection(filesData.protection);
      await this.upstream.insertUpstrCollection(filesData.upstream);
      await this.virtualhost.insertVhCollection(filesData.virtualhost);
      await this.setting.insertSettingCollection(filesData.setting);
    }

    return true;
  }
}

module.exports = RestoreBackup;
