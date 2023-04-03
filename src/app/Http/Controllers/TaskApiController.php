<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TaskApiController extends Controller
{
    public function getAuthenticatedUserTasks()
    {
        $user = Auth::user();
        if ($user) {
            return $user->tasks;
        }
        return response()->json(['message' => 'User not authenticated'], 401);
    }

    public function store(Request $request)
    {
        $request->validate([
            'task' => 'required',
            'is_done' => 'required|boolean'
        ]);

        $task = new Task;
        $task->task = $request->task;
        $task->is_done = $request->is_done;
        $task->save();

        return response()->json($task, 201);
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'task' => 'required',
            'is_done' => 'required|boolean'
        ]);

        $task->task = $request->task;
        $task->is_done = $request->is_done;
        $task->save();

        return response()->json($task);
    }
}
