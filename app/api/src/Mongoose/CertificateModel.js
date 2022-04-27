const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const certificateSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      require: true,
      unique: true,
      validate: /^[a-zA-Z][a-zA-Z0-9]{3,31}$/,
    },

    fullChain: {
      type: Schema.Types.String,
      require: true,
    },
    privateKey: {
      type: Schema.Types.String,
      require: true,
    },
    chain: {
      type: Schema.Types.String,
      require: true,
    },
    issuer: {
      type: Schema.Types.String,
    },
    sigalg: {
      type: Schema.Types.String,
    },
    sans: {
      type: Schema.Types.Array,
    },
    not_before: {
      type: Schema.Types.Date,
    },
    notAfter: {
      type: Schema.Types.Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    //   index: true,
    // },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// certificateSchema.methods = {};

certificateSchema.plugin(mongoosePaginate);

const CertificateModel = mongoose.model('Certificate', certificateSchema);

module.exports = () => CertificateModel;
