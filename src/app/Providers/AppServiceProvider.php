<?php

namespace App\Providers;

use Faker\Factory;
use Illuminate\Support\ServiceProvider;
use Faker\Provider\ja_JP\Person;
use Faker\Generator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $faker = Factory::create('ja_JP');
        $faker->addProvider(new Person($faker));

        $this->app->singleton(Generator::class, function () use ($faker) {
            return $faker;
        });
    }
}
