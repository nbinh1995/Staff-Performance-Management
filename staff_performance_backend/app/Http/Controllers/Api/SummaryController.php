<?php

namespace App\Http\Controllers\Api;

use App\Models\Group;
use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;

class SummaryController extends Controller
{
    public function summary()
    {
        $countProject = Project::count();
        $countEmployee = User::count();
        $countOngoingProject = Project::where('status', 'pending')->count();
        $countOngoingTask = Task::where('status', 'pending')->count();

        return response()->json(
            [
                'data' => [
                    'count_project' => $countProject,
                    'count_employee' => $countEmployee,
                    'count_ongoing_project' => $countOngoingProject,
                    'count_ongoing_task' => $countOngoingTask,
                ],
                'status' => 200]
        );
    }

    public function projectsEffort(Request $request)
    {
        $now = Carbon::now();
        $from = $request->has('from') && is_valid_date($request->get('from')) ? $request->get('from') : Carbon::create($now->year, $now->month, 1);
        $to = $request->has('to') && is_valid_date($request->get('to')) ? $request->get('to') : Carbon::create($now->year, $now->month + 1, 1)->addDays(-1);

        $projectsEffort = Project::with(['users' => function ($users) {
            $users->with('tasks');
        }])
            ->where(function ($where) use ($from, $to) {
                $where->orWhereRaw('start_date between ? and ?', [$from, $to])
                    ->orWhereRaw('start_date between ? and ?', [$from, $to])
                    ->orWhereRaw('? between start_date and end_date', [$from])
                    ->orWhereRaw('? between start_date and end_date', [$to]);
            })
            ->when(auth('api')->user()->hasRole(['leader']), function ($query) {
                $query->where('leader_id', auth('api')->user()->id);
            })
            ->whereIn('status', ['pending', 'completed'])
            ->get();

        return response()->json(['data' => $projectsEffort, 'status' => 200]);
    }

    public function groupEffort(Request $request)
    {
        $now = Carbon::now();
        $from = $request->has('from') && is_valid_date($request->get('from')) ? $request->get('from') : Carbon::create($now->year, $now->month, 1);
        $to = $request->has('to') && is_valid_date($request->get('to')) ? $request->get('to') : Carbon::create($now->year, $now->month + 1, 1)->addDays(-1);
        $groupName = config('master.group.frontend');

        if ($request->has('group')) {
            $groupName = $request->get('group') === config('master.group.frontend')
                ? config('master.group.frontend')
                : config('master.group.backend');
        }

        if(in_array(auth('api')->user()->group->slug, [$groupName, config('master.group.management')], true)) {
            $groupEffort = User::with(
                [
                    'tasks' => function ($task) {
                        $task->where('status', '!=', 'cancel');
                    },
                    'projects' => function ($project) use ($from, $to) {
                        $project->where('status', '!=', 'cancel')
                            ->where(function ($where) use ($from, $to) {
                                $where->orWhereRaw('start_date between ? and ?', [$from, $to])
                                    ->orWhereRaw('start_date between ? and ?', [$from, $to])
                                    ->orWhereRaw('? between start_date and end_date', [$from])
                                    ->orWhereRaw('? between start_date and end_date', [$to]);
                            });
                    },
                ])
                ->whereHas('group', function ($group) use ($groupName) {
                    $group->where('slug', $groupName);
                })
                ->get();
        } else {
            $groupEffort = [];
        }

        return response()->json(['data' => $groupEffort, 'status' => 200, 'group' => $groupName]);
    }

}
