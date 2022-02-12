<?php

use App\Models\Group;
use App\Models\Project;
use App\Models\Role;
use App\Models\Task;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    private $groups = [
        [
            'name' => 'Management',
            'slug' => 'management',
        ],
        [
            'name' => 'Frontend',
            'slug' => 'frontend',
        ],
        [
            'name' => 'Backend',
            'slug' => 'backend'
        ],
    ];
    private $roles = [
        [
            'name' => 'Admin',
            'slug' => 'admin',
        ],
        [
            'name' => 'Leader',
            'slug' => 'leader',
        ],
        [
            'name' => 'Staff',
            'slug' => 'staff',
        ],
    ];

    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('groups')->insert($this->groups);

        DB::table('roles')->insert($this->roles);

        User::create([
            'full_name' => 'ADMIN',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role_id' => 1,
            'group_id' => 1,
        ]);

        User::create([
            'full_name' => 'USER',
            'email' => 'user@user.com',
            'password' => Hash::make('password'),
            'role_id' => 3,
            'group_id' => 2,
        ]);
        factory(Project::class, 50)->create();

        $this->call([
            UsersTableSeeder::class,
        ]);

        factory(Task::class, 50)->create();
    }
}
