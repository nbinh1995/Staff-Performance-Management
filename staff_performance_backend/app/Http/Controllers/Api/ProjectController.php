<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;

use function PHPSTORM_META\map;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {

        $col = $request->by ?? 'id';
        $order = $request->order ?? 'desc';

        $projectsList = Project::orderBy($col, $order)
            ->when(auth('api')->user(), function ($query) {
                $user = auth('api')->user()->load('role');
                if ($user->role->slug !== config('master.role.admin')) {
                    $query->where('leader_id', $user->id);
                }
            })
            ->when($request->q, function ($query) use ($request) {
                $query->orWhere('name', 'LIKE', "%{$request->q}%")
                    ->orWhere('estimate', 'LIKE', "%{$request->q}%")
                    ->orWhere('start_date', 'LIKE', "%{$request->q}%")
                    ->orWhere('end_date', 'LIKE', "%{$request->q}%")
                    ->orWhere('status', 'LIKE', "%{$request->q}%");
            })
            ->paginate(config('master.paginate.project'));
        return response()->json(compact('projectsList'), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->only([
            'name',
            'leader_id',
            'estimate',
            'start_date',
            'end_date'
        ]);

        $project = Project::create($data);

        if ($project) {
            if ($request->has('users_id')) {
                $users = array_merge([$request->leader_id], $request->users_id);
                $project->users()->sync($users);
            }
            return response()->json(['data' => $project, 'status' => 201], 201);
        }
        return response()->json(['status' => 500], 500);

    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $project = Project::with(['leader', 'users'])->find($id);
        if ($project) {
            $data = [
                'name' => $project->name,
                'leader' => $project->leader->full_name,
                'estimate' => $project->estimate,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status
            ];

            return response()->json(['data' => $data, 'status' => 200], 200);
        }

        return response()->json(['status' => 404], 404);
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param \App\Models\Project $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $project = Project::with(['users'])->find($id);
        if ($project) {
            $map = [];
            foreach ($project->users as $user) {
                $user->id !== $project->leader_id ? $map[] = $user->id : $map;
            }
            $data = [
                'name' => $project->name,
                'leader_id' => $project->leader_id,
                'estimate' => $project->estimate,
                'start_date' => $project->start_date,
                'end_date' => $project->end_date,
                'status' => $project->status,
                'users_id' => $map
            ];
            return response()->json(['data' => $data, 'status' => 200], 200);
        }
        return response()->json(['status' => 404], 404);
    }


    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->only([
            'name',
            'leader_id',
            'estimate',
            'start_date',
            'end_date',
            'status'
        ]);

        $project = Project::find($id);
        $project->update($data);
        if ($project) {
            if ($request->has('users_id')) {
                $users = $request->get('users_id');
                if($request->has('leader_id') && auth('api')->user()->hasRole(['admin']))
                {
                    $users = array_merge([$request->leader_id], $users);
                }
                $project->users()->sync($users);
            }
            return response()->json(['data' => $project, 'status' => 200], 200);
        }
        return response()->json(['status' => 500], 500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Project $project
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if ($project) {
            $project->users()->detach();

            $deleted = $project->delete();
            if ($deleted) {
                return response()->json(['status' => 200]);
            }
        }

        return response()->json(['status' => 500], 500);
    }

    public function getUserByProject($id)
    {
        $project = Project::with(['users'])->find($id);
        if ($project) {
            $data = $project->users->map(function ($user) {
                return [
                    'label' => $user->full_name,
                    'value' => $user->id
                ];
            });

            return response()->json(['data' => $data, 'status' => 200], 200);
        }

        return response()->json(['status' => 404], 404);
    }
}
