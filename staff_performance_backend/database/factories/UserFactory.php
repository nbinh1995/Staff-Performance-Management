<?php

use Faker\Generator as Faker;
use Illuminate\Support\Facades\Hash;

/*
|--------------------------------------------------------------------------
| Model Factories
|--------------------------------------------------------------------------
|
| This directory should contain each of the model factory definitions for
| your application. Factories provide a convenient way to generate new
| model instances for testing / seeding your application's database.
|
*/

$factory->define(App\User::class, function (Faker $faker) {
    return [
        'full_name' => $faker->name,
        'email' => $faker->unique()->safeEmail,
        'dob' => '2000-01-01',
        'phone' => '0971123456',
        'salary' => '20000',
        'pay_per_hour' => '100',
        'password' => Hash::make('password'), // secret
        'remember_token' => str_random(10),
        'role_id' => rand(2,3),
        'group_id' => rand(2,3),
    ];
});
