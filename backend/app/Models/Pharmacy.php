<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pharmacy extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'area',
        'address',
        'open_from',
        'open_to',
        'active',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];

    public function planItems()
    {
        return $this->hasMany(DailyPlanItem::class);
    }

    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
}
