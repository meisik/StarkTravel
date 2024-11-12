import React, { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard.tsx';
import { fetchGroupIdByLocation, fetchAverageRatingForGroup } from '../services/pinataService.ts';

const HomePage: React.FC = () => {
    const [isLoadingRating, setIsLoadingRating] = useState<{ [key: string]: boolean }>({});
    const [locationRatings, setLocationRatings] = useState<{ [key: string]: number | null }>({});
    const locations = [
        { title: "Luxury Beach Resort", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786", category: "Resort" },
        { title: "City Hotel", image: "https://static.tildacdn.com/tild3161-3135-4333-b737-333965646366/ovbmc-exterior-0019-.jpg", category: "Hotel" },
        { title: "Mountain Retreat", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945", category: "Retreat" },
    ];

    useEffect(() => {
        locations.forEach(async (location) => {
            setIsLoadingRating((prev) => ({ ...prev, [location.title]: true }));
            try {
                const groupId = await fetchGroupIdByLocation(location.title);
                if (groupId) {
                    const averageRating = await fetchAverageRatingForGroup(groupId);
                    setLocationRatings((prevRatings) => ({ ...prevRatings, [location.title]: averageRating }));
                }
            } catch (error) {
                console.error("Problem with reviews:", error);
            } finally {
                setIsLoadingRating((prev) => ({ ...prev, [location.title]: false }));
            }
        });
    }, []);

    return (
        <div className="container my-4">
          <h1 className="text-center mb-4">Explore Locations</h1>
          <div className="row">
            {locations.map((location, index) => (
                <LocationCard
                    key={index}
                    title={location.title}
                    image={location.image}
                    rating={locationRatings[location.title]}
                    category={location.category}
                    link={`/location/${location.title.replace(/ /g, '-')}/`}
                    originalTitle={location.title}
                    isLoading={isLoadingRating[location.title]}
                />
            ))}
          </div>
        </div>
    );
}

export default HomePage;
