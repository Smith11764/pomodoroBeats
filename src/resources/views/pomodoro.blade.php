<!DOCTYPE html>
{{--<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">--}}
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Pomodoro Beats</title>
    <link rel="icon" type="image/png" href="{{ asset('images/clock.png') }}">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/pomodoro.css') }}" rel="stylesheet">

    <!-- Scripts -->
    <script src="{{ asset('js/timer.js') }}"></script>
    <script src="{{ asset('js/todo.js') }}"></script>
</head>
<body>
    <!-- Auth Buttons Container -->
    <div class="auth-buttons-container">
        @auth
            <a class="nes-btn is-primary" href="{{ route('logout') }}"
               onclick="event.preventDefault(); document.getElementById('logout-form').submit();">
                Logout
            </a>
            <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                @csrf
            </form>
        @endauth
        @guest
            <a class="nes-btn is-primary" href="{{ route('login') }}">Login</a>
            <a class="nes-btn is-success" href="{{ route('register') }}">Register</a>
        @endguest
    </div>
    <!-- about_section -->
    <div class="nes-container is-dark">
        <div class="header-container">
            <img class="rapper_image" src="{{ asset('images/clock.png') }}" alt="rapper image">
            <h1>Pomodoro Beats</h1>
            <img class="rapper_image" src="{{ asset('images/clock.png') }}" alt="rapper image">
        </div>
        <!-- Balloon -->
        <h2>How to use this?</h2>
        <p>
            Click "START!!!" button.<br>
            You can choose your background music at "Music" section.<br>
            Also, you can add your task at "ToDo" section.<br>
            When you finish your task, click "Done" button.<br>
        </p>
    </div>

    <!-- timer_section -->
    <div class="nes-container is-dark timer-section-container">
        <div class="timer-container">
            <p id="timer"></p>
            <div>
                <i id="pomodoro_count">count:0</i>
                <i class="nes-icon is-small star is-empty"></i>
                <i class="nes-icon is-small star is-empty"></i>
                <i class="nes-icon is-small star is-empty"></i>
                <i class="nes-icon is-small star is-empty"></i>
            </div>
            <progress class="nes-progress is-primary" id="progress_bar" value="100" max="100"></progress>
            <div>
                <button class="nes-btn" id="start-pause">START!!!</button>
                <button class="nes-btn" id="reset">RESET</button>
            </div>
        </div>
        <div class="instructor-container">
            <div>
                <div class="nes-balloon from-left is-dark">
                    <p id="rapper_comment">What's up?</p>
                </div>
                <img class="rapper_image" src="{{ asset('images/rapper.png') }}" alt="rapper image">
            </div>
        </div>
    </div>

    <!-- music_section -->
    <div class="nes-container is-dark music-container with-title">
        <p class="title">Music</p>
{{--        <p>Choose your music.</p>--}}
        <p>coming soon..</p>

{{--        <div class="music-src-pomodoro-beats">--}}
{{--            <button class="nes-btn">Play from Pomodoro Beats</button>--}}
{{--        </div>--}}
{{--        <div class="music-src-spofity music-container">--}}
{{--            <button class="nes-btn">Play Spotify</button>--}}
{{--            <img class="rapper_image" src="{{ asset('images/Spotify_Icon_RGB_Green.png') }}" alt="spofity icon">--}}
{{--        </div>--}}
{{--        <div class="music-src-soundcloud">--}}
{{--            <button class="nes-btn">Play SoundCloud</button>--}}
{{--        </div>--}}
    </div>

    <!-- todo_section -->
    <div id="todo_section" class="nes-container is-dark music-container with-title" data-delete-image="{{ asset('images/batsu.png') }}" data-up-image="{{ asset('images/up_arrow.png') }}" data-down-image="{{ asset('images/down_arrow.png') }}">
        <p class="title">ToDo</p>
        <div class="input-container">
            <label for="textarea_field">write your task</label>
            <textarea id="textarea_field" class="nes-textarea"></textarea>
            <button id="add_task_button" class="nes-btn">Add Task</button>
        </div>

        <!-- task_review_container -->
        <div class="task_review_container">
            <div class="task_review_section">
                <div class="nes-container is-dark music-container with-title" id="todo_task">
                    <p class="title">ToDo</p>
{{--                    @foreach ($tasks as $task)--}}
{{--                        <div class="task-container">--}}
{{--                            @if (!$task->is_done)--}}
{{--                                <img src="{{ asset('images/up_arrow.png') }}" class="move-button">--}}
{{--                                <img src="{{ asset('images/down_arrow.png') }}" class="move-button">--}}
{{--                                <label class="task-label" data-task-id="{{ $task->id }}" data-is-done="{{ $task->is_done }}">--}}
{{--                                    <input type="checkbox" class="nes-checkbox is-dark">--}}
{{--                                    <span>{{$task->task}}</span>--}}
{{--                                </label>--}}
{{--                                <img src="{{ asset('images/batsu.png') }}" class="delete-button">--}}
{{--                            @endif--}}
{{--                        </div>--}}
{{--                    @endforeach--}}
                </div>
            </div>
            <div class="task_review_section">
                <div class="nes-container is-dark music-container with-title" id="done_task">
                    <p class="title">Done</p>
{{--                    @foreach ($tasks as $task)--}}
{{--                        <div class="task-container">--}}
{{--                            @if ($task->is_done)--}}
{{--                                <img src="{{ asset('images/up_arrow.png') }}" class="move-button">--}}
{{--                                <img src="{{ asset('images/down_arrow.png') }}" class="move-button">--}}
{{--                                <label class="task-label" data-task-id="{{ $task->id }}" data-is-done="{{ $task->is_done }}">--}}
{{--                                    <input type="checkbox" class="nes-checkbox is-dark">--}}
{{--                                    <span>{{$task->task}}</span>--}}
{{--                                </label>--}}
{{--                                <img src="{{ asset('images/batsu.png') }}" class="delete-button">--}}
{{--                            @endif--}}
{{--                        </div>--}}
{{--                    @endforeach--}}
                </div>
            </div>
            {{--        <div class="task_review_section">--}}
            {{--            <div class="nes-container is-dark music-container with-title" id="achive_task">--}}
            {{--                <p class="title">Archive</p>--}}
            {{--            </div>--}}
            {{--        </div>--}}
        </div>
    </div>
</body>
</html>
