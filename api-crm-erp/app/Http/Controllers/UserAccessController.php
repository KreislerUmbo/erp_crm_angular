<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

class UserAccessController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $users = User::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $users->total(),
            "users" => $users->map(function ($user) {
                return [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email,
                    "surname" => $user->surname,
                    "full_name" => $user->name . ' ' . $user->surname,
                    "phone" => $user->phone,
                    "role_id" => $user->role_id,
                    "role" => $user->role,
                    "roles" => $user->roles,
                    "sucursal_id" => $user->sucursal_id,
                    "type_document" => $user->type_document,
                    "nro_document" => $user->nro_document,
                    "gender" => $user->gender,
                    "address" => $user->address,
                    "avatar" => $user->avatar ? env("APP_URL") . "storage/" . $user->avatar : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
                    "create_format_at" => $user->created_at->format("Y-m-d h:i A"),
                ];
            }),
        ]);
    }



    public function config()
    {
        return response()->json([
            "roles" => Role::all(),
        ]);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $USER_EXIST = User::where("email", $request->email)->first();
        if ($USER_EXIST) {
            return response()->json([
                "message" => 403,
                "message_text" => "El Usuario ya Existe",
            ]);
        }

        if ($request->hasFile("imagen")) {//hasFile sire para validar si un archivo esta presentes
            $path = Storage::putFile("users", $request->file("imagen"));//putfile es un método que se utiliza para transmitir automáticamente un archivo a una ubicación de almacenamiento
            $request->request->add(["avatar"=>$path]);
        }

        if ($request->password) {
            $request->request->add(["password" => bcrypt($request->password)]);
        }

        $role = Role::findOrFail($request->role_id);// findOrFail permite recuperar un registro específico en función de su ID, pero si el registro no se encuentra, lanza una excepción.
       
        $user = User::create($request->all());
        $user->assignRole($role);// assignRole sirve para asignar roles a usuarios

        return response()->json([
            "message" => 200,
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "surname" => $user->surname,
                "full_name" => $user->name . ' ' . $user->surname,
                "phone" => $user->phone,
                "role_id" => $user->role_id,
                "role" => $user->role,
                "roles" => $user->roles,
                "sucursal_id" => $user->sucursal_id,
                "type_document" => $user->type_document,
                "nro_document" => $user->nro_document,
                "gender" => $user->gender,
                "address" => $user->address,
                "avatar" => $user->avatar ? env("APP_URL") . "storage/" . $user->avatar : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
                "create_format_at" => $user->created_at->format("Y-m-d h:i A"),
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

        $USER_EXIST = User::where("email", $request->email)
            ->where("id", "<>", $id)
            ->first();

        if ($USER_EXIST) {
            return response()->json([
                "message" => 403,
                "message_text" => "El Usuario ya Existe",
            ]);
        }

        $user = User::findOrFail($id);

        if ($request->hasFile("imagen")) {

            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            $path = Storage::putFile("users", $request->file("imagen"));
            $request->request->add(["avatar"=> $path]);
        }

        if ($request->password) {
            $request->request->add(["password" => bcrypt($request->password)]);
        }


        if ($request->role_id != $user->role_id) {
            //EL VIEJO ROL
            $role_old = Role::findOrFail($request->role_id);
            $user->removeRole($role_old);

            //EL NUEVO ROL
            $role = Role::findOrFail($request->role_id);
            $user->assignRole($role);
        }

        $user->update($request->all());

        return response()->json([
            "message" => 200,
            "user" => [
                "id" => $user->id,
                "name" => $user->name,
                "email" => $user->email,
                "surname" => $user->surname,
                "full_name" => $user->name . ' ' . $user->surname,
                "phone" => $user->phone,
                "role_id" => $user->role_id,
                "role" => $user->role,
                "roles" => $user->roles,
                "sucursal_id" => $user->sucursal_id,
                "type_document" => $user->type_document,
                "nro_document" => $user->nro_document,
                "gender" => $user->gender,
                "address" => $user->address,
                "avatar" => $user->avatar ? env("APP_URL") . "storage/" . $user->avatar : 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png',
                "create_format_at" => $user->created_at->format("Y-m-d h:i A"),
            ]
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $user = User::findOrFail($id);
        if ($user->avatar) {
            Storage::delete($user->avatar);
        }
   
        $user->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
