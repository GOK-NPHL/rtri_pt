<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Lot extends Model
{
    protected $fillable = [
        'name',
        'shipment_id',
        // 'lot',
        'ending_ids',
        'created_by',
    ];

    protected $softDelete = true;

    //user
    public function user()
    {
        return $this->belongsTo('App\User'); //, 'created_by');
    }

    //shipment
    public function shipment()
    {
        return $this->belongsTo(PtShipement::class, 'shipment_id')->first();
    }

    //participants
    public function participants()
    {
        $exploded = explode(",", $this->ending_ids);
        $counter = count($exploded);
        $participants = [];
        for ($i = 0; $i < $counter; $i++) {
            $users = User::where('id', 'LIKE', '%' . $exploded[$i]);
            //merge to one array
            $participants = array_merge($participants, $users->get()->toArray());
        }
        return $participants;
    }
}
