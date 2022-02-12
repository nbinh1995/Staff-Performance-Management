<?php

use Faker\Generator as Faker;
use App\Models\Task;


$factory->define(Task::class, function (Faker $faker) {
    return [
        'project_id' => $faker->numberBetween(1,50),
        'user_id' => 1,
        'name' => $faker->jobTitle,
        'rate' => 1,
        'effort_task' => 1,
        'effort_OT' => 1,
    ];
});
