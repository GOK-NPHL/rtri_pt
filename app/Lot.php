<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    protected $fillable = [
        'name',
        // 'shipment_id', // change to readiness
        'readiness_id',
        // 'lot',
        // 'ending_ids',
        'participant_ids',
        'created_by',
    ];

    protected $softDelete = true;

    protected $casts = [
        'participant_ids' => 'array',
    ];

    //user
    public function user()
    {
        return $this->belongsTo('App\User'); //, 'created_by');
    }

    //panel
    // public function panel()
    // {
    //     return $this->belongsTo(PtPanel::class, 'ptpanel_id')->first();
    // }

    //readiness
    public function readiness()
    {
        // return $this->belongsTo('App\Readiness');
        $r = $this->belongsTo(Readiness::class, 'readiness_id')->first();
        return $r;

        // return $this->belongsTo(Readiness::class, 'readiness_id');
    }

    //participants
    public function participants()
    {
        // this is from the pool of users from labs who had the readiness given by readiness_id

        $participant_ids = $this->participant_ids ?? [];
        if(is_string($participant_ids)){
            $participant_ids = json_decode($participant_ids);
        }
        $participant_id_count = count($participant_ids);
        $readiness = $this->readiness();
        $readiness_participants = $readiness->participants();
        $readiness_participants_ids = array_column($readiness_participants, 'id');
        $participants = [];
        for ($i = 0; $i < $participant_id_count; $i++) {
            $users = User::whereIn('id', $readiness_participants_ids)->where('id', $participant_ids[$i])->get();
            $participants = array_merge($participants, $users->toArray());
        }
        return $participants;
    }

    // lab
    public function laboratory()
    {
        $readiness = $this->readiness();
        $laboratory = $readiness->laboratory();
        return $laboratory;
    }
}
