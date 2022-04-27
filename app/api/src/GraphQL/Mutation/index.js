const AddUser = require('./User/AddUser');
const EditUser = require('./User/EditUser');
const OtpGenerate = require('./User/OtpGenerate');
const DeleteUser = require('./User/DeleteUser');
const UpdateUserPassword = require('./User/UpdateUserPassword');
const AddNode = require('./Node/AddNode');
const EditNode = require('./Node/EditNode');
const DeleteNode = require('./Node/DeleteNode');
const AddCertificate = require('./Certificate/AddCertificate');
const DeleteCertificate = require('./Certificate/DeleteCertificate');
const EditCertificate = require('./Certificate/EditCertificate');
const AddUpstream = require('./Upstream/AddUpstream');
const DeleteUpstream = require('./Upstream/DeleteUpstream');
const EditUpstream = require('./Upstream/EditUpstream');
const AddProtection = require('./Protection/AddProtection');
const EditProtection = require('./Protection/EditProtection');
const DeleteProtection = require('./Protection/DeleteProtection');
const AddAcl = require('./Acl/AddAcl');
const DeleteAcl = require('./Acl/DeleteAcl');
const EditAcl = require('./Acl/EditAcl');
const AddWaf = require('./Waf/AddWaf');
const DeleteWaf = require('./Waf/DeleteWaf');
const EditWaf = require('./Waf/EditWaf');
const AddVh = require('./Vh/AddVh');
const DeleteVh = require('./Vh/DeleteVh');
const EditVh = require('./Vh/EditVh');
const UpdateSetting = require('./Setting/UpdateSetting');

module.exports = {
  AddUser,
  EditUser,
  OtpGenerate,
  DeleteUser,
  UpdateUserPassword,
  AddNode,
  EditNode,
  DeleteNode,
  AddCertificate,
  DeleteCertificate,
  EditCertificate,
  AddUpstream,
  DeleteUpstream,
  EditUpstream,
  AddProtection,
  EditProtection,
  DeleteProtection,
  AddAcl,
  DeleteAcl,
  EditAcl,
  AddWaf,
  DeleteWaf,
  EditWaf,
  AddVh,
  DeleteVh,
  EditVh,
  UpdateSetting,
};
