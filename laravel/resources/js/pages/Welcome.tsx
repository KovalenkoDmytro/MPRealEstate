import { Head, Link } from '@inertiajs/react';
import { PageProps } from '@/types/pageProps';

export default function Welcome({ auth }: PageProps) {
    return (
        <>
            <Head title="Welcome" />

            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center items-center px-6">

                {/* Top Nav */}
                <header className="w-full max-w-6xl py-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        MyApp
                    </h1>

                    <nav className="flex gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="text-center mt-10">
                    <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
                        Welcome to MyApp
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-8">
                        A clean starting point for your Laravel + React + Inertia application.
                        Fast, modern, and easy to customize.
                    </p>

                    {!auth.user && (
                        <Link
                            href={route('register')}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg text-lg shadow hover:bg-red-700 transition"
                        >
                            Create an Account
                        </Link>
                    )}
                </main>

                {/* Footer */}
                <footer className="mt-20 text-gray-600 dark:text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} MyApp — All rights reserved.
                </footer>
            </div>
        </>
    );
}
