import * as React from 'react';
import { Link } from 'react-router-dom';
import LocationCard from '../components/LocationCard.tsx';

const HomePage: React.FC = () => {
    return (
        <>
            <div className="container my-4">
                <h1 className="text-center mb-4">Explore Locations</h1>
                <div className="row">
                    <LocationCard
                    title="Luxury Beach Resort"
                    image="https://images.unsplash.com/photo-1556761175-4b46a572b786"
                    rating={4.5}
                    category="Resort"
                    link="page1"
                    />
                    <LocationCard
                    title="City Hotel"
                    image="https://static.tildacdn.com/tild3161-3135-4333-b737-333965646366/ovbmc-exterior-0019-.jpg"
                    rating={4}
                    category="Hotel"
                    link="page2"
                    />
                    <LocationCard
                    title="Mountain Retreat"
                    image="https://images.unsplash.com/photo-1566073771259-6a8506099945"
                    rating={3.5}
                    category="Retreat"
                    link="page3"
                    />
                </div>
            </div>
        </>
    )
}
 
export default HomePage;