<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
</head>

<body style="background-image: url('{{asset('images/pt.png')}}');
            background-repeat: no-repeat;
            background-size: cover;">
    <div>

        <main class="py-4">



            <div class="container">
                <nav class="navbar navbar-expand-lg navbar static-top">
                    <div class="container">
                        <!-- <a class="navbar-brand" href="#">
                            <img src="http://placehold.it/150x50?text=Logo" alt="">
                        </a> -->


                        <a style="color: #FFF;" class="navbar-brand" href="/" title="{{ config('app.name', 'Laravel') }}">

                            <div>
                                <div class="float-left">
                                    <img src="{{ asset('images/moh-logo.png') }}" height="60" width="60" />
                                </div>
                                <div class="float-right" style="font-size:0.8em;margin-left: 10px;">
                                    Ministry of health<br>
                                    National Public Health Laboratories<br>
                                    RTRI
                                </div>
                            </div>
                        </a>



                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarResponsive">
                            <ul class="navbar-nav ml-auto">
                                <li style="background-color: purple;" class="nav-item active">
                                    <a style="color: white;" class="nav-link" href="#">About Us
                                        <span class="sr-only">(current)</span>
                                    </a>
                                </li>
                                <li style="background-color: purple; color: white;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="#">Library</a>
                                </li>

                                <li style="background-color: purple;" class="nav-item">
                                    <a style="color: white;" class="nav-link" href="#">Contact Us</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>


                <div style="background-color: purple; color:white">
                    <center class="home-app-info">
                        <div class="clearfix">&nbsp;</div>

                        <h1>KENYA EXTERNAL QUALITY ASSESSMENT SCHEME (KNEQAS)</h1>
                        <p>Monitoring and improving the quality of HIV results generated from your laboratory</p>
                        <h3>RTRI QC</h3>


                        <p>For any queries on the use of the system, please create a ticket on the
                            <a href='http://helpdesk.nphl.go.ke/index.php?a=add'>NPHL Help Desk</a> and we shall get back to you.
                        </p>

                        <div class="clearfix">&nbsp;</div>

                    </center>
                </div>

                <div style="margin-top: 30px;" class="text-center">
                    <div class="clearfix">&nbsp;</div>
                    <div>
                        <a style="background-color: purple; color:white" href="{{ route('participant_login_page') }}" class="btn home-purple btn-lg ">Click to login</a>
                    </div>
                    </p>
                </div>
            </div>
        </main>
    </div>
</body>

</html>