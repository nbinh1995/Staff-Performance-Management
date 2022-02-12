<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\User\UpdateUserRequest;
use App\Http\Requests\User\UserRequest;
use App\Jobs\SendNewPasswordMail;
use App\Models\Group;
use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $queryData = $request->only(
            [
                'by',
                'order',
                'q',
            ]
        );

        $queryData['by'] = $queryData['by'] ?? 'id';
        $queryData['order'] = 'desc' === $queryData['order'] ? 'desc' : 'asc';

        $users = User::with('group', 'role')
            ->when(!empty($queryData['q']), function ($when) use ($queryData) {
                $when->orWhere('id', $queryData['q'])
                    ->orWhere('email', 'like', '%' . $queryData['q'] . '%')
                    ->orWhere('full_name', 'like', '%' . $queryData['q'] . '%')
                    ->orWhere('dob', 'like', '%' . $queryData['q'] . '%')
                    ->orWhere('phone', 'like', '%' . $queryData['q'] . '%')
                    ->orWhereHas('group', function ($whereHas) use ($queryData) {
                        $whereHas->where('groups.name', 'like', '%' . $queryData['q'] . '%');
                    })
                    ->orWhereHas('role', function ($whereHas) use ($queryData) {
                        $whereHas->where('roles.name', 'like', '%' . $queryData['q'] . '%');
                    });
            })
            ->orderBy($queryData['by'], $queryData['order'])
            ->paginate(config('master.user.list.limit'));
        return response()->json(['data' => $users, 'status' => 200]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(UserRequest $request)
    {
        $data = $request->only([
            'full_name',
            'password',
            'email',
            'dob',
            'phone',
            'salary',
            'pay_per_hour',
            'group_id',
            'role_id',
        ]);

        $data['password'] = Hash::make($data['password']);
        $data['dob'] = Carbon::parse($data['dob'])->format('Y-m-d');

        $user = User::create($data);

        if ($user) {
            if ($request->hasFile('avatar')) {
                $avatarImage = $request->file('avatar');
                $avatar = $avatarImage->storeAs('avatar', $user->id . '-' . time() . '.' . $avatarImage->getClientOriginalExtension());
                if ($avatar) {
                    $user->avatar = $avatar;
                    $user->save();
                }
            }

            return response()->json(['data' => $user, 'status' => 201]);
        }
        return response()->json(['status' => 500]);
    }

    /**
     * Display the specified resource.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $user = User::with('group', 'role')->where('id', $id)->first();
        if ($user) {
            return response()->json(['data' => $user, 'status' => 200]);
        }

        return response()->json(['status' => 404]);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateUserRequest $request, $id)
    {
        $data = $request->only([
            'full_name',
            'password',
            'email',
            'dob',
            'phone',
            'salary',
            'pay_per_hour',
            'group_id',
            'role_id',
        ]);

        if ($id === 1) {
            unset($data['group_id']);
            unset($data['role_id']);
        }

        $data['dob'] = Carbon::parse($data['dob'])->format('Y-m-d');

        $user = User::find($id);
        if ($user) {
            $updated = $user->update($data);
            if ($updated) {
                if ($request->hasFile('avatar')) {
                    $oldAvatar = $user->avatar;
                    $avatarImage = $request->file('avatar');
                    $avatar = $avatarImage->storeAs('avatar', $user->id . '-' . time() . '.' . $avatarImage->getClientOriginalExtension());
                    if ($avatar) {
                        Storage::delete($oldAvatar);
                        $user->avatar = $avatar;
                        $user->save();
                    }
                }

                return response()->json(['data' => $user, 'status' => 200]);
            }
        }

        return response()->json(['status' => 500]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        if ($id !== 1) {
            $user = User::find($id);
            if ($user) {
                $deleted = $user->delete();
                if ($deleted) {
                    return response()->json(['status' => 200]);
                }
            }
        }

        return response()->json(['status' => 500]);
    }

    public function getGroupRole()
    {
        $groups = Group::all();
        $roles = Role::all();

        return response()->json(
            [
                'data' => [
                    'groups' => $groups,
                    'roles' => $roles,
                ],
                'status' => 200,
            ]);
    }

    public function resetPassword($id)
    {
        if ($id !== 1) {
            $user = User::find($id);
            if ($user) {
                $newPass = Str::random(12);
                $user->password = Hash::make($newPass);
                if ($user->save()) {
                    $job = new SendNewPasswordMail(['email' => $user->email, 'password' => $newPass]);
                    dispatch($job);
                    return response()->json(['status' => 200]);
                }
            }
        }

        return response()->json(['status' => 500]);
    }

    public function getAll()
    {
        $groups = Group::with('users')->get();
        $data = $groups->map(function ($group) {
            return $group->id !== 1 ? [
                'label' => strtoupper($group->name),
                'options' => $group->users->map(function ($user) use ($group) {
                    return [
                        'label' => $user->full_name,
                        'value' => $user->id
                    ];
                })
            ] : [];
        });
        $data->shift();
        return response()->json(['data' => $data, 'status' => 200]);
    }

    public function getUserTasks(Request $request, $id)
    {
        $queryData = $request->only(
            [
                'by',
                'order',
                'q',
            ]
        );

        $queryData['by'] = $queryData['by'] ?? 'id';
        $queryData['order'] = 'desc' === $queryData['order'] ? 'desc' : 'asc';

        $tasks = Task::with('project')
            ->when(!empty($queryData['q']), function ($when) use ($queryData) {
                $when->orWhere('id', $queryData['q'])
                    ->orWhere('name', 'like', '%' . $queryData['q'] . '%')
                    ->orWhereHas('project', function ($whereHas) use ($queryData) {
                        $whereHas->where('projects.name', 'like', '%' . $queryData['q'] . '%');
                    });
            })
            ->where('user_id', $id)
            ->orderBy($queryData['by'], $queryData['order'])
            ->paginate(config('master.task.list.limit'));
        return response()->json(['data' => $tasks, 'status' => 200]);
    }

    public function getAuthUserTasks(Request $request)
    {
        return $this->getUserTasks($request, Auth::id());
    }

    public function getEffortData($id)
    {
        $effortData = Project::whereHas('tasks', function ($query) use ($id) {
            $query
                ->where('user_id', $id)
                ->where('status', '!=', 'cancel');
        })
            ->join('tasks', 'projects.id', '=', 'tasks.project_id')
            ->selectRaw('sum(if(tasks.user_id = ?, effort_task, 0)) as user_effort, sum(if(tasks.user_id = ?, effort_OT, 0)) as user_effort_ot, sum(tasks.effort_task) as total_effort, sum(tasks.effort_OT) as total_ot, avg(tasks.effort_task) as avg_effort, projects.estimate, projects.name', [$id, $id])
            ->groupBy('tasks.user_id', 'tasks.project_id', 'projects.estimate', 'projects.name')
            ->where('projects.status', '!=', 'cancel')
            ->orderBy('projects.name')
            ->get();

        return response()->json(['data' => $effortData, 'status' => 200]);
    }

    public function getAuthUserEffortData()
    {
        return $this->getEffortData(Auth::id());
    }
}
