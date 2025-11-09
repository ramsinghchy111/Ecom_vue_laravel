<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'column_id', 'title', 'description', 'first_name', 'last_name',
        'email', 'telephone', 'assigned_to', 'company_name', 'city', 'state',
        'country', 'zip', 'lead_value'
    ];

    public function column()
    {
        return $this->belongsTo(Column::class);
    }
}
