const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/timer.js', 'public/js')
    .js('resources/js/todo.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ])
    // Add this line to include resources/pomodoro.css in the build
    .postCss('resources/css/pomodoro.css', 'public/css', [
        //
    ]);

if (mix.inProduction()) {
    mix.version();
} else {
    mix.sourceMaps();
}
