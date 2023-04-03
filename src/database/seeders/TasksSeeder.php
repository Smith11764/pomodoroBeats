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
            Task::factory()
                ->count(5) // ユーザーごとに5つのタスクを生成
                ->for($user) // ユーザーとタスクを関連付け
                ->create();
        }
    }
}
