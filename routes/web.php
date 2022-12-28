<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AuthAccessController;
use App\Http\Controllers\CustomAuthController;
use App\Http\Controllers\LotController;
use App\Http\Controllers\PT\PTAdminController;
use App\Http\Controllers\PtPanelController;
use App\Http\Controllers\QC\QCAdminController;
use App\Http\Controllers\QC\QCParticipantController;
use App\Http\Controllers\Service\ReadinessController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('home');
// });

// Auth::routes(['register' => false]);
Auth::routes();


Route::get('/home',  [CustomAuthController::class, 'index'])->name('home');
Route::get('/',  [CustomAuthController::class, 'index'])->name('home');
Route::get('index', [CustomAuthController::class, 'index'])->name('index');
Route::get('participant-login', [CustomAuthController::class, 'getParticipantLoginPage'])->name('participant-login');

Route::get('participant-signup', [CustomAuthController::class, 'getParticipantSignupPage'])->name('participant-signup');
Route::post('participant-signup', [CustomAuthController::class, 'doSignup'])->name('participant-signup');

Route::get('login', [CustomAuthController::class, 'index'])->name('login');
Route::post('participant-login', [CustomAuthController::class, 'doLogin'])->name('participant-login');
Route::get('registration', [CustomAuthController::class, 'registration'])->name('register-user');
Route::post('custom-registration', [CustomAuthController::class, 'customRegistration'])->name('register.custom');
Route::get('logout', [CustomAuthController::class, 'signOut'])->name('logout');
Route::get('participant-pt-demographics', [QCParticipantController::class, 'participantDemographicsPage'])->name('participant-pt-demographics')->middleware('auth');
Route::get('participant-pt-reports', [QCParticipantController::class, 'participantPTReportPage'])->name('participant-pt-reports')->middleware('auth');
Route::get('laboratory-users', [QCParticipantController::class, 'labUsers'])->name('laboratory-users')->middleware('auth');

Route::get('participant-home', [QCParticipantController::class, 'participantHome'])->name('participant-home')->middleware('auth');
Route::get('participant-pt-home', [QCParticipantController::class, 'participantPTHome'])->name('participant-pt-home')->middleware('auth');;

Route::get('admin-logout', [AdminAuthController::class, 'signOut'])->name('admin-logout');
Route::post('admin-login', [AdminAuthController::class, 'doLogin'])->name('admin-login');
Route::get('admin-login', [AdminAuthController::class, 'adminLogin'])->name('admin-login');

Route::get('admin-home', 'QC\QCAdminController@adminHome')->name('admin-home');

Route::get('add-admin-user', 'QC\QCAdminController@addUser')->name('add-admin-user');
Route::get('edit-admin-user/{userId}', 'QC\QCAdminController@editUser')->name('edit-admin-user');
Route::get('list-admin-user', 'QC\QCAdminController@listUser')->name('list-admin-user');

Route::get('add-personel', 'QC\QCAdminController@addPersonel')->name('add-personel');
Route::get('list-personel', 'QC\QCAdminController@listPersonel')->name('list-personel');
Route::get('edit-personel/{personelId}', [QCAdminController::class, 'editPersonel'])->name('edit-personel');

Route::get('add-lab', 'QC\QCAdminController@addLab')->name('add-lab');
Route::get('edit-lab/{labId}', [QCAdminController::class, 'editLab'])->name('edit-lab');
Route::get('list-lab', 'QC\QCAdminController@listLab')->name('list-lab');

Route::get('pt-shipment', 'PT\PTAdminController@ptShipment')->name('pt-shipment');
Route::get('edit-shipment/{shipmentId}', [PTAdminController::class, 'editShipment'])->name('edit-shipment');


Route::get('list-readiness', [PTAdminController::class, 'listReadiness'])->name('list-readiness');
Route::get('edit-readiness/{readinessId}', [PTAdminController::class, 'editReadiness'])->name('edit-readiness');
Route::get('add-readiness', [PTAdminController::class, 'addReadiness'])->name('add-readiness');

Route::get('get-readiness-form/{readinessId}', [QCParticipantController::class, 'getReadinessForm'])->name('get-readiness-form');
Route::get('get-admin-readiness-form/{readinessId}/{labId}', [QCParticipantController::class, 'getReadinessForm'])->name('get-admin-readiness-form');
Route::get('get-readiness-response/{readinessId}', [PTAdminController::class, 'getReadinessResponse'])->name('get-readiness-response');

