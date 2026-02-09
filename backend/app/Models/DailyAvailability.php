<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DailyAvailability extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'pharmacist_id',
        'status',
        'note',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function pharmacist()
    {
        return $this->belongsTo(Pharmacist::class);
    }

    public function scopeForDate($query, $date)
    {
        return $query->whereDate('date', $date);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'Available');
    }
}
