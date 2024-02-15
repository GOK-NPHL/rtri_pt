<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>New {{ $readiness_name }} Checklist</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
        }
    </style>
</head>
<body>
    <h1>New Readiness Checklist</h1>
    <p>Dear {{ $user_name }}: {{ $lab_name }},</p>
    <p>{{ $lab_name }} has been assigned a new readiness checklist: <b>{{ $readiness_name }}</b> for the coming PT Cycle.</p>
    <p>This readiness checklist is available from <b>{{ $start_date }}</b> and ends on <b>{{ $end_date }}</b></p>
    <p>Please log in to <b><a href="http://rtript.nphl.go.ke">http://rtript.nphl.go.ke</a></b> to complete the readiness checklist.</p>
    <p>Thank you!</p>
    <br>
    <p>Regards,</p>

    <p>MOH NPHL KNEQAS.</p>
</body>
</html>
