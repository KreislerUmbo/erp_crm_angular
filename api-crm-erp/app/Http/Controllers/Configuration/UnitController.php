<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\Unit;
use App\Models\Configuration\UnitTransform;
use Illuminate\Http\Request;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $units = Unit::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $units->total(),
            "units" => $units->map(function ($unit) {
                return [
                    "id" => $unit->id,
                    "name" => $unit->name,
                    "description" => $unit->description,
                    "state" => $unit->state ?? 1,
                    "transforms" => $unit->transforms->map(function($transfor){
                                $transfor->unit_to=$transfor->unit_to;
                        return $transfor;
                    }),
                    "create_format_at" => $unit->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_unit = Unit::where("name", $request->name)->first();
        if ($is_exists_unit) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DE LA UNIDAD YA EXISTE"
            ]);
        }

        $unit = Unit::create($request->all());

        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "name" => $unit->name,
                "description" => $unit->description,
                "transforms" => $unit->transforms->map(function($transfor){
                                $transfor->unit_to=$transfor->unit_to;
                    return $transfor;
                }),
                "state" => $unit->state ?? 1,
                "create_format_at" => $unit->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }

    public function add_transform(Request $request)
    {
        $is_exists_unit = UnitTransform::where("unit_id", $request->unit_id)
                              ->where("unit_to_id", $request->unit_to_id)
                                ->first();
        if ($is_exists_unit) {
            return response()->json([
                "message" => 403,
                "message_text" => "La unidad que seleccionaste a existe"
            ]);
        }


        $unit = UnitTransform::create([
            "unit_id"=>$request->unit_id,
            "unit_to_id"=>$request->unit_to_id,
        ]);

        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "unit_id" => $unit->unit_id,
                "unit_to_id" => $unit->descripunit_to_idtion,
                "unit_to" => $unit->unit_to,///relacion del modelo uno a muchos
                "create_format_at" => $unit->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }
    public function delete_transform($id) {
        $unit = UnitTransform::findOrFail($id);
        $unit->delete();
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
        $is_exists_unit = Unit::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();
        if ($is_exists_unit) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DE LA UNIDAD YA EXISTE"
            ]);
        }

        $unit = Unit::findOrFail($id);
        $unit->update($request->all());

        return response()->json([
            "message" => 200,
            "unit" => [
                "id" => $unit->id,
                "name" => $unit->name,
                "description" => $unit->description,
                "transforms" => $unit->transforms->map(function($transfor){
                     $transfor->unit_to=$transfor->unit_to;
                     return $transfor;
                }),
                "state" => $unit->state ?? 1,
                "create_format_at" => $unit->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $unit = Unit::findOrFail($id);
        //validacion por proforma

        $unit->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
