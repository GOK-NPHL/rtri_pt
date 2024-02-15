<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewReadiness extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */

    public $readiness;
    public function __construct($data)
    {
        // Log::info('NewReadiness: ' . gettype($readiness), $readiness);
        // $this->readiness = collect($data);
        $this->readiness = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // Log::info('NewReadiness: ' . $this->readiness['readiness_name'] . ',, ' . $this->readiness['lab_name'] . ',, ' . $this->readiness['start_date'] . ',, ' . $this->readiness['end_date']);
        return $this->view('emails.newreadiness')
            ->subject('New Readiness Checklist: ' . $this->readiness['readiness_name'])
            ->with('lab_name', $this->readiness['lab_name'])
            ->with('user_name', $this->readiness['user_name'])
            ->with('readiness_name', $this->readiness['readiness_name'])
            ->with('start_date', $this->readiness['start_date'])
            ->with('end_date', $this->readiness['end_date']);
    }
}
