@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_pt_component'))
    <div id="list_laboratory_users"></div>
    @endif

</div>
@endsection