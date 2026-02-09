<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pharmacist extends Model
{
    use HasFactory;

    protected $fillable = [
        'full_name',
        'phone',
        'home_area',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function availabilities()
    {
        return $this->hasMany(DailyAvailability::class);
    }

    public function planItems()
    {
        return $this->hasMany(DailyPlanItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
