// src/components/shared/Hero.tsx
import React from 'react';
import heroImage from '../../assets/hero.jpg';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const Hero: React.FC = () => {
  const features = [
    {
      title: "Communication with AI:",
      description: "It is help for communication with AI"
    },
    {
      title: "Swift Turnaround:",
      description: "Timely delivery to meet your global communication needs."
    },
    {
      title: "Chat with AI:",
      description: "Real-time chat with AI to help you with your communication needs."
    }
  ];

  return (
    <div>
      <Navbar />
      <div className="h-screen sm:mt-10 md:mt-0 bg-purple-700/60 backdrop-blur-lg pt-6 overflow-y-auto lg:overflow-y-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-2 sm:mt-10 md:">
              {/* Main Heading */}
              <div className="space-y-4">
                <h1 className="text-2xl md:text-5xl font-bold text-white leading-tight">
                  Education and Communication with{' '}
                  <span className="text-white">Aloha!</span>
                </h1>
                <h2 className="text-2xl md:text-3xl text-white/90">
                  Your Bridge to Seamless Multilingual Experiences
                </h2>
              </div>

              {/* Features */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 space-y-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="space-y-1">
                      <h3 className="text-white font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-white/80">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <Link to="/chat"> <Button className="bg-teal-400 text-purple-900 hover:bg-teal-300 text-lg font-semibold px-6 py-3 h-auto rounded-full">
                Get Started
              </Button></Link>
            </div>

            {/* Right Content - Illustration */}
            <div className="relative mt-10">
              <div className="relative w-full aspect-square">
                <img className='h-[90%] w-full object-cover rounded-3xl' src={heroImage} alt="Hero Illustration" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;