const mongoose = require('mongoose');
const validator = require('validator').default;

const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const TlsVersionList = require('../Schema/TlsVersion');

const nodeSchema = new Schema(
  {
    ip: {
      type: Schema.Types.String,
      require: true,
      validate: {
        validator(c) {
          return validator.isIP(c, 4);
        },
      },
    },

    nodeId: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      // validate: {
      //   // hostname
      //   validator(c) {},
      // },
    },

    nodeToken: {
      type: Schema.Types.String,
      require: true,
    },

    port: {
      type: Schema.Types.String,
      default: '9199',
    },
    tlsVersion: {
      type: Schema.Types.String,
      default: TlsVersionList.constants.Intermediate,
      enum: TlsVersionList.list,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

nodeSchema.plugin(mongoosePaginate);

const NodeModel = mongoose.model('Node', nodeSchema);

module.exports = () => NodeModel;
