'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Search, MapPin, Star, Users, ChefHat, Coffee, Utensils, Spice } from 'lucide-react';

const foodCategories = [
  { id: 1, name: 'Achar', icon: '🥒', count: '12 items' },
  { id: 2, name: 'Tea', icon: '🍵', count: '8 items' },
  { id: 3, name: 'Typical Nepali', icon: '🍛', count: '15 items' },
  { id: 4, name: 'Spices', icon: '🌶️', count: '20 items' },
  { id: 5, name: 'Snacks', icon: '🍿', count: '10 items' },
  { id: 6, name: 'Beverages', icon: '🥤', count: '6 items' },
];

const featuredFoods = [
  {
    id: 1,
    name: 'Traditional Achar Mix',
    image: '/api/placeholder/300/200',
    price: 'NPR 450',
    rating: 4.8,
    category: 'Achar'
  },
  {
    id: 2,
    name: 'Premium Tea Collection',
    image: '/api/placeholder/300/200',
    price: 'NPR 320',
    rating: 4.9,
    category: 'Tea'
  },
  {
    id: 3,
    name: 'Nepali Thali Special',
    image: '/api/placeholder/300/200',
    price: 'NPR 650',
    rating: 4.7,
    category: 'Typical Nepali'
  },
  {
    id: 4,
    name: 'Spice Blend Pack',
    image: '/api/placeholder/300/200',
    price: 'NPR 280',
    rating: 4.6,
    category: 'Spices'
  }
];

export default function FoodsPage() {
  const [selectedCategory, setSelectedCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Back to Home</span>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">Gharsamma Foods</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">Kathmandu, Nepal</span>
            </div>
            
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for 'Food'"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Left Sidebar - Categories */}
        <div className="w-80 bg-gray-50 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">What are you looking for?</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-8">
            {foodCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-purple-100 border-2 border-purple-500'
                    : 'bg-white border border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="text-sm font-medium text-gray-900">{category.name}</div>
                <div className="text-xs text-gray-500">{category.count}</div>
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">4.8 Service Rating*</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600">12M+ Customers Globally*</span>
            </div>
          </div>
        </div>

        {/* Right Section - Featured Foods */}
        <div className="flex-1 p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Food services at your doorstep</h1>
            <p className="text-gray-600">Discover authentic Nepali flavors and premium food products</p>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {featuredFoods.map((food, index) => (
              <div key={food.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-48">
                  <Image
                    src={food.image}
                    alt={food.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white rounded-full px-2 py-1 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-medium">{food.rating}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-xs text-purple-600 font-medium mb-1">{food.category}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{food.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">{food.price}</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Food Items */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">More Food Items</h3>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="bg-white rounded-lg border border-gray-200 p-4 text-center hover:shadow-md transition-shadow duration-200">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <ChefHat className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">Food Item {item}</h4>
                  <p className="text-sm text-gray-500">NPR 250</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