/////
Route::get('get-shipment-responses/{shipmentId}', [PTAdminController::class, 'getShipmentResponse'])->name('get-shipment-response');
Route::get('get-shipment-response-form/{resultSubmissionId}', [PTAdminController::class, 'getShipmentResponseForm']);

Route::get('pt-shipment-report-list', [PTAdminController::class, 'getShipmentReportList'])->name('pt-shipment-report-list');
Route::get('get-shipment-report-responses/{shipmentId}', [PTAdminController::class, 'getShipmentReportResponse'])->name('get-shipment-report-response');

Route::get('get-shipment-response-performance/{resultSubmissionId}', [PTAdminController::class, 'getShipmentResponsePerformance']);

Route::get('get-participant-shipment-response-performance/{resultSubmissionId}', [QCParticipantController::class, 'getParticipantShipmentResponsePerformance']);

//Files
Route::get('/home/resources',  [CustomAuthController::class, 'publicResources'])->name('publicResources');
Route::get('resources', function () {
    return redirect('/resources/files');
})->name('resourcesIndex');
Route::get('resources/files',['as'=>'resources.files', 'uses'=>'ResourceFilesController@index']);
//////

//RBAC
Route::prefix('access-management')->group(function () {
    Route::redirect('/', '/access-management/roles');
    Route::prefix('roles')->group(function () {
        Route::get('/', [AuthAccessController::class, 'manageRoles'])->name('manage-roles');
        Route::get('/new', [AuthAccessController::class, 'newRole'])->name('new-role');
        Route::get('/edit/{roleId}', [AuthAccessController::class, 'editRole'])->name('edit-role');
    });
    
    Route::get('permissions', [AuthAccessController::class, 'managePermissions'])->name('manage-permissions');
    
    Route::prefix('groups')->group(function () {
        Route::get('/', [AuthAccessController::class, 'manageGroups'])->name('manage-groups');
        Route::get('/new', [AuthAccessController::class, 'newGroup'])->name('new-group');
        Route::get('/edit/{groupId}', [AuthAccessController::class, 'editGroup'])->name('edit-group');
    });
});
//////

/// Lots CRUD
Route::get('lots', [LotController::class, 'index'])->name('lots');
Route::get('pt_lots', [LotController::class, 'index'])->name('lots');
Route::get('lots/new', [LotController::class, 'create'])->name('new-lot');
Route::get('pt_lots/new', [LotController::class, 'create'])->name('new-lot');
Route::get('lots/{lotId}', [LotController::class, 'show'])->name('view-lot');
Route::get('pt_lots/{lotId}', [LotController::class, 'show'])->name('view-lot');
Route::get('lots/{lotId}/participants', [LotController::class, 'show_participants'])->name('view-lot-participants');
Route::get('readiness_participants/{readinessId}', [LotController::class, 'show_readiness_participants'])->name('view-lot-participants');
Route::get('pt_lots/{lotId}/participants', [LotController::class, 'show_participants'])->name('view-lot-participants');
Route::get('lots/edit/{lotId}', [LotController::class, 'edit'])->name('edit-lot');
Route::get('pt_lots/edit/{lotId}', [LotController::class, 'edit'])->name('edit-lot');
///////

// Panels CRUD
Route::get('panels', [PtPanelController::class, 'index'])->name('panels');
Route::get('pt_panels', [PtPanelController::class, 'index'])->name('panels');
Route::get('panels/new', [PtPanelController::class, 'create'])->name('new-panel');
Route::get('pt_panels/new', [PtPanelController::class, 'create'])->name('new-panel');
Route::get('panels/{panelId}', [PtPanelController::class, 'show'])->name('view-panel');
Route::get('panels/{panelId}/participants', [PtPanelController::class, 'participants'])->name('view-panel-participants');
Route::get('pt_panels/{panelId}', [PtPanelController::class, 'show'])->name('view-panel');
Route::get('panels/edit/{panelId}', [PtPanelController::class, 'edit'])->name('edit-panel');
Route::get('pt_panels/edit/{panelId}', [PtPanelController::class, 'edit'])->name('edit-panel');
