<?php

namespace Database\Seeders;

use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Seeder;

class TasksSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();

        foreach ($users as $user) {
            $orderDone = 1;
            $orderNotDone = 1;
            Task::factory()
                ->count(5) // ユーザーごとに5つのタスクを生成
                ->for($user) // ユーザーとタスクを関連付け
                ->create()
                ->each(function ($task) use (&$orderDone, &$orderNotDone) {
                    if ($task->is_done) {
                        $task->order = $orderDone++;
                    } else {
                        $task->order = $orderNotDone++;
                    }
                    $task->save();
                });
        }
    }
}
