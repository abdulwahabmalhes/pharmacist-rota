<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'generated_by',
        'algorithm',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function generator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    public function items()
    {
        return $this->hasMany(DailyPlanItem::class);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }
}
