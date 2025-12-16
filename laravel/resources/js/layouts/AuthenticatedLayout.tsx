import ApplicationLogo from '@/components/ApplicationLogo';
import Dropdown from '@/components/Dropdown';
import NavLink from '@/components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';
import NotificationBell from "@/components/NotificationBell";


const NavigationLinks = ({ role }: { role: string }) => {
    const baseClasses = "w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200";
    const inactiveClasses = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
    const activeClasses = "bg-indigo-50 text-indigo-700 font-semibold shadow-sm ring-1 ring-indigo-200";

    return (
        <>
            {/* Dashboard */}
            <NavLink
                href={route('dashboard')}
                active={route().current('dashboard')}
                className={`${baseClasses} ${route().current('dashboard') ? activeClasses : inactiveClasses}`}
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-6v6a1 1 0 01-1 1h-3m-6 0h6" />
                </svg>
                <span>Dashboard</span>
            </NavLink>

            {/* Buyer Menu */}
            {role === 'buyer' && (
                <>
                    <NavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                        className={`${baseClasses} ${route().current('listings.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5" />
                        </svg>
                        <span>Listings</span>
                    </NavLink>

                    <NavLink
                        href={route('buyer.listings.favorites.index')}
                        active={route().current('buyer.listings.favorites.index')}
                        className={`${baseClasses} ${route().current('buyer.listings.favorites.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                        </svg>
                        <span>Favorite Listings</span>
                    </NavLink>

                    <NavLink
                        href={route('buyer.deals.index')}
                        active={route().current('buyer.deals.index')}
                        className={`${baseClasses} ${route().current('buyer.deals.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>My Deals</span>
                    </NavLink>

                    <NavLink
                        href={route('buyer.appointments.index')}
                        active={route().current('buyer.appointments.index')}
                        className={`${baseClasses} ${route().current('buyer.appointments.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Appointments</span>
                    </NavLink>
                </>
            )}

            {/* Seller Menu */}
            {role === 'seller' && (
                <>
                    <NavLink
                        href={route('listings.index')}
                        active={route().current('listings.index')}
                        className={`${baseClasses} ${route().current('listings.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-4m-6 0H5" />
                        </svg>
                        <span>My Listings</span>
                    </NavLink>

                    <NavLink
                        href={route('seller.deals.index')}
                        active={route().current('seller.deals.index')}
                        className={`${baseClasses} ${route().current('seller.deals.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>My Deals</span>
                    </NavLink>

                    <NavLink
                        href={route('seller.appointments.index')}
                        active={route().current('seller.appointments.index')}
                        className={`${baseClasses} ${route().current('seller.appointments.index') ? activeClasses : inactiveClasses}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>Appointments</span>
                    </NavLink>
                </>
            )}

            {/* Admin */}
            {role === 'admin' && (
                <NavLink
                    href={route('admin.dashboard')}
                    active={route().current('admin.dashboard')}
                    className={`${baseClasses} ${route().current('admin.dashboard') ? activeClasses : inactiveClasses}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Admin Dashboard</span>
                </NavLink>
            )}

            {/* Lawyer */}
            {role === 'lawyer' && (
                <NavLink
                    href={route('lawyer.deals.index')}
                    active={route().current('lawyer.deals.index')}
                    className={`${baseClasses} ${route().current('lawyer.deals.index') ? activeClasses : inactiveClasses}`}
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <span>My Deals</span>
                </NavLink>
            )}
        </>
    );
};

// Your existing dropdown (unchanged)
const UserProfileDropdown = ({ user }: { user: any }) => {
    return (
        <div className="relative ms-3">
            <Dropdown>
                <Dropdown.Trigger>
                    <span className="inline-flex rounded-md">
                        <button
                            type="button"
                            className="inline-flex items-center rounded-md border border-transparent bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <div className="flex items-center">
                                <div className="mr-3 h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="text-left leading-tight">{user.name}</div>
                                    <div className="text-xs text-gray-500">{user.role}</div>
                                </div>
                            </div>
                        </button>
                    </span>
                </Dropdown.Trigger>

                <Dropdown.Content width="48">
                    <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                    <Dropdown.Link href={route('logout')} method="post" as="button">
                        Log Out
                    </Dropdown.Link>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
};

export default function Authenticated({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
    const user = usePage().props.auth.user;
    const { role } = user;
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar - Desktop (permanent) */}
            <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
                <div className="flex items-center justify-center h-16 border-b border-gray-200 px-6">
                    <Link href={route('home')}>
                        <ApplicationLogo className="h-10 w-auto text-indigo-600" />
                    </Link>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    <NavigationLinks role={role} />
                </nav>


            </aside>

            {/* Mobile Sidebar Drawer */}
            <div className={`lg:hidden fixed inset-0 z-40 ${mobileMenuOpen ? 'block' : 'hidden'}`} onClick={() => setMobileMenuOpen(false)}>
                <div className="fixed inset-0 bg-black opacity-50" />
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <ApplicationLogo className="h-9 w-auto text-indigo-600" />
                        <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500 hover:text-gray-700">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <nav className="px-4 py-6 space-y-1">
                        <NavigationLinks role={role} />
                    </nav>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-64">
                {/* Top Bar */}
                <header className="bg-white shadow-sm border-b border-gray-200">
                    <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
                            >
                                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>

                            {/* Page Title */}
                            <h1 className="ml-4 text-xl font-semibold text-gray-900">
                                {header || 'Dashboard'}
                            </h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            <NotificationBell />
                            <UserProfileDropdown user={user} />
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 bg-gray-50">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="container mx-auto p-4">
                                {children}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
