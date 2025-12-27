import { useState } from 'react';
import { useCart } from '../../context/CartContext';

interface Supplier {
  id: number;
  name: string;
  rating: number;
  image: string;
  description: string;
}

interface DayMeal {
  day: string;
  meal: string;
  image: string;
}

interface MealPlansProps {
  selectedMealType: string;
  onClose: () => void;
}

const MealPlans = ({ selectedMealType, onClose }: MealPlansProps) => {
  const [selectedSupplier, setSelectedSupplier] = useState<number | null>(null);
  const [planModalSupplier, setPlanModalSupplier] = useState<Supplier | null>(null);
  const [selectedPlanDays, setSelectedPlanDays] = useState<number | null>(null);
  const { addToCart, getSupplierInCart } = useCart();

  const suppliers: Supplier[] = [
    {
      id: 1,
      name: "Healthy Bites Co.",
      rating: 4.8,
      image: "/lb-1.jpg",
      description: "Fresh and organic meal plans"
    },
    {
      id: 2,
      name: "Tasty Meals Hub",
      rating: 4.6,
      image: "/lb-2.jpg",
      description: "Delicious home-style cooking"
    },
    {
      id: 3,
      name: "Nutrition Express",
      rating: 4.9,
      image: "/lb-3.jpg",
      description: "Balanced nutritional meals"
    },
    {
      id: 4,
      name: "Quick Eats Kitchen",
      rating: 4.5,
      image: "/lb-1.jpg",
      description: "Fast and fresh delivery"
    },
    {
      id: 5,
      name: "Gourmet Delight",
      rating: 4.7,
      image: "/lb-2.jpg",
      description: "Premium quality ingredients"
    }
  ];

  const weekMeals: DayMeal[] = [
    { day: "Monday", meal: "Pancakes with Fresh Fruits", image: "/lb-2.jpg" },
    { day: "Tuesday", meal: "Veggie Omelette & Toast", image: "/lb-2.jpg" },
    { day: "Wednesday", meal: "Traditional Thali", image: "/lb-1.jpg" },
    { day: "Thursday", meal: "Sandwich & Salad", image: "/lb-2.jpg" },
    { day: "Friday", meal: "Rice Bowl with Curry", image: "/lb-1.jpg" },
    { day: "Saturday", meal: "Continental Breakfast", image: "/lb-2.jpg" },
    { day: "Sunday", meal: "Special Sunday Brunch", image: "/lb-3.jpg" }
  ];

  const handleClose = () => {
    onClose();
    setSelectedSupplier(null);
  };

  const handleAddToCart = (supplier: Supplier, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent triggering handleSupplierClick
    // Open plan chooser modal instead of directly adding
    setPlanModalSupplier(supplier);
    setSelectedPlanDays(null); // do not preselect — require explicit choice
  };

  const confirmAddWithPlan = (days: number) => {
    if (!planModalSupplier) return;
    const supplier = planModalSupplier;
    const success = addToCart({
      supplierId: supplier.id,
      supplierName: supplier.name,
      mealType: selectedMealType,
      rating: supplier.rating,
      image: supplier.image,
      planDays: days
    });

    if (success) {
      // close modal and parent modal; no alert popup
      handleClose();
    }
    setPlanModalSupplier(null);
  };

  const handleSupplierClick = (supplierId: number) => {
    setSelectedSupplier(supplierId);
  };

  const handleBackToSuppliers = () => {
    setSelectedSupplier(null);
  };

  // Plan chooser modal: render on top if set
  if (planModalSupplier) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[70] flex items-center justify-center">
        <div className="bg-white rounded-2xl p-6 w-96 shadow-lg">
          <h3 className="text-xl font-semibold mb-3">Choose plan duration</h3>
          <p className="text-sm text-neutral-dark mb-4">How many days would you like to subscribe for {selectedMealType}?</p>
          <div className="flex gap-2 mb-4">
            {[2,15,30,60].map((d) => (
              <button key={d} onClick={() => confirmAddWithPlan(d)} className={`flex-1 py-2 rounded-lg font-semibold ${selectedPlanDays===d ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                {d === 2 ? `Demo (${d} days)` : `${d} days`}
              </button>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button onClick={() => setPlanModalSupplier(null)} className="px-4 py-2 rounded">Cancel</button>
          </div>
        </div>
      </div>
    )
  }

  // Show 7-day meal plan
  if (selectedSupplier !== null) {
    const supplier = suppliers.find(s => s.id === selectedSupplier);
    
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] overflow-y-auto">
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto bg-neutral-snow rounded-3xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <button 
                  onClick={handleBackToSuppliers}
                  className="text-primary hover:text-orange-deep mb-2 flex items-center gap-2"
                >
                  ← Back to Suppliers
                </button>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-charcoal">
                  {supplier?.name} - {selectedMealType} Plan
                </h2>
                <p className="text-neutral-dark mt-2">7-Day Meal Plan</p>
              </div>
              <button 
                onClick={handleClose}
                className="text-4xl text-neutral-charcoal hover:text-primary"
              >
                ×
              </button>
            </div>

            {/* 7-Day Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {weekMeals.map((dayMeal, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="relative h-48">
                    <img 
                      src={dayMeal.image} 
                      alt={dayMeal.meal}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {dayMeal.day}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-neutral-charcoal mb-2">
                      {dayMeal.meal}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show suppliers list
  if (selectedMealType) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] overflow-y-auto">
        <div className="min-h-screen py-8 px-4">
          <div className="max-w-7xl mx-auto bg-neutral-snow rounded-3xl p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-charcoal">
                  Choose Your <span className="text-primary">{selectedMealType}</span> Supplier
                </h2>
                <p className="text-neutral-dark mt-2">Select from our trusted partners</p>
              </div>
              <button 
                onClick={handleClose}
                className="text-4xl text-neutral-charcoal hover:text-primary"
              >
                ×
              </button>
            </div>

            {/* Supplier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suppliers.map((supplier) => (
                <div 
                  key={supplier.id}
                  onClick={() => handleSupplierClick(supplier.id)}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2"
                >
                  <div className="relative h-48">
                    <img 
                      src={supplier.image} 
                      alt={supplier.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">⭐ {supplier.rating}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-neutral-charcoal mb-2">
                      {supplier.name}
                    </h3>
                    <p className="text-neutral-dark text-sm mb-4">
                      {supplier.description}
                    </p>
                    <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSupplierClick(supplier.id);
                              }}
                              className="flex-1 py-2 bg-neutral-medium text-white rounded-full font-semibold hover:bg-neutral-dark transition-all"
                            >
                              View Plan
                            </button>
                            <button 
                              onClick={(e) => handleAddToCart(supplier, e)}
                              className={`flex-1 py-2 rounded-full font-semibold transition-all ${
                                getSupplierInCart(selectedMealType) === supplier.id
                                  ? 'bg-green-500 text-white cursor-not-allowed'
                                  : 'bg-primary text-white hover:bg-orange-deep'
                              }`}
                              disabled={getSupplierInCart(selectedMealType) === supplier.id}
                            >
                              {getSupplierInCart(selectedMealType) === supplier.id ? '✓ In Cart' : 'Add to Cart'}
                            </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

        

  return null;
};

export default MealPlans;
