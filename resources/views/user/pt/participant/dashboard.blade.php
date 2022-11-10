@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_pt_component') && Auth::user()->can('lab_manager'))
    <div id="participant-pt-dashboard"></div>
    @endif

</div>
@endsection