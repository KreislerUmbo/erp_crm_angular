<?php

use App\Models\Configuration\MethodPayment;
use App\Models\Proforma\Proforma;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProformaPago extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $fillable=[
        "proforma_id",
        "method_payment_id",
        "monto",
        "date_validation",
        "nro_transaccion",
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

    public function proforma(){
        return $this->belongsTo(Proforma::class,"proforma_id");
    }
    public function method_payment(){
        return $this->belongsTo(MethodPayment::class,"method_payment_id");
    }
    
}
