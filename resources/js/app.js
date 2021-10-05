/**
 * First we will load all of this project's JavaScript dependencies which
 * includes React and other helpers. It's a great starting point while
 * building robust, powerful web applications using React + Laravel.
 */

require('./bootstrap');

/**
 * Next, we will create a fresh React component instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

require('./user/qc/participant/Dashboard');
require('./user/qc/admin/Dashboard');
require('./user/qc/admin/AddLab');
require('./user/qc/admin/EditLab');
require('./user/qc/admin/AddPersonel');
require('./user/qc/admin/EditPersonel');
require('./user/qc/admin/AddUser');
require('./user/qc/admin/EditUser');
require('./user/qc/admin/ListLab');
require('./user/qc/admin/ListPersonel');
require('./user/qc/admin/ListUser');

require('./user/pt/shipment/PtShipment');
require('./user/pt/readiness/AddReadiness');
require('./user/pt/readiness/EditReadiness');
require('./user/pt/readiness/ListReadiness');
require('./user/pt/participant/Dashboard');
require('./user/pt/participant/Demographics');

require('./user/general/Dashboard');
//Intrface code
require('./components/system/org-unit/OrgUnits');
require('./components/system/role/Roles');
require('./components/system/users/Users');
require('./components/system/users/Profile');
require('./components/system/auth/axios_login');
require('xlsx');
require("uuid/v4");
require("react-datepicker");
require("react-js-pagination");
require('bootstrap-select');
require('react-tooltip');
require('../../node_modules/@fortawesome/fontawesome-free/js/fontawesome.js');

require('../../node_modules/jquery.easing/jquery.easing.min.js');
