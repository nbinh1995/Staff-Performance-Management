<?php

use App\Models\Project;
use App\User;
use Faker\Generator as Faker;

$factory->define(Project::class, function (Faker $faker) {
    $status = ['pending','completed','cancel'];
    return [
        'name' => $faker->jobTitle,
        'estimate' => rand(100,200),
        'start_date' => $faker->dateTimeThisMonth,
        'end_date' => $faker->dateTimeThisMonth,
        'status' => $status[rand(0,2)],
        'leader_id' => User::all()->random()
    ];
});
