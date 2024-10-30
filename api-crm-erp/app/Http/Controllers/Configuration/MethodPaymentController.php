<?php

namespace App\Http\Controllers\Configuration;

use App\Http\Controllers\Controller;
use App\Models\Configuration\MethodPayment;
use Illuminate\Http\Request;

class MethodPaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->get("search");
        $method_payments = MethodPayment::where("name", "like", "%" . $search . "%")
            ->orderBy("id", "desc")
            ->paginate(25);

        return response()->json([
            "total" => $method_payments->total(),
            "method_payments" => $method_payments->map(function ($method_pay) {
                return [
                    "id" => $method_pay->id,
                    "name" => $method_pay->name,
                    "method_payment_id" => $method_pay->method_payment_id,
                    "method_payment" => $method_pay->method_payment, //dela relacion uno a uno
                    "method_payments" => $method_pay->method_payments, //dela relacion uno a muchos
                    "state" => $method_pay->state ?? 1,
                    "create_format_at" => $method_pay->created_at->format("d-m-Y   h:i A"),
                ];
            }),

        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $is_exists_methodpayment = MethodPayment::where("name", $request->name)->first();
        if ($is_exists_methodpayment) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL METODO DE PAGO YA EXISTE"
            ]);
        }

        $method_payment = MethodPayment::create($request->all());

        return response()->json([
            "message" => 200,
            "method_payment" => [
                "id" => $method_payment->id,
                "name" => $method_payment->name,
                "method_payment_id" => $method_payment->method_payment_id,
                "state" => $method_payment->state ?? 1,
                "create_format_at" => $method_payment->created_at->format("d-m-Y   h:i A"),
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
        $is_exists_methodpayment = MethodPayment::where("name", $request->name)
            ->where("id", "<>", $id)
            ->first();
        if ($is_exists_methodpayment) {
            return response()->json([
                "message" => 403,
                "message_text" => "EL METODO DE PAGO YA EXISTE"
            ]);
        }

        $method_payment = MethodPayment::findOrFail($id);
        $method_payment->update($request->all());

        return response()->json([
            "message" => 200,
            "method_payment" => [
                "id" => $method_payment->id,
                "name" => $method_payment->name,
                "method_payment_id" => $method_payment->method_payment_id,
                "state" => $method_payment->state ?? 1,
                "create_format_at" => $method_payment->created_at->format("d-m-Y   h:i A"),
            ]

        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $method_payment = MethodPayment::findOrFail($id);
        //validacion por proforma

        $method_payment->delete();
        return response()->json([
            "message" => 200,
        ]);
    }
}
