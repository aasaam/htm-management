const mongoose = require('mongoose');
const validator = require('validator').default;

const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;
const LoadBalanceList = require('../Schema/LoadBMethod');

const upstreamSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      validate: /^[a-zA-Z][a-zA-Z0-9]{3,31}$/,
    },

    serverList: [
      {
        server: {
          type: Schema.Types.String,
          require: true,
          validator(c) {
            return (
              // domain or ip
              validator.isIP(c, 4) || validator.isFQDN(c)
            );
          },
        },

        port: {
          type: Schema.Types.String,
          require: false,
          nullable: true,
          validate: {
            validator(c) {
              return validator.isPort(c);
            },
          },
        },

        weight: {
          type: Schema.Types.Number,
          validator(c) {
            return c >= 1;
          },
          min: 1,
          require: false,
        },

        // limits the maximum number of simultaneous active connections to the proxied server
        // Default value is zero, meaning there is no limit.
        maxConnection: {
          type: Schema.Types.Number,
          validator(c) {
            return c >= 0;
          },
          min: 0,
          require: false,
        },

        maxFails: {
          type: Schema.Types.Number,
          validator(c) {
            return c >= 1;
          },
          min: 1,
        },

        failTimeout: {
          type: Schema.Types.Number,
          validator(c) {
            return c >= 10;
          },
          min: 10,
        },

        backup: {
          type: Boolean,
          default: false,
          require: false,
        },

        down: {
          type: Boolean,
          require: false,
          default: false,
        },
      },
    ],

    loadBalanceMethod: {
      type: Schema.Types.String,
      enum: LoadBalanceList.list,
    },

    keepalive: {
      require: false,
      type: Schema.Types.Number,
      min: 8,
    },

    keepAliveRq: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
    },

    keepaliveTime: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
    },

    keepAliveTimeout: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
    },

    // 0 means false, 1 true
    advance: {
      type: Schema.Types.Number,
      required: true,
      default: 0,
      min: 0,
      max: 1,
    },

    advancedBody: {
      required: false,
      type: Schema.Types.String,
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

upstreamSchema.plugin(mongoosePaginate);

const UpstreamModel = mongoose.model('Upstream', upstreamSchema);

module.exports = () => UpstreamModel;
