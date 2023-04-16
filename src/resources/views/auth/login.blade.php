<x-guest-layout>
    <x-auth-card>
{{--        <x-slot name="logo">--}}
{{--            <a href="/" class="nes-logo">--}}
{{--            </a>--}}
{{--        </x-slot>--}}

        <!-- Session Status -->
        <x-auth-session-status class="mb-4 nes-text is-primary" :status="session('status')" />

        <!-- Validation Errors -->
        <x-auth-validation-errors class="mb-4 nes-text is-error" :errors="$errors" />

        <form method="POST" action="{{ route('login') }}" class="nes-container is-dark with-title is-centered">
            <p class="title">{{ __('Log in') }}</p>
            @csrf

            <!-- Email Address -->
            <div class="nes-field">
                <x-label for="email" style="color:#fff;" :value="__('Email')" />
                <x-input id="email" class="nes-input is-dark" type="email" name="email" :value="old('email')" required autofocus />
            </div>

            <!-- Password -->
            <div class="nes-field">
                <x-label for="password" style="color:#fff;" :value="__('Password')" />

                <x-input id="password" class="nes-input is-dark"
                         type="password"
                         name="password"
                         required autocomplete="current-password" />
            </div>

            <!-- Remember Me -->
{{--            <div class="nes-field">--}}
{{--                <label for="remember_me" style="color:#fff;" class="inline-flex items-center">--}}
{{--                    <input id="remember_me" type="checkbox" class="nes-checkbox" name="remember">--}}
{{--                    <span class="ml-2 text-sm text-gray-600">{{ __('Remember me') }}</span>--}}
{{--                </label>--}}
{{--            </div>--}}
            <div style="background-color:#212529; padding: 1rem 0;">
                <label>
                    <input id="remember_me" type="checkbox" name="remember" class="nes-checkbox is-dark"/>
                    <span>{{ __('Remember me') }}</span>
                </label>
            </div>

            <div">
                @if (Route::has('password.request'))
                    <a href="{{ route('password.request') }}">
                        {{ __('Forgot your password?') }}
                    </a>
                @endif

                <x-button class="nes-btn is-primary">
                    {{ __('Log in') }}
                </x-button>
            </div>
        </form>
    </x-auth-card>
</x-guest-layout>
