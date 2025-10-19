import React, { useState } from 'react'
import trees from '../assets/neutrees.jpg'
import { Route, Link } from 'react-router-dom';

const HomePage: React.FC = () => {

    return (
    <div 
        className="min-h-screen w-screen bg-cover bg-no-repeat bg-center " 
        style={{ backgroundImage: `url(${trees})`}}>
            <section id="start" className="h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-8xl text-red-600 bg-white bg-cover rounded-2xl w-fit mx-auto font-bold font-mono">NEUGuessr</h1>
                </div>
            </section>
            <div>
                <Link to="/game">test_link</Link>
            </div>
            <section id="about" className="pb-20">
                <div className='bg-white rounded-2xl bg-cover p-8 shadow-lg'>
                    <h2 className=" text-4xl text-red-500 text-bold font-mono">How to Play</h2>
                </div>
            </section>
    </div>
    )

}

export default HomePage;