<?php

namespace App\Models\Client;

use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\Sucursale;
use App\Models\Configuration\TipoDocumentIdent;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Client extends Model
{
   use HasFactory;
   use SoftDeletes;
   protected $fillable = [

      "name",
      "surname",
      "full_name",
      "client_segment_id",
      "phone",
      "email",
      "type",
      "type_document_id",
      "nro_document",
      "origen",
      "birthdate",
      "sexo",
      "sucursale_id",
      "asesor_id",
      "is_parcial",
      "address",
      "ubigeo_distrito",
      "ubigeo_provincia",
      "ubigeo_region",
      "distrito",
      "provincia",
      "region",
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

   public function client_segment()
   {
      return $this->belongsTo(ClientSegment::class);
   }

   public function asesor()
   {
      return $this->belongsTo(User::class, "asesor_id");
   }
   public function sucursale()
   {
      return $this->belongsTo(Sucursale::class, "sucursale_id");
   }
   
   public function tipo_document_ident()
   {
      return $this->belongsTo(TipoDocumentIdent::class, "type_document_id");
   }

   public function scopeFilterAdvance($query, $search, $client_segment_id, $type, $asesor_id)
   {
      if ($search) {
         $query->where(DB::raw("CONCAT(clients.full_name,' ',clients.phone,' ',clients.nro_document)"), "like", "%" . $search . "%");
      }
      if ($client_segment_id) {
         $query->where("client_segment_id", $client_segment_id);
      }
      if ($type) {
         $query->where("type", $type);
      }
      if ($asesor_id) {
         $query->where("asesor_id", $asesor_id);
      }
      return $query;
   }


   public function scopeFilterProforma($query, $nro_document, $full_name,$phone)
   {
      if ($nro_document) {
         $query->where("nro_document","like","%" .$nro_document."%");
      }
      if ($full_name) {
         $query->where("full_name","like","%" .$full_name."%");
      }
      if ($phone) {
         $query->where("phone","like","%" .$phone."%");
      }
      return $query;
   }

}
