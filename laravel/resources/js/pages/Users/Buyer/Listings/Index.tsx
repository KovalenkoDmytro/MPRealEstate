import { router } from "@inertiajs/react";
import {useCallback, useMemo, useState} from "react";
import AuthenticatedLayout from "@/layouts/AuthenticatedLayout/AuthenticatedLayout";
import type { PaginatedResponse, RealEstateListing } from "@/types";
import { FilterForm } from "@/components/listings/FilterForm";
import Listings from "@/components/listings/Listings";
import { listingService } from "@/services/listingService";
import { Collapse, IconButton, Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FilterListIcon from '@mui/icons-material/FilterList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import theme from "@/theme";

type Props = {
    listings: PaginatedResponse<RealEstateListing> & {
        total: number;
    };
    favoriteListings: number[];
    filters: Record<string, any>;
};

export default function Index({ listings, favoriteListings, filters }: Props) {
    const initialForm = {
        location: "",
        min_price: "",
        max_price: "",
        bedrooms: "",
        bathrooms: "",
        status: "",
        favorites_only: false,
        property_type: "",
        square_feet_min: "",
        square_feet_max: "",
        year_built_min: "",
        year_built_max: "",
        has_garage: false,
        has_basement: false,
        min_maintenance_fee: "",
        max_maintenance_fee: "",
        min_property_tax: "",
        max_property_tax: "",
        days_on_market: "",
        keywords: "",
    };

    // State to toggle filter visibility
    const [showFilters, setShowFilters] = useState(true);
    // State for view mode
    const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
    const [isFiltering, setIsFiltering] = useState(false);

    const [form, setForm] = useState({
        ...initialForm,
        location: filters.location || "",
        min_price: filters.min_price || "",
        max_price: filters.max_price || "",
        bedrooms: filters.bedrooms || "",
        bathrooms: filters.bathrooms || "",
        status: filters.status || "",
        favorites_only: filters.favorites_only === "true" || filters.favorites_only === true,
        property_type: filters.property_type || "",
        square_feet_min: filters.square_feet_min || "",
        square_feet_max: filters.square_feet_max || "",
        year_built_min: filters.year_built_min || "",
        year_built_max: filters.year_built_max || "",
        has_garage: filters.has_garage === "true" || filters.has_garage === true,
        has_basement: filters.has_basement === "true" || filters.has_basement === true,
        min_maintenance_fee: filters.min_maintenance_fee || "",
        max_maintenance_fee: filters.max_maintenance_fee || "",
        min_property_tax: filters.min_property_tax || "",
        max_property_tax: filters.max_property_tax || "",
        days_on_market: filters.days_on_market || "",
        keywords: filters.keywords || "",
    });

    const updateFilter = (key: string, value: string | number | boolean) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const hasActiveFilters = useMemo(
        () => Object.values(form).some((value) => value !== "" && value !== false && value !== null),
        [form]
    );

    const applyFilters = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (isFiltering) return;

        setIsFiltering(true);
        const query = listingService.applyFilters(form);

        router.get(route("listings.index"), query, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
            onError: () => setIsFiltering(false),
        });
    }, [form, isFiltering]);

    const resetFilters = useCallback(() => {
        if (isFiltering) return;

        setForm(initialForm);
        setIsFiltering(true);

        router.get(route("listings.index"), {}, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsFiltering(false),
            onError: () => setIsFiltering(false),
        });
    }, [isFiltering]);

    const handleToggleFilters = () => {
        setShowFilters(!showFilters);
    };

    const handleViewChange = (
        event: React.MouseEvent<HTMLElement>,
        newView: 'grid' | 'list' | 'map' | null,
    ) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    return (
        <AuthenticatedLayout
            header="My Listings"
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', md: 'center' },
                    flexDirection: { xs: 'column', md: 'row' },
                    mb: 3,
                    flexWrap: 'wrap',
                    gap: 2
                }}
            >
                <Typography
                    variant="h6"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: { xs: '1rem', sm: '1.25rem' },
                    }}
                >
                    {listings.total} Properties Found
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: { xs: 'stretch', sm: 'center' },
                        flexDirection: { xs: 'column', sm: 'row' },
                        justifyContent: 'space-between',
                        gap: { xs: 1.5, sm: 2 },
                        width: { xs: '100%', md: 'auto' },
                    }}
                >
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={handleViewChange}
                        aria-label="view mode"
                        size="small"
                        sx={{
                            height: 40,
                            bgcolor: 'background.paper',
                            width: { xs: '100%', sm: 'auto' },
                            justifyContent: { xs: 'space-between', sm: 'flex-start' },
                            '& .MuiToggleButton-root': {
                                border: '1px solid #e0e0e0',
                                color: 'text.secondary',
                                flex: { xs: 1, sm: 'initial' },
                                '&.Mui-selected': {
                                    bgcolor: 'primary.main',
                                    color: 'white',
                                    '&:hover': { bgcolor: 'primary.dark' }
                                }
                            }
                        }}
                    >
                        <ToggleButton value="grid" aria-label="grid view">
                            <ViewModuleIcon />
                        </ToggleButton>
                        <ToggleButton value="list" aria-label="list view">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="map" aria-label="map view">
                            <MapIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>

                    <Box
                        onClick={handleToggleFilters}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 0.5,
                            cursor: 'pointer',
                            color: 'primary.main',
                            '&:hover': { opacity: 0.8 },
                            userSelect: 'none',
                            width: { xs: '100%', sm: 'auto' },
                            minHeight: 40,
                            px: 1.5,
                            borderRadius: '999px',
                            border: `1px solid ${theme.palette.border.main}`,
                            backgroundColor: theme.palette.background.paper,
                        }}
                    >
                        <FilterListIcon sx={{ fontSize: 18 }} />
                        <Typography variant="button" sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Typography>
                        <IconButton size="small" color="primary" sx={{ ml: 0.25 }}>
                            {showFilters ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </Box>
                </Box>
            </Box>

            {/* Collapsible Filter Section */}
            <Collapse in={showFilters} timeout="auto" unmountOnExit>
                <Box sx={{
                    p: { xs: 2, md: theme.shape.padding },
                    background: `${theme.palette.background.white}`,
                    borderRadius: theme.shape.borderRadius,
                    mb: 3,
                    border: `1px solid ${theme.palette.border.main}`,
                }}>
                    <FilterForm
                        form={form}
                        updateFilter={updateFilter}
                        onApplyFilters={applyFilters}
                        onResetFilters={resetFilters}
                        isSubmitting={isFiltering}
                        canReset={hasActiveFilters}
                    />
                </Box>
            </Collapse>

            <Listings listings={listings}
                favoriteListings={favoriteListings}
                viewMode={viewMode}
                isLoading={isFiltering}
            />
        </AuthenticatedLayout>
    );
}
