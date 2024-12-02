<?php

namespace App\Models\Proforma;

use App\Models\Client\Client;
use App\Models\Configuration\ClientSegment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Proforma extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable=[
        "user_id",
        "client_id",
        "client_segment_id",
        "subtotal",
        "descuento",
        "total",
        "igv",
        "state_proforma",
        "state_payment",
        "deuda",
        "paid_out",//cancelado
        "date_validation",
        "fecha_pago_completo",
        "description",        
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

    public function asesor(){
        return $this->belongsTo(User::class,"user_id");
    }

    public function client(){
        return $this->belongsTo(Client::class,"client_id");
    }

    public function client_segment(){
        return $this->belongsTo(ClientSegment::class,"client_segment_id");
    }

}
