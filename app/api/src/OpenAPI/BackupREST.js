/* eslint-disable security/detect-non-literal-fs-filename */
const fs = require('fs');

class BackupREST {
  constructor({ Fastify }) {
    /** @type {import('fastify').FastifyInstance} */
    this.fastify = Fastify.getFastify();
    const e404 = Fastify.getGenericError(404);
    const e403 = Fastify.getGenericError(403);

    const backupUrl = this.fastify.openAPIBaseURL('/backup-download/:filename');

    this.fastify.route({
      url: backupUrl,
      method: 'GET',
      schema: {
        description: 'Send collection backup',
        // @ts-ignore
        operationId: 'backup',
        tags: ['Backup'],
        params: {
          filename: {
            type: 'string',
          },
        },
        response: {
          404: e404.getSchema(),
          403: e403.getSchema(),
        },
      },
      handler: async (req, reply) => {
        const { token } = req.raw;
        if (!token) {
          return e403.reply(reply);
        }

        // @ts-ignore
        const cleanFileName = req.params.filename.replace(/[^0-9a-z_]/g, '');

        const filepath = `/tmp/${cleanFileName}.7z`;

        try {
          await fs.promises.stat(filepath);
        } catch (error) {
          return e404.reply(reply);
        }

        const stream = fs.createReadStream(filepath);

        reply.header(
          'Content-disposition',
          `attachment; filename="${cleanFileName}.7z"`,
        );
        return reply.type('application/x-7z-compressed').send(stream);
      },
    });
  }
}

module.exports = BackupREST;
