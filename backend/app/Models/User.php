<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function isHR(): bool
    {
        return $this->role === 'HR';
    }

    public function isManager(): bool
    {
        return $this->role === 'Manager';
    }

    public function isPharmacist(): bool
    {
        return $this->role === 'Pharmacist';
    }

    public function generatedPlans()
    {
        return $this->hasMany(DailyPlan::class, 'generated_by');
    }
}
