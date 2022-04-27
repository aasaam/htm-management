const mongoose = require('mongoose');
const validator = require('validator').default;

const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const aclSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      validate: /^[a-zA-Z][a-zA-Z0-9]{3,31}$/,
    },

    safeName: {
      type: Schema.Types.String,
    },

    // 0 means blacklist, 1 means whitelist
    mood: {
      type: Schema.Types.Number,
      required: true,
      min: 0,
      max: 1,
    },

    list: [
      {
        require: true,
        type: Schema.Types.String,
        validate: {
          validator(c) {
            return validator.isIPRange(c, 4) || validator.isIP(c, 4);
          },
        },
      },
    ],

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

aclSchema.methods = {};

aclSchema.plugin(mongoosePaginate);

const AclModel = mongoose.model('Acl', aclSchema);

module.exports = () => AclModel;
