<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\ClientSegment;
use Illuminate\Http\Request;

class ClientSegmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $client_segments = ClientSegment::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $client_segments->total(),
            "client_segments" => $client_segments->map(function ($client_segment) {
                return [
                    "id" => $client_segment->id,
                    "name" => $client_segment->name,
                    "state" => $client_segment->state ?? 1,
                    "create_format_at" => $client_segment->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_clientsegment = ClientSegment::where("name", $request->name)->first();
        if ($is_exists_clientsegment) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DEL SEGMENTO DE CLIENTE EXISTE"
            ]);
        }

        $client_segment = ClientSegment::create($request->all());

        return response()->json([
            "message" => 200,
            "client_segment" => [
                "id" => $client_segment->id,
                "name" => $client_segment->name,
                "state" => $client_segment->state,
                "create_format_at" => $client_segment->created_at->format("Y-m-d h:i A"),
            ]
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
        $is_exists_clientsegment = ClientSegment::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();

        if ($is_exists_clientsegment) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DEL SEGMENTO DE CLIENTE EXISTE"
            ]);
        }

        $client_segment = ClientSegment::findOrFail($id);
        $client_segment->update($request->all());

        return response()->json([
            "message" => 200,
            "client_segment" => [
                "id" => $client_segment->id,
                "name" => $client_segment->name,
                "state" => $client_segment->state,
                "create_format_at" => $client_segment->created_at->format("Y-m-d h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client_segment = ClientSegment::findOrFail($id);

        $client_segment->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
