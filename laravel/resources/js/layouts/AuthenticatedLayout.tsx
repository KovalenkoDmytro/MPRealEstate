import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState, Fragment } from 'react';
import { Transition } from '@headlessui/react';

// Navigation links based on user role
const NavigationLinks = ({ role }: { role: string }) => {
    return (
        <>
            <NavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
            >
                Dashboard
            </NavLink>

            {role === 'buyer' && (
                <>
                    <NavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                    >
                        Listings
                    </NavLink>
                    <NavLink
                        href={route('buyer.deals.index')}
                        active={route().current('buyer.deals.index')}
                    >
                        My Deals
                    </NavLink>
                </>
            )}

            {role === 'seller' && (
                <>
                    <NavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                    >
                        My Listings
                    </NavLink>
                    <NavLink
                        href={route('seller.deals.index')}
                        active={route().current('seller.deals.index')}
                    >
                        My Deals
                    </NavLink>
                </>
            )}

            {role === 'admin' && (
                <NavLink
                    href={route('admin.dashboard')}
                    active={route().current('admin.dashboard')}
                >
                    Admin Dashboard
                </NavLink>
            )}
        </>
    );
};

// Responsive navigation links for mobile view
const MobileNavigationLinks = ({ role }: { role: string }) => {
    return (
        <>
            <ResponsiveNavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
            >
                Dashboard
            </ResponsiveNavLink>

            {role === 'buyer' && (
                <>
                    <ResponsiveNavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                    >
                        Listings
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('buyer.deals.index')}
                        active={route().current('buyer.deals.index')}
                    >
                        My Deals
                    </ResponsiveNavLink>
                </>
            )}

            {role === 'seller' && (
                <>
                    <ResponsiveNavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                    >
                        My Listings
                    </ResponsiveNavLink>
                    <ResponsiveNavLink
                        href={route('deals.index')}
                        active={route().current('deals.index')}
                    >
                        My Deals
                    </ResponsiveNavLink>
                </>
            )}

            {role === 'admin' && (
                <ResponsiveNavLink
                    href={route('admin.dashboard')}
                    active={route().current('admin.dashboard')}
                >
                    Admin Dashboard
                </ResponsiveNavLink>
            )}
        </>
    );
};

// User profile dropdown component
const UserProfileDropdown = ({ user }: { user: any }) => {
    return (
        <div className="relative ms-3">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm transition duration-150 ease-in-out hover:bg-gray-50 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            <div className="flex items-center">
                                <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-800">
                                    {user.name.charAt(0).toUpperCase()}
                                </span>
                                <span>{user.name}</span>
                                <span className="ml-1 inline-block rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
                                    {user.role}
                                </span>
                            </div>
                            <svg
                                className="-me-0.5 ms-2 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content width="48" contentClasses="py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                    <Dropdown.Link href={route('profile.edit')}>
                        Profile
                    </Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                        Log Out
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

// Mobile menu button component
const MobileMenuButton = ({ showingNavigationDropdown, setShowingNavigationDropdown }: {
    showingNavigationDropdown: boolean,
    setShowingNavigationDropdown: (value: boolean) => void
}) => {
    return (
        <button
            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-700 focus:bg-gray-100 focus:text-gray-700 focus:outline-none"
        >
            <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                    className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                />
                <path
                    className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>
    );
};

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { role } = user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        {/* Logo and Desktop Navigation */}
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href={route('home')}>
                                    <ApplicationLogo className="block h-10 w-auto fill-current text-indigo-600 transition-transform duration-200 hover:scale-105" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavigationLinks role={role} />
                            </div>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <UserProfileDropdown user={user} />
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <MobileMenuButton
                                showingNavigationDropdown={showingNavigationDropdown}
                                setShowingNavigationDropdown={setShowingNavigationDropdown}
                            />
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                <Transition
                    show={showingNavigationDropdown}
                    enter="transition duration-200 ease-out"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition duration-100 ease-in"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <div className="sm:hidden">
                        <div className="space-y-1 pb-3 pt-2">
                            <MobileNavigationLinks role={role} />
                        </div>

                        <div className="border-t border-gray-200 pb-3 pt-4">
                            <div className="flex items-center px-4">
                                <div className="flex-shrink-0">
                                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                                        <span className="text-sm font-medium text-indigo-800">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <div className="text-base font-medium text-gray-800">{user.name}</div>
                                    <div className="text-sm font-medium text-gray-500">{user.email}</div>
                                </div>
                            </div>

                            <div className="mt-3 space-y-1">
                                <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                                <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                    Log Out
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </Transition>
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            {/* Main Content */}
            <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
