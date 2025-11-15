import React from 'react'
import trees from '../assets/neutrees.jpg'
import { Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Home.css';

const HomePage: React.FC = () => {

    return (
    <div 
        className="h-screen w-full overflow-hidden bg-no-repeat bg-cover bg-center"
        style={{ backgroundImage: `url(${trees})` }}>
            <div className="h-full w-full overflow-auto">
                <section id="start" className="h-screen flex flex-col items-center justify-center">
                    <div className="text-center py-1.5">
                        <h1 className="text-8xl text-red-600 bg-white bg-cover rounded-2xl w-fit mx-auto font-bold font-mono py-4 px-2">NEUGuessr</h1>
                    </div>
                    <div>
                        <Link to="/game" className="bg-red-500 text-white bg-cover py-2 px-3 rounded-2xl flex items-center font-bold font-mono">
                            <Play className="w-10 h-10 fill-current"></Play>
                            Play
                        </Link>
                    </div>
                </section>
                <section id="about" className="pb-20">
                    <div className='max-w-4xl bg-white rounded-2xl p-8 shadow-lg mx-auto'>
                        <h2 className="text-7xl text-red-500 font-mono mb-2">How to Play</h2>
                        <ol className="text-black font-mono "> 
                            <li>1. Press the Play button above to be dropped into a random location on Northeastern's campus</li>
                            <li>2. Observe your surroundings using the viewer</li>
                            <li>3. Open the map and place a marker on your best guess of your location</li>
                            <li>4. View your results!</li>
                        </ol>
                    </div>
                </section>
            </div>
    </div>
    )

}

export default HomePage;