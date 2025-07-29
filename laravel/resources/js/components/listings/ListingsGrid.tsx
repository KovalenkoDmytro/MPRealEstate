import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Pagination,
} from '@mui/material';
import { Link } from '@inertiajs/react'; // Update to your framework's routing mechanism if needed.
import { RealEstateListing } from '@/types'; // Adjust the import path to fit your project structure.

type ListingsGridProps = {
  listings: {
    data: RealEstateListing[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number ;
  };
  isFavorited: (listingId: number) => boolean;
  toggleFavorite: (
    e: React.FormEvent,
    listingId: number,
    isCurrentlyFavorited: boolean
  ) => void;
};

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  isFavorited,
  toggleFavorite,
}) => {
  return (
    <Box>
      {/* Listings Grid */}
      {listings.data.length > 0 ? (
        <Grid container spacing={3}>
          {listings.data.map((listing) => (
            <Grid key={listing.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <ListingCard
                listing={listing}
                isFavorited={isFavorited}
                toggleFavorite={toggleFavorite}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            No listings found.
          </Typography>
        </Box>
      )}

      {/* Pagination */}
      {listings.last_page > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={listings.last_page}
            page={listings.current_page}
            onChange={(event, page) => {
              const link = listings.links.find(
                (link) => link.label === page.toString()
              );
              if (link && link.url) {
                window.location.href = link.url;
              }
            }}
            color="primary"
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
          />
        </Box>
      )}
    </Box>
  );
};

type ListingCardProps = {
  listing: RealEstateListing;
  isFavorited: (listingId: number) => boolean;
  toggleFavorite: (
    e: React.FormEvent,
    listingId: number,
    isCurrentlyFavorited: boolean
  ) => void;
};

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  isFavorited,
  toggleFavorite,
}) => {
  const favorited = isFavorited(listing.id);

  return (
    <Card elevation={3} sx={{ borderRadius: 2 }}>
      {/* RealEstateListing Image */}
      {listing.main_image ? (
        <CardMedia
          component="img"
          height="180"
          image={listing.main_image.image_path}
          alt={listing.title}
        />
      ) : (
        <Box
          sx={{
            height: 180,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'grey.300',
          }}
        >
          ❌ No Image Available
        </Box>
      )}

      {/* RealEstateListing Info */}
      <CardContent>
        {/* Title */}
        <Typography variant="h6" component="h2" fontWeight="bold" noWrap>
          {listing.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          📍 {listing.location}
        </Typography>
        <Typography color="primary" fontWeight="bold" sx={{ mt: 1 }}>
          💰 ${listing.price.toLocaleString()}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          👤 Seller: {listing.seller?.name || 'N/A'}
        </Typography>

        {/* Additional Details */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            🛏️ Bedrooms: {listing.bedrooms}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            🛁 Bathrooms: {listing.bathrooms}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📐 Size: {listing.square_feet.toLocaleString()} sqft
          </Typography>
          {listing.lot_size && (
            <Typography variant="body2" color="text.secondary">
              🏡 Lot Size: {listing.lot_size.toLocaleString()} sqft
            </Typography>
          )}
          {listing.year_built && (
            <Typography variant="body2" color="text.secondary">
              🏗️ Year Built: {listing.year_built}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            🏷️ Status: {listing.status}
          </Typography>
          {listing.hoa_fees && (
            <Typography variant="body2" color="text.secondary">
              💸 HOA Fees: ${listing.hoa_fees.toLocaleString()}
            </Typography>
          )}
          {listing.property_taxes && (
            <Typography variant="body2" color="text.secondary">
              📊 Property Taxes: ${listing.property_taxes.toLocaleString()}
            </Typography>
          )}
        </Box>

        {/* Favorite & View Details */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mt: 2,
          }}
        >
          <form
            onSubmit={(e) => toggleFavorite(e, listing.id, favorited)}
          >
            <Button
              type="submit"
              variant="text"
              sx={{ fontSize: 24, color: favorited ? 'red' : 'grey.500' }}
            >
              {favorited ? '💔' : '❤️'}
            </Button>
          </form>
          <Link
            href={`/buyer/listings/${listing.id}`}
            style={{ textDecoration: 'none' }}
          >
            <Button variant="contained" size="small" color="primary">
              🔍 View Details
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};
