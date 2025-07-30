import React from "react";

interface Props {
    data: any;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

export default function ListingDetails({ data, handleChange }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm space-y-6">
            {/* Property & Financial Info */}
            <div>
                <h3 className="text-xl font-semibold mb-4">🏠 Property & Financial Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        name="title"
                        value={data.title}
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Title"
                    />
                    <input
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Location"
                    />
                    <textarea
                        name="description"
                        value={data.description}
                        onChange={handleChange}
                        className="textarea textarea-bordered md:col-span-2"
                        rows={4}
                        placeholder="Description"
                    />
                    <select
                        name="property_type"
                        value={data.property_type}
                        onChange={handleChange}
                        className="select select-bordered"
                    >
                        <option value="">Select Type</option>
                        <option value="house">House</option>
                        <option value="condo">Condo</option>
                        <option value="townhouse">Townhouse</option>
                        <option value="land">Land</option>
                        <option value="multi-family">Multi-family</option>
                        <option value="farm">Farm</option>
                    </select>
                    <input
                        name="year_built"
                        value={data.year_built}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Year Built"
                    />
                    <input
                        name="bedrooms"
                        value={data.bedrooms}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Bedrooms"
                    />
                    <input
                        name="bathrooms"
                        value={data.bathrooms}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Bathrooms"
                    />
                    <input
                        name="square_feet"
                        value={data.square_feet}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Sq Ft"
                    />
                    <input
                        name="lot_size"
                        value={data.lot_size}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Lot Size"
                    />
                    <input
                        name="price"
                        value={data.price}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Price"
                    />
                    <input
                        name="hoa_fees"
                        value={data.hoa_fees}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="HOA Fees"
                    />
                    <input
                        name="property_taxes"
                        value={data.property_taxes}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Property Taxes"
                    />
                    <input
                        name="keywords"
                        value={data.keywords}
                        onChange={handleChange}
                        className="input input-bordered md:col-span-2"
                        placeholder="Keywords"
                    />
                </div>
            </div>

            {/* Features */}
            <div>
                <h3 className="text-xl font-semibold mb-4">🧱 Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="has_garage"
                            checked={data.has_garage}
                            onChange={handleChange}
                            className="checkbox"
                        />
                        Has Garage
                    </label>
                    <input
                        name="garage_spaces"
                        value={data.garage_spaces}
                        type="number"
                        onChange={handleChange}
                        className="input input-bordered"
                        placeholder="Garage Spaces"
                    />
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="has_basement"
                            checked={data.has_basement}
                            onChange={handleChange}
                            className="checkbox"
                        />
                        Has Basement
                    </label>
                </div>
            </div>
        </div>
    );
}
