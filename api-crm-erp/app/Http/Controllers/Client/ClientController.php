<?php

namespace App\Http\Controllers\Client;

use App\Exports\Client\ExportClient;
use App\Http\Controllers\Controller;
use App\Http\Resources\Client\ClientCollection;
use App\Http\Resources\Client\ClientResource;
use App\Imports\ClientsImport;
use App\Models\Client\Client;
use App\Models\Configuration\ClientSegment;
use App\Models\Configuration\TipoDocumentIdent;
use App\Models\User;
use COM;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->search;
        $client_segment_id = $request->client_segment_id;
        $type = $request->type;
        $asesor_id = $request->asesor_id;

        //where("full_name", "like", "%" . $search . "%")
        $clients = Client::filterAdvance($search, $client_segment_id, $type, $asesor_id)
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $clients->total(),
            "clients" => ClientCollection::make($clients),
            "state" => $clients->state ?? 1,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_client = Client::where("nro_document", $request->nro_document)->first();
        if ($is_exists_client) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL CLIENTE YA EXISTE"
            ]);
        }
        if (!$request->asesor_id) {
            $request->request->add(["asesor_id" => auth()->user()->id]);
        }
        $request->request->add(["sucursale_id" => auth()->user()->sucursale_id]);

        $client = Client::create($request->all());

        return response()->json([
            "message" => 200,
            "client" => ClientResource::make($client),
            "state" => $client->state,
        ]);
    }

    public function config()
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


    public function export_clients(Request $request)
    {
        $search = $request->get("search");
        $client_segment_id = $request->client_segment_id;
        $type = $request->type;
        $asesor_id = $request->asesor_id;

        $clients = Client::filterAdvance($search, $client_segment_id, $type, $asesor_id)
            ->orderBy("id", "desc")->get();
        return Excel::download(new ExportClient($clients), "Clientes_descargados.xlsx");
    }



    
    public function import_clients(Request $request)
    {
        $request->validate([
            "import_file" => 'required|file|mimes:xls,xlsx,csv'
        ]);
        $path=$request->file("import_file");

        $data=Excel::import(new ClientsImport,$path);
        return response()->json([
            "message"=>200,
        ]);
    }

    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $is_exists_client = Client::where("nro_document", $request->nro_document)
            ->where("id", "<>", $id)
            ->first();

        if ($is_exists_client) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL CLIENTE YA EXISTE"
            ]);
        }

        $client = Client::findOrFail($id);
        $client->update($request->all());

        return response()->json([
            "message" => 200,
            "client" => ClientResource::make($client),
            "state" => $client->state,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::findOrFail($id);

        $client->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
