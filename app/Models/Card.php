<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Card extends Model {
    protected $fillable = [
        'title','description','first_name','last_name','telephone','email','address',
        'lead_value','assigned_to','company_name','street','city','state','zip',
        'country','websites','column_id','order'
    ];

       protected $casts = [
        'websites' => 'array',
        'lead_value' => 'decimal:2',
        'position' => 'integer'
    ];

    public function column() {
        return $this->belongsTo(Column::class);
    }
}
