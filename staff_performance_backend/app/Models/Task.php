<?php

namespace App\Models;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;

    protected $guarded = [];
    
    public function project(){
        return $this->belongsTo(Project::class,'project_id','id');
    }

    public function user(){
        return $this->belongsTo(User::class,'user_id','id');
    }
}
