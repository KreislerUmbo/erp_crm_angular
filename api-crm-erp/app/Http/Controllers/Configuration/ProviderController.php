<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\Provider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProviderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $providers = Provider::where("razon_soc", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $providers->total(),
            "providers" => $providers->map(function ($provider) {
                return [
                    "id" => $provider->id,
                    "razon_soc" => $provider->razon_soc,
                    "name_comercial" => $provider->name_comercial,
                    "ruc" => $provider->ruc,
                    "email" => $provider->email,
                    "phone" => $provider->phone,
                    "address" => $provider->address,
                    "otros_datos" => $provider->otros_datos,
                    "imagen" => $provider->imagen ? env("APP_URL") . "storage/" . $provider->imagen : NULL,
                    "state" => $provider->state ?? 1,
                    "create_format_at" => $provider->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        
        $is_exists_provider = Provider::where("razon_soc", $request->name)->first();
        if ($is_exists_provider) {
            return response()->json([
                "message" => 403,
                "message_text" => "LA RAZON SOCIAL DEL PROVEEDOR YA EXISTE"
            ]);
        }
                  
        $is_exists_provider = Provider::where("ruc", $request->name)->first();
        if ($is_exists_provider) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL RUC PROVEEDOR YA EXISTE"
            ]);
        }


        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("provider_imagen")) {// provider_imagen ES EL KEY DE LA IMAGEN
            $path = Storage::putFile("providers", $request->file("provider_imagen")); //putFile("providers" ESTE ES EL NOMBRE DE LA CARPETA DONDE SE ALMACENA LAS IMG   
                                                                                     // >file("provider_imagen")  se va a utilizar en createprovder.component
            $request->request->add(["imagen" => $path]);
        }

        $provider= Provider::create($request->all());

        return response()->json([
            "message" => 200,
            "provider" => [
                "id" => $provider->id,
                "razon_soc" => $provider->razon_soc,
                "name_comercial" => $provider->name_comercial,
                "ruc" => $provider->ruc,
                "email" => $provider->email,
                "phone" => $provider->phone,
                "address" => $provider->address,
                "otros_datos" => $provider->otros_datos,
                "imagen" => $provider->imagen ? env("APP_URL") . "storage/" . $provider->imagen : NULL,
                "state" => $provider->state ?? 1,
                "create_format_at" => $provider->created_at->format("d-m-Y   h:i A"),
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
        $is_exists_provider = Provider::where("razon_soc", $request->name)->first();
        if ($is_exists_provider) {
            return response()->json([
                "message" => 403,
                "message_text" => "LA RAZON SOCIAL DEL PROVEEDOR YA EXISTE"
            ]);
        }
            
        $is_exists_provider = Provider::where("ruc", $request->name)
            ->where("id", "<>", $id)
            ->first();

        if ($is_exists_provider) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL NOMBRE DE LA CATEGORIA YA EXISTE"
            ]);
        }

        $provider = Provider::findOrFail($id); //para sacar el id

        //como hay una img  por guardar entonces hacemos
        if ($request->hasFile("provider_imagen")) {
            //validamos si hay para borrarla
            if ($provider->imagen) {
                Storage::delete($provider->imagen);
            }
            $path = Storage::putFile("providers", $request->file("provider_imagen"));
            $request->request->add(["imagen" => $path]);
        }


        $provider->update($request->all());

        return response()->json([
            "message" => 200,
            "provider" => [
                "id" => $provider->id,
                "razon_soc" => $provider->razon_soc,
                "name_comercial" => $provider->name_comercial,
                "ruc" => $provider->ruc,
                "email" => $provider->email,
                "phone" => $provider->phone,
                "address" => $provider->address,
                "otros_datos" => $provider->otros_datos,
                "imagen" => $provider->imagen ? env("APP_URL") . "storage/" . $provider->imagen : NULL,
                "state" => $provider->state ?? 1,
                "create_format_at" => $provider->created_at->format("d-m-Y   h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $provider = Provider::findOrFail($id);
        //validacion por PRODUCTO

        $provider->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
