const mongoose = require('mongoose');
const validator = require('validator').default;
const mongoosePaginate = require('mongoose-paginate-v2');
const WafMode = require('../Schema/WafMode');

const { Schema } = mongoose;

const serverSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      validate: /^[a-zA-Z][a-zA-Z0-9]{3,31}$/,
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

    host: {
      type: [Schema.Types.String],
      require: false,
      default: [''],
    },

    certificate: {
      type: Schema.Types.ObjectId,
      ref: 'Certificate',
      require: false,
    },

    alwaysServeHttp: {
      require: false,
      type: Boolean,
      nullable: true,
    },

    orgTitle: {
      require: false,
      default: 'aasaam',
      type: Schema.Types.String,
    },

    orgIcon: {
      require: false,
      default: 'si_linux',
      type: Schema.Types.String,
    },

    agentCheck: {
      type: Schema.Types.String,
      require: false,
      default: 'none',
    },

    keepAliveRq: {
      require: false,
      type: Schema.Types.Number,
      min: 0,
      nullable: true,
    },

    keepAliveTimeout: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    requestPoolSize: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    clientHeaderTimeout: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    clientHeaderBufferSize: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    largeClientHeaderBufferSize: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    largeClientHeaderBufferNumber: {
      require: false,
      type: Schema.Types.Number,
      min: 1,
      nullable: true,
    },

    wafMode: {
      require: true,
      type: Schema.Types.String,
      enum: WafMode.list,
    },

    pageSpeed: {
      type: Schema.Types.String,
      require: true,
    },

    protection: {
      require: false,
      type: Schema.Types.ObjectId,
      ref: 'Protection',
      nullable: true,
    },

    location: {
      type: Schema.Types.Array,
      default: [{}],
      require: false,
      path: {
        type: Schema.Types.String,
        require: true,
      },

      // redirect | proxy
      locationType: {
        type: Schema.Types.String,
        require: true,
      },

      // redirect options:
      redirectStatus: {
        type: Schema.Types.String,
        require: true,
      },

      redirectToUrl: {
        type: Schema.Types.String,
        require: false,
        validator(c) {
          return validator.isURL(c);
        },
      },

      // proxy options:
      upstreamProfile: {
        require: true,
        type: Schema.Types.ObjectId,
        ref: 'Upstream',
      },

      activeProtection: {
        type: Boolean,
        require: false,
        default: false,
      },

      waf: {
        type: Schema.Types.ObjectId,
        ref: 'Waf',
        require: false,
      },

      aclProfile: {
        type: Schema.Types.ObjectId,
        ref: 'Acl',
        require: false,
        nullable: true,
      },

      // http | https
      proxySchema: {
        type: Schema.Types.String,
        require: true,
      },

      clientMaxBodySize: {
        require: false,
        type: Schema.Types.Number,
        min: [1, 'Minimum is 1Megabyte'],
      },

      clientBodyBufferSize: {
        require: false,
        type: Schema.Types.Number,
        min: 1,
      },

      // proxy
      standardCache: {
        type: Boolean,
        require: false,
        default: null,
        nullable: true,
      },

      headers: {
        type: Array,
      },

      proxyHeaders: {
        type: Array,
      },
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

serverSchema.plugin(mongoosePaginate);

const ServerModel = mongoose.model('Server', serverSchema);

module.exports = () => ServerModel;
