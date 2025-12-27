import { useState } from 'react';
import MealPlans from '../MealPlans/MealPlans';

const Meals = () => {
  const [selectedMealType, setSelectedMealType] = useState<string | null>(null);

  const mealCards = [
    {
      id: 1,
      title: "Breakfast",
      image: "/lb-2.jpg",
      description: "Start your day with delicious morning meals",
      time: "6:00 AM - 11:00 AM"
    },
    {
      id: 2,
      title: "Lunch",
      image: "/lb-1.jpg",
      description: "Wholesome lunch options to fuel your afternoon",
      time: "12:00 PM - 3:00 PM"
    },
    {
      id: 3,
      title: "Dinner",
      image: "/lb-3.jpg",
      description: "End your day with satisfying dinner choices",
      time: "6:00 PM - 11:00 PM"
    }
  ];

  const handleCheckNow = (mealType: string) => {
    setSelectedMealType(mealType);
  };

  return (
    <>
      <section className="py-16 md:py-24 bg-neutral-snow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-charcoal mb-4">
              Order Your <span className="text-primary">Favorite Deck of Meal</span>
            </h2>
            <p className="text-lg text-neutral-dark max-w-2xl mx-auto">
              Choose from our wide variety of breakfast, lunch, and dinner options
            </p>
          </div>

          {/* Meal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mealCards.map((meal) => (
              <div
                key={meal.id}
                className="group relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-[600px]"
              >
                {/* Image - Full Background */}
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Time Badge */}
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full z-10">
                  <p className="text-xs font-semibold text-neutral-charcoal">{meal.time}</p>
                </div>

                {/* Content - Overlaid on Image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-3xl font-bold text-white mb-2">
                    {meal.title}
                  </h3>
                  <p className="text-white/90 mb-4">
                    {meal.description}
                  </p>
                  <button 
                    onClick={() => handleCheckNow(meal.title)}
                    className="w-full py-3 bg-primary text-white rounded-full font-semibold hover:bg-orange-deep transition-all hover:scale-105 shadow-md"
                  >
                    check Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meal Plans Modal */}
      {selectedMealType && (
        <MealPlans 
          selectedMealType={selectedMealType}
          onClose={() => setSelectedMealType(null)}
        />
      )}
    </>
  );
};

export default Meals;
