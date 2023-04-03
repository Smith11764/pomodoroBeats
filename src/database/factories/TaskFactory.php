<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        return [
            'task' => $this->faker->sentence,
            'is_done' => $this->faker->boolean,
        ];
    }
}
