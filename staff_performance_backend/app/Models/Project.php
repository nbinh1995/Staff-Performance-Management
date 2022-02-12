<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Project extends Model
{
    use SoftDeletes;
    protected $table = 'projects';
    protected $guarded = [];

    public function tasks(){
        return $this->hasMany(Task::class,'project_id','id');
    }
    
    public function users(){
        return $this->belongsToMany(User::class,'projects_users','project_id','user_id');
    }

    public function leader(){
        return $this->belongsTo(User::class,'leader_id','id');
    }

}
