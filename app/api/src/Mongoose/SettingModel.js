const mongoose = require('mongoose');

const { Schema } = mongoose;

const settingSchema = new Schema(
  {
    nginxconf: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      default: '',
    },

    changeTime: {
      type: Schema.Types.Date,
      default: Date.UTC(1, 1, 1, 1, 1, 1),
    },

    lastApplyTime: {
      type: Schema.Types.Date,
      default: Date.UTC(0, 0, 0, 0, 0, 0),
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

const SettingModel = mongoose.model('Setting', settingSchema);

module.exports = () => SettingModel;
