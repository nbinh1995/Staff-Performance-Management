<?php

namespace App;

use App\Models\Group;
use App\Models\Project;
use App\Models\Task;
use App\Models\UserTrait\HasPermissionTrait;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use Notifiable;
    use SoftDeletes;
    use HasPermissionTrait;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $guard = [];

    protected $fillable = ['full_name',
        'password',
        'email',
        'dob',
        'phone',
        'salary',
        'pay_per_hour',
        'group_id',
        'role_id',
        'avatar',
        'group_id',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    // Rest omitted for brevity

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return ['nm'=>$this->full_name,'s'=>$this->role->slug ,'g' => $this->group->slug];
    }

    public function group()
    {
        return $this->belongsTo(Group::class, 'group_id', 'id');
    }

    public function projects()
    {
        return $this->belongsToMany(Project::class, 'projects_users', 'user_id', 'project_id');
    }

    public function projectsOfLeader(){
        return $this->hasMany(Project::class,'leader_id','id');
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
}
