<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Task;
use Exception;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request,$idProject)
    {
        try{
            $tasks = Task::orderBy('id','desc')->leftJoin('users','tasks.user_id','users.id')
            ->where('project_id',$idProject)
            ->when($request->q,function($query) use ($request){
                $query->where(function($q) use ($request){
                    $q->orWhere('tasks.name','LIKE',"%{$request->q}%")
                    ->orWhere('users.full_name','LIKE',"%{$request->q}%");
                });
            })
            ->paginate(config('master.paginate.task'),['tasks.*','users.full_name as user_name']);
            return response()->json(compact('tasks'),200);
        }
        catch(Exception $e){
            return response()->json(['status' => 500],500);
        }
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $data = $request->only([
            'project_id',
            'user_id',
            'name',
            'rate',
            'effort_task',
            'effort_OT',
            'status',

        ]);
        $task = Task::create($data);
        if ($task) {
            return response()->json(['data' => $task, 'status' => 201],201);
        }
        return response()->json(['status' => 500],500);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function show(Task $task)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        $task = Task::find($id);
        if($task){
            return response()->json(['data' => $task, 'status' => 200],200);
        }
        return response()->json(['status' => 404],404);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $data = $request->only([
            'project_id',
            'user_id',
            'name',
            'rate',
            'effort_task',
            'effort_OT',
            'status',
        ]);

        $task = Task::find($id);
        $task->update($data);
    if ($task) {
        return response()->json(['data' => $task, 'status' => 200],200);
    }
    return response()->json(['status' => 500],500);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Task  $task
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {   
        $task = Task::find($id);
        if($task){
            $deleted = $task->delete();
            if($deleted){
                return response()->json(['status' => 200]);
            }
            return response()->json(['status' => 500],500);
        }
        return response()->json(['status' => 404],404);
    }
}
