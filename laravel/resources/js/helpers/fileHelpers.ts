import type { Deal, User } from "@/types";

export function filterFilesForUser(
    allFiles: Deal['files'],
    currentUser: User,
    allUsers: User[]
) {
    if (!allFiles) return [];

    return allFiles.filter(file => {
        const author = allUsers.find(u => u.email === file.author_email);

        // Buyer: exclude files from seller lawyers
        if (currentUser.role === 'buyer') {
            return !(author?.role === 'lawyer' && author?.is_seller_lawyer);
        }

        // Seller: exclude files from buyer lawyers
        if (currentUser.role === 'seller') {
            return !(author?.role === 'lawyer' && author?.is_buyer_lawyer);
        }

        // Buyer lawyer: exclude files from seller lawyers
        if (currentUser.role === 'lawyer' && currentUser.is_buyer_lawyer) {
            return !(author?.role === 'lawyer' && author?.is_seller_lawyer);
        }

        // Seller lawyer: exclude files from buyer lawyers
        if (currentUser.role === 'lawyer' && currentUser.is_seller_lawyer) {
            return !(author?.role === 'lawyer' && author?.is_buyer_lawyer);
        }

        return true;
    });
}
