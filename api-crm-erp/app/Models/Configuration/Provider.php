<?php

namespace App\Models\Configuration;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Provider extends Model
{
    use HasFactory;
    use SoftDeletes;
     protected $fillable = [
        'razon_soc',
        'name_comercial',
        'ruc',
        "email",
        "phone",
        "address",
        "otros_datos",
        "imagen",
        "state",
     ];

     public function setCreatedAtAttribute($value)
     {
         date_default_timezone_set("America/Lima");
         $this->attributes["created_at"] = Carbon::now();
     }
 
     public function setUpdatedsAtAttribut($value)
     {
         date_default_timezone_set("America/Lima");
         $this->attributes["updated_at"] = Carbon::now();
     }

}
