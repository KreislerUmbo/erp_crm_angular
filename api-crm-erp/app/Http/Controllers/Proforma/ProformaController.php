<?php

namespace App\Http\Controllers\Proforma;

use App\Http\Controllers\Controller;
use App\Http\Resources\Product\ProductCollection;
use App\Models\Client\Client;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\TipoDocumentIdent;
use App\Models\Product\Product;
use App\Models\Proforma\Proforma;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProformaController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->get("search");
        $proformas = Proforma::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $proformas->total(),
            "proformas" => $proformas,
        ]);
    }

    public function search_clients(Request $request)
    {
        $nro_document = $request->get("nro_document");
        $full_name = $request->get("full_name");
        $phone = $request->get("phone");

        $clients = Client::filterProforma($nro_document, $full_name, $phone)->where("state", 1)->orderBy("id", "desc")->get();

        return response()->json([
            "clients" => $clients->map(function ($client) {
                return [
                    "id" => $client->id,
                    "full_name" => $client->full_name,
                    "client_segment" => $client->client_segment,
                    "phone" => $client->phone,
                    "type" => $client->type,
                    "nro_document" => $client->nro_document,
                    "is_parcial" => $client->is_parcial,
                ];
            })
        ]);
    }
    public function search_products(Request $request){
        $search=$request->get("search"); 
        $products=Product::where(DB::raw("CONCAT(products.title,' ',products.sku )"),"like","%".$search."%")->orderBy("id","desc")->get();
         return response()->json([
            "products"=>ProductCollection::make($products),
         ]);
    }

    public  function config()
    {
        $client_segments = ClientSegment::where("state", 1)->get();
        $tipo_document_idents = TipoDocumentIdent::where("state", 1)->get();
        $asesores = User::whereHas("role", function ($q) {
            $q->where("name", "like", "%ASESOR%");
        })->get();
        return response()->json([
            "client_segments" => $client_segments,
            "tipo_document_idents" => $tipo_document_idents,
            "asesores" => $asesores->map(function ($user) {
                return [
                    "id" => $user->id,
                    "full_name" => $user->name . ' ' . $user->surname,
                ];
            })

        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $proforma = Proforma::create($request->all());

        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {

        $proforma = Proforma::findOrFail($id);

        return response()->json([
            "message" => 200,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $proforma = Proforma::findOrFail($id);

        $proforma->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
