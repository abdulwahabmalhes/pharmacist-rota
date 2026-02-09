<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyPlanItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'daily_plan_id',
        'pharmacist_id',
        'pharmacy_id',
        'slot_index',
        'planned_time',
        'status',
    ];

    protected $casts = [
        'planned_time' => 'datetime:H:i',
    ];

    public function dailyPlan()
    {
        return $this->belongsTo(DailyPlan::class);
    }

    public function pharmacist()
    {
        return $this->belongsTo(Pharmacist::class);
    }

    public function pharmacy()
    {
        return $this->belongsTo(Pharmacy::class);
    }
}
