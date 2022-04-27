const mongoose = require('mongoose');

const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const wafSchema = new Schema(
  {
    profileName: {
      type: Schema.Types.String,
      require: true,
      unique: true,
    },

    list: [
      {
        type: Schema.Types.Mixed,
        require: true,
        name: {
          type: Schema.Types.String,
          require: true,
        },
        rule: {
          type: Schema.Types.String,
          require: true,
          validator(c) {
            return /^BasicRule/.test(c);
          },
        },
        description: {
          type: Schema.Types.String,
          require: false,
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

wafSchema.methods = {};

wafSchema.plugin(mongoosePaginate);

const WafModel = mongoose.model('Waf', wafSchema);

module.exports = () => WafModel;
