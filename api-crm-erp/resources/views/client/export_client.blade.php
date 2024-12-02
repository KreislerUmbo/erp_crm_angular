<table>
    <thead>
        <tr>
            <th>#</th>
            <th width="60">Nombre Completo / Razón Social </th>
            <th width="15">Tipo Documento</th>
            <th width="12">Nro Documento</th>
            <th width="15">Segmento Cliente</th>
            <th width="10">Teléfono</th>
            <th width="30">Correo</th>
            <th width="15">Orígen</th>
            <th width="15">Dirección</th>
            <th width="10">Región</th>
            <th width="10">Provincia</th>
            <th width="10">Distrito</th>
            <th width="10">Sucursal</th>
        </tr>
    </thead>
    <tbody>

        @foreach ($clients as $key => $client)
            <tr>
                <td>{{ $key + 1 }}</td>
                <td>{{ $client->full_name }}</td>
                <td>{{ $client->tipo_document_ident->name }}</td>
                <td>{{ $client->nro_document }}</td>
                <td>{{ $client->client_segment->name }}</td>
                <td>{{ $client->phone }}</td>
                <td>{{ $client->email }}</td>
                <td>{{ $client->origen }}</td>
                <td>{{ $client->address }}</td>
                <td>{{ $client->region }}</td>
                <td>{{ $client->provincia }}</td>
                <td>{{ $client->distrito }}</td>
                <td>{{ $client->sucursale->name }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
