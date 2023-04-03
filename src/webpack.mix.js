const mix = require('laravel-mix');

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/pomodoro.js', 'public/js')
    .postCss('resources/css/app.css', 'public/css', [
        //
    ]);

if (mix.inProduction()) {
    mix.version();
} else {
    mix.sourceMaps();
}

