const mongoose = require('mongoose');

const { Schema } = mongoose;

const { list: Modules } = require('../Schema/Modules');
const { list: LogLevels } = require('../Schema/LogLevels');
const { list: UserActions } = require('../Schema/UserActions');

const logSchema = new mongoose.Schema(
  {
    m: {
      alias: 'module',
      type: Schema.Types.Number,
      required: true,
      enum: Modules,
    },

    a: {
      alias: 'action',
      type: Schema.Types.Number,
      required: true,
      enum: UserActions,
    },

    l: {
      alias: 'level',
      type: Schema.Types.Number,
      required: true,
      enum: LogLevels,
    },

    d: {
      alias: 'data',
      type: Schema.Types.Mixed,
    },

    oi: {
      alias: 'objectId',
      type: Schema.Types.String,
    },

    u: {
      alias: 'user',
      type: Schema.Types.String,
    },

    ip: {
      type: String,
    },

    ua: {
      alias: 'userAgent',
      type: Schema.Types.String,
    },

    c: {
      alias: 'createdAt',
      type: Schema.Types.Date,
      default() {
        return new Date();
      },
    },
  },
  {
    timestamps: false,
    versionKey: false,
  },
);

logSchema.index({ u: 1 }, { background: true });
logSchema.index({ m: 1 }, { background: true });
logSchema.index({ c: -1 }, { background: true, expires: '180d' });

const LogModel = mongoose.model('Log', logSchema);

module.exports = () => LogModel;
