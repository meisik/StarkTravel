import React, { useEffect, useState } from 'react';
import LocationCard from '../components/LocationCard.tsx';
import { fetchGroupIdByLocation, fetchAverageRatingForGroup } from '../services/pinataService.ts';

const HomePage: React.FC = () => {
    const [isLoadingRating, setIsLoadingRating] = useState<{ [key: string]: boolean }>({});
    const [locationRatings, setLocationRatings] = useState<{ [key: string]: number | null }>({});
    const locations = [
        { title: "Hotel Dolphin Grand", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/QmZY6vbz5gCp1rPcTPPZC1fBAV1BsPSek47FdivT7o4uAH", category: "Hotel" },
        { title: "Haveli Hauz Khas", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/QmVrSaUNCznT5ZpQkqZutAf26s1EkWfpCznV2AyKTDG3GG", category: "Hotel" },
        { title: "Grand Continent Anjuna a Sarovar Portico Hotel", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/Qmd2877yRpJBX2b7c4tUKHkpHEezUJ8WcCPL4avfApJNmV", category: "Hotel" },
        { title: "The Astor All Suites Hotel Candolim Goa", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/QmZq9CbKV32SgJF1d3onTDYiXBw4hPe7TNbKmpo5m4koAh", category: "Hotel" },
        { title: "The Oberoi New Delhi", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/QmejcMKxB78KPRCjK5xT7FjaXLHXMmMmA2L9RVLy4PjbnS", category: "Hotel" },
        { title: "Chandys Windy Woods", image: "https://peach-convincing-gerbil-650.mypinata.cloud/ipfs/QmQmLiwfCentU67LU6Dp9N5MhFBAz6wFTCTQW2zYWvwjaS", category: "Hotel" },
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

    useEffect(() => {
        document.title = "StarkTravel - Explore Locations";
      });

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
