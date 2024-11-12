<table>
    <thead>
        <tr>
            <th>#</th>
            <th width="60">Titulo</th>
            <th width="15">Categoria</th>
            <th width="15">Precio General</th>
            <th width="15">SKU</th>
            <th width="40">Disponibilidad</th>
            <th width="40">Tipo de Impuesto</th>
            <th width="15">Umbral</th>
            <th width="15">Unidad Umbral</th>
            <th width="10">Peso</th>
            <th width="10">Ancho</th>
            <th width="10">Alto</th>
            <th width="10">Largo</th>
        </tr>
    </thead>
    <tbody>

        @foreach ($products as $key => $product)
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $product->title }}</td>
                <td>{{ $product->product_categorie->name }}</td>
                <td>{{ $product->price_general }}</td>
                <td>{{ $product->sku }}</td>
                <td> @php
                    $disponibilidad = "";
                    switch ($product->disponibilidad) {
                        case '1':
                            $disponibilidad = 'Vender productos sin stock ';
                            break;
                        case '2':
                            $disponibilidad = 'NO vender los prodcutos sin stock';
                            break;
                        case '3':
                            $disponibilidad = 'Proyectar con los contratos que se tenga';
                            break;

                        default:
                            # code...
                            break;
                    }
                @endphp
                    {{ $disponibilidad }}
                </td>
                <td>
                    @php
                        $tax_selected = "";
                        switch ($product->tax_selected) {
                            case '0':
                                $tax_selected = 'Libre de impuestos';
                                break;
                            case '1':
                                $tax_selected = 'Bienes sujetos a impuestos';
                                break;
                            case '2':
                                $tax_selected = 'Producto descargable';
                                break;

                            default:
                                # code...
                                break;
                        }

                    @endphp

                    {{ $tax_selected }}

                </td>
                <td>{{ $product->umbral ?? 0 }} Días</td>
                <td>{{ $product->umbral_unit ? $product->umbral_unit->name : '---' }}</td>
                <td>{{ $product->peso }}</td>
                <td>{{ $product->ancho }}</td>
                <td>{{ $product->alto }}</td>
                <td>{{ $product->Largo }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
