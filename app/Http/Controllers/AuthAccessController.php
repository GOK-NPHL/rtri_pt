<?php

namespace App\Http\Controllers;

use App\Admin;
use Illuminate\Http\Request;
use Auth;
use Exception;
use App\Permission;
use App\User;
use App\UserGroup;
use App\UserRole;
use Illuminate\Support\Facades\Auth as FacadesAuth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class AuthAccessController extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin', 'getCurrentUserParams']]);
    }

    public function manageRoles()
    {
        return view('user.qc.admin.manage_roles');
    }
    public function newRole()
    {
        return view('user.qc.admin.roles_form');
    }
    public function editRole()
    {
        return view('user.qc.admin.roles_form');
    }
    public function managePermissions()
    {
        return view('user.qc.admin.manage_permissions');
    }
    public function manageGroups()
    {
        return view('user.qc.admin.manage_groups');
    }
    public function newGroup()
    {
        return view('user.qc.admin.groups_form');
    }
    public function editGroup()
    {
        return view('user.qc.admin.groups_form');
    }

    // permissions
    public function getCurrentUserParams(Request $request)
    {
        try {
            $user = request()->user();
            $user = User::find($user->id);
            $user_id = $user->id;
            $user_name = $user->name;
            $user_email = $user->email;
            $user_role_ids = json_decode($user->roles);
            $user_roles = [];
            $user_permissions = [];
            if($user_role_ids != null && count($user_role_ids) > 0) {
                foreach($user_role_ids as $role_id) {
                    $role = UserRole::find($role_id) ?? null;
                    $role_permissions = json_decode($role->permissions);
                    $user_roles[] = [
                        'id' => $role->id,
                        'name' => $role->name,
                        // 'permissions' => $role_permissions,
                    ];
                    if($role_permissions != null && count($role_permissions) > 0) {
                        foreach($role_permissions as $permission) {
                            $user_permissions[] = $permission;
                        }
                    }
                }
            }
            $user_group_ids = json_decode($user->groups);
            $user_groups = [];
            if($user_group_ids != null && count($user_group_ids) > 0) {
                foreach($user_group_ids as $group_id) {
                    $user_groups[] = UserGroup::find($group_id) ? UserGroup::find($group_id)->get('id','name') : null;
                }
            }
            $response = [
                'id' => $user_id,
                'name' => $user_name,
                'email' => $user_email,
                'roles' => $user_roles,
                'permissions' => $user_permissions,
                // 'groups' => $user_groups,
            ];

            // $response = $user;
            return response()->json($response);

            // return response()->json(['success' => true, 'user' => $user]);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch user params: ' . $ex->getMessage()], 500);
        }
    }

    // permissions
    public function getPermissions(Request $request)
    {
        try {
            $permissions = Permission::all();
            return response()->json($permissions);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all permission: ' . $ex->getMessage()], 500);
        }
    }

    public function getUserPermissions(Request $request)
    {
        try {
            $user = request()->user();
            $user = User::find($user->id);
            $user_groups = json_decode($user->groups);
            $group_permissions = [];
            foreach ($user_groups as $group) {
                $group_permissions[] = $group->permissions;
            }
            $permissions = array_unique(array_merge(...$group_permissions));
            return response()->json($permissions);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch user permission: ' . $ex->getMessage()], 500);
        }
    }

    public function getPermission(Request $request)
    {
        try {
            if ($request->has('slug')) {
                $permission = Permission::where('slug', $request->slug)->first();
            } else if ($request->has('name')) {
                $permission = Permission::where('name', $request->name)->first();
            }else {
                $permission = Permission::find($request->id);
            }
            return response()->json($permission);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch permission: ' . $ex->getMessage()], 500);
        }
    }

    public function createPermission(Request $request)
    {
        try {
            $permission = new Permission();
            $permission->name = $request->name;
            $permission->slug = $request->slug;
            $permission->is_active = $request->is_active;
            $permission->save();
            return response()->json($permission);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not create permission: ' . $ex->getMessage()], 500);
        }
    }

    public function updatePermission(Request $request)
    {
        try {
            $permission = Permission::find($request->id);
            $permission->name = $request->name;
            $permission->slug = $request->slug;
            $permission->is_active = $request->is_active;
            $permission->save();
            return response()->json($permission);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update permission: ' . $ex->getMessage()], 500);
        }
    }

    public function deletePermission(Request $request)
    {
        try {
            $permission = Permission::find($request->id);
            $slug = $permission->slug;
            $permission->is_active = 0;
            $permission->save();
            $permission->delete();
            $roles = UserRole::where('permissions', 'like', '%' . $slug . '%')->get();
            foreach ($roles as $role) {
                $role_permissions = json_decode($role->permissions);
                $key = array_search($slug, $role_permissions);
                if ($key !== false) {
                    unset($role_permissions[$key]);
                    $role->permissions = json_encode($role_permissions);
                    $role->save();
                }
            }

            return response()->json(['Message' => 'Permission deleted successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete permission: ' . $ex->getMessage()], 500);
        }
    }


    // roles
    public function getRoles(Request $request)
    {
        try {
            $roles = UserRole::all();
            return response()->json($roles);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all roles: ' . $ex->getMessage()], 500);
        }
    }

    public function getUserRoles(Request $request)
    {
        try {
            $user = request()->user();
            $user = User::find($user->id);
            $user_roles = json_decode($user->roles);
            $roles = UserRole::whereIn('id', $user_roles)->get();
            return response()->json($roles);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch user roles: ' . $ex->getMessage()], 500);
        }
    }

    public function getAllUsersWithRole(Request $request)
    {
        try {
            $role = UserRole::find($request->id);
            $users = User::where('roles', 'like', '%' . $role->id . '%')->get();
            return response()->json($users);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all users with role: ' . $ex->getMessage()], 500);
        }
    }

    public function getRole(Request $request)
    {
        try {
            if ($request->has('name')) {
                $role = UserRole::where('name', $request->name)->first();
            } else {
                $role = UserRole::find($request->id);
            }
            return response()->json($role);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch role: ' . $ex->getMessage()], 500);
        }
    }

    public function createRole(Request $request)
    {
        try {
            $role = new UserRole();
            $role->name = $request->name;
            $role->is_active = $request->is_active;
            $role->permissions = json_encode($request->permissions); //$request->permissions;
            $role->save();
            return response()->json($role);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not create role: ' . $ex->getMessage()], 500);
        }
    }

    public function updateRole(Request $request)
    {
        try {
            $role = UserRole::find($request->id);
            $role->name = $request->name;
            $role->is_active = $request->is_active;
            $role->permissions = $request->permissions;
            $role->save();
            return response()->json($role);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update role: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteRole(Request $request)
    {
        try {
            $role = UserRole::find($request->id);
            $role->delete();
            $users = User::where('roles', 'like', '%' . $request->id . '%')->get();
            foreach ($users as $usr) {
                $user_roles = json_decode($usr->roles);
                $key = array_search($request->id, $user_roles);
                if ($key !== false) {
                    unset($user_roles[$key]);
                    $usr->permissions = json_encode($user_roles);
                    $usr->save();
                }
            }
            // $role->is_active = 0;
            // $role->save();
            // return response()->json($role);
            return response()->json(['Message' => 'Role deleted successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete role: ' . $ex->getMessage()], 500);
        }
    }


    // user groups
    public function getGroups(Request $request){
        try {
            $groups = UserGroup::all();
            return response()->json($groups);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all groups: ' . $ex->getMessage()], 500);
        }
    }

    public function getUserGroups(Request $request)
    {
        try {
            $user = request()->user();
            $user = User::find($user->id);
            $user_groups = json_decode($user->groups);
            $groups = UserGroup::whereIn('id', $user_groups)->get();
            return response()->json($groups);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch user groups: ' . $ex->getMessage()], 500);
        }
    }

    public function getAllUsersInGroup(Request $request)
    {
        try {
            $group = UserGroup::find($request->id);
            $users = User::where('groups', 'like', '%' . $group->id . '%')->get();
            return response()->json($users);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all users with group: ' . $ex->getMessage()], 500);
        }
    }

    public function getGroup(Request $request)
    {
        try {
            if ($request->has('name')) {
                $group = UserGroup::where('name', $request->name)->first();
            } else {
                $group = UserGroup::find($request->id);
            }
            return response()->json($group);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch group: ' . $ex->getMessage()], 500);
        }
    }

    public function createGroup(Request $request)
    {
        try {
            $group = new UserGroup();
            $group->name = $request->name;
            $group->is_active = $request->is_active;
            $group->roles = $request->roles;
            $group->save();
            return response()->json($group);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not create group: ' . $ex->getMessage()], 500);
        }
    }

    public function updateGroup(Request $request)
    {
        try {
            $group = UserGroup::find($request->id);
            $group->name = $request->name;
            $group->is_active = $request->is_active;
            $group->roles = $request->roles;
            $group->save();
            return response()->json($group);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not update group: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteGroup(Request $request)
    {
        try {
            $group = UserGroup::find($request->id);
            $group->delete();
            $users = User::where('groups', 'like', '%' . $request->id . '%')->get();
            foreach ($users as $usr) {
                $user_groups = json_decode($usr->groups);
                $key = array_search($request->id, $user_groups);
                if ($key !== false) {
                    unset($user_groups[$key]);
                    $usr->permissions = json_encode($user_groups);
                    $usr->save();
                }
            }
            // $group->is_active = 0;
            // $group->save();
            // return response()->json($group);
            return response()->json(['Message' => 'Group deleted successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not delete group: ' . $ex->getMessage()], 500);
        }
    }


    //users
    public function getUsers(Request $request)
    {
        try {
            $users = User::all();
            return response()->json($users);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch all users: ' . $ex->getMessage()], 500);
        }
    }
}
