<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TaskApiController extends Controller
{
    public function getAuthenticatedUserTasks(Request $request)
    {
        $user = $request->user();
        $tasks = Task::where('user_id', $user->id)->get();
        return response()->json($tasks);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'task' => 'required|string',
            'is_done' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $user = $request->user();

        $task = new Task();
        $task->task = $request->task;
        $task->is_done = $request->is_done;
        $task->user_id = $user->id;
        $task->save();

        return response()->json($task);
    }

    public function updateCheck(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validator = Validator::make($request->all(), [
            'is_done' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $task->is_done = $request->is_done;
        $task->save();

        return response()->json($task);
    }

    public function updateOrder(Request $request, Task $task)
    {
        $siblingTaskId = $request->input('sibling_task_id');
        $siblingTask = Task::findOrFail($siblingTaskId);

        // タスクのorderをスワップ
        $tempOrder = $task->order;
        $task->order = $siblingTask->order;
        $siblingTask->order = $tempOrder;

        // タスクのorderをデータベースに保存
        $task->save();
        $siblingTask->save();

        return response()->json(['message' => 'Task order updated successfully.']);
    }


    public function destroy(Request $request, Task $task)
    {
        if ($task->user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $task->delete();

        return response()->json(['message' => 'Task deleted successfully']);
    }
}
