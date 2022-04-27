const { ErrorWithProps } = require('mercurius').default;
const { constantsMerge: errorConstMerge } = require('../Schema/ErrorMessage');

module.exports = (e) => {
  // Duplicate key error
  if (e.name === 'MongoServerError' && e.code === 11000) {
    const errorBag = [];
    const error = e.errmsg;
    const index = error.indexOf('index:');
    const field = error.substring(
      error.indexOf('_', index) + 1,
      error.indexOf(' ', index),
    );

    const message = error.substring(
      error.indexOf(' ', index) + 1,
      error.indexOf(' ', error.indexOf(' ', index) + 1),
    );

    errorBag.push({
      message,
      field,
    });

    throw new ErrorWithProps(errorConstMerge.DUPLICATE_ENTRY, {
      validation: errorBag,
      statusCode: 422,
    });
  } else {
    throw new ErrorWithProps(errorConstMerge.OTHER_ERROR, {
      validation: [{ message: e.message }],
      statusCode: 500,
    });
  }
};
