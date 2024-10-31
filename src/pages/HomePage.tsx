import React, { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard.tsx';
import { fetchGroupIdByLocation, fetchAverageRatingForGroup } from '../services/pinataService.ts';

const HomePage: React.FC = () => {
    const [isLoadingRating, setIsLoadingRating] = useState<{ [key: string]: boolean }>({});
    const [locationRatings, setLocationRatings] = useState<{ [key: string]: number | null }>({});
    const locations = [
        { title: "Luxury Beach Resort", image: "https://images.unsplash.com/photo-1556761175-4b46a572b786", category: "Resort", link: "page1" },
        { title: "City Hotel", image: "https://static.tildacdn.com/tild3161-3135-4333-b737-333965646366/ovbmc-exterior-0019-.jpg", category: "Hotel", link: "page2" },
        { title: "Mountain Retreat", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945", category: "Retreat", link: "page3" },
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
                link={location.link}
                isLoading={isLoadingRating[location.title]}
              />
            ))}
          </div>
        </div>
    );
}

export default HomePage;
