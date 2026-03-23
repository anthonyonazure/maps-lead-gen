// Google Places API business types organized by category
// Source: https://developers.google.com/maps/documentation/places/web-service/place-types

export interface BusinessTypeOption {
  value: string;
  label: string;
  category: string;
}

const BUSINESS_TYPES: BusinessTypeOption[] = [
  // Health & Wellness
  { value: 'chiropractor', label: 'Chiropractor', category: 'Health & Wellness' },
  { value: 'dental_clinic', label: 'Dental Clinic', category: 'Health & Wellness' },
  { value: 'dentist', label: 'Dentist', category: 'Health & Wellness' },
  { value: 'doctor', label: 'Doctor', category: 'Health & Wellness' },
  { value: 'drugstore', label: 'Drugstore', category: 'Health & Wellness' },
  { value: 'general_hospital', label: 'Hospital', category: 'Health & Wellness' },
  { value: 'massage', label: 'Massage', category: 'Health & Wellness' },
  { value: 'massage_spa', label: 'Massage Spa', category: 'Health & Wellness' },
  { value: 'medical_center', label: 'Medical Center', category: 'Health & Wellness' },
  { value: 'medical_clinic', label: 'Medical Clinic', category: 'Health & Wellness' },
  { value: 'medical_lab', label: 'Medical Lab', category: 'Health & Wellness' },
  { value: 'pharmacy', label: 'Pharmacy', category: 'Health & Wellness' },
  { value: 'physiotherapist', label: 'Physiotherapist', category: 'Health & Wellness' },
  { value: 'sauna', label: 'Sauna', category: 'Health & Wellness' },
  { value: 'skin_care_clinic', label: 'Skin Care Clinic', category: 'Health & Wellness' },
  { value: 'spa', label: 'Spa', category: 'Health & Wellness' },
  { value: 'tanning_studio', label: 'Tanning Studio', category: 'Health & Wellness' },
  { value: 'wellness_center', label: 'Wellness Center', category: 'Health & Wellness' },
  { value: 'yoga_studio', label: 'Yoga Studio', category: 'Health & Wellness' },

  // Services
  { value: 'barber_shop', label: 'Barber Shop', category: 'Services' },
  { value: 'beauty_salon', label: 'Beauty Salon', category: 'Services' },
  { value: 'catering_service', label: 'Catering Service', category: 'Services' },
  { value: 'consultant', label: 'Consultant', category: 'Services' },
  { value: 'electrician', label: 'Electrician', category: 'Services' },
  { value: 'florist', label: 'Florist', category: 'Services' },
  { value: 'funeral_home', label: 'Funeral Home', category: 'Services' },
  { value: 'hair_salon', label: 'Hair Salon', category: 'Services' },
  { value: 'insurance_agency', label: 'Insurance Agency', category: 'Services' },
  { value: 'laundry', label: 'Laundry', category: 'Services' },
  { value: 'lawyer', label: 'Lawyer', category: 'Services' },
  { value: 'locksmith', label: 'Locksmith', category: 'Services' },
  { value: 'marketing_consultant', label: 'Marketing Consultant', category: 'Services' },
  { value: 'moving_company', label: 'Moving Company', category: 'Services' },
  { value: 'nail_salon', label: 'Nail Salon', category: 'Services' },
  { value: 'painter', label: 'Painter', category: 'Services' },
  { value: 'pet_care', label: 'Pet Care', category: 'Services' },
  { value: 'plumber', label: 'Plumber', category: 'Services' },
  { value: 'real_estate_agency', label: 'Real Estate Agency', category: 'Services' },
  { value: 'roofing_contractor', label: 'Roofing Contractor', category: 'Services' },
  { value: 'tailor', label: 'Tailor', category: 'Services' },
  { value: 'travel_agency', label: 'Travel Agency', category: 'Services' },
  { value: 'veterinary_care', label: 'Veterinary Care', category: 'Services' },

  // Automotive
  { value: 'car_dealer', label: 'Car Dealer', category: 'Automotive' },
  { value: 'car_rental', label: 'Car Rental', category: 'Automotive' },
  { value: 'car_repair', label: 'Car Repair / Mechanic', category: 'Automotive' },
  { value: 'car_wash', label: 'Car Wash', category: 'Automotive' },
  { value: 'gas_station', label: 'Gas Station', category: 'Automotive' },
  { value: 'tire_shop', label: 'Tire Shop', category: 'Automotive' },

  // Food & Drink
  { value: 'bakery', label: 'Bakery', category: 'Food & Drink' },
  { value: 'bar', label: 'Bar', category: 'Food & Drink' },
  { value: 'cafe', label: 'Cafe / Coffee Shop', category: 'Food & Drink' },
  { value: 'fast_food_restaurant', label: 'Fast Food', category: 'Food & Drink' },
  { value: 'pizza_restaurant', label: 'Pizza Restaurant', category: 'Food & Drink' },
  { value: 'restaurant', label: 'Restaurant', category: 'Food & Drink' },
  { value: 'ice_cream_shop', label: 'Ice Cream Shop', category: 'Food & Drink' },

  // Fitness & Sports
  { value: 'fitness_center', label: 'Fitness Center', category: 'Fitness & Sports' },
  { value: 'gym', label: 'Gym', category: 'Fitness & Sports' },
  { value: 'golf_course', label: 'Golf Course', category: 'Fitness & Sports' },
  { value: 'swimming_pool', label: 'Swimming Pool', category: 'Fitness & Sports' },
  { value: 'sports_club', label: 'Sports Club', category: 'Fitness & Sports' },

  // Shopping
  { value: 'clothing_store', label: 'Clothing Store', category: 'Shopping' },
  { value: 'convenience_store', label: 'Convenience Store', category: 'Shopping' },
  { value: 'department_store', label: 'Department Store', category: 'Shopping' },
  { value: 'electronics_store', label: 'Electronics Store', category: 'Shopping' },
  { value: 'furniture_store', label: 'Furniture Store', category: 'Shopping' },
  { value: 'grocery_store', label: 'Grocery Store', category: 'Shopping' },
  { value: 'hardware_store', label: 'Hardware Store', category: 'Shopping' },
  { value: 'home_improvement_store', label: 'Home Improvement Store', category: 'Shopping' },
  { value: 'jewelry_store', label: 'Jewelry Store', category: 'Shopping' },
  { value: 'pet_store', label: 'Pet Store', category: 'Shopping' },
  { value: 'shopping_mall', label: 'Shopping Mall', category: 'Shopping' },
  { value: 'sporting_goods_store', label: 'Sporting Goods Store', category: 'Shopping' },

  // Lodging
  { value: 'hotel', label: 'Hotel', category: 'Lodging' },
  { value: 'motel', label: 'Motel', category: 'Lodging' },
  { value: 'bed_and_breakfast', label: 'Bed & Breakfast', category: 'Lodging' },
  { value: 'campground', label: 'Campground', category: 'Lodging' },
  { value: 'rv_park', label: 'RV Park', category: 'Lodging' },

  // Finance
  { value: 'accounting', label: 'Accounting', category: 'Finance' },
  { value: 'bank', label: 'Bank', category: 'Finance' },

  // Education
  { value: 'preschool', label: 'Preschool', category: 'Education' },
  { value: 'school', label: 'School', category: 'Education' },
  { value: 'university', label: 'University', category: 'Education' },
  { value: 'library', label: 'Library', category: 'Education' },

  // Entertainment
  { value: 'amusement_park', label: 'Amusement Park', category: 'Entertainment' },
  { value: 'bowling_alley', label: 'Bowling Alley', category: 'Entertainment' },
  { value: 'movie_theater', label: 'Movie Theater', category: 'Entertainment' },
  { value: 'night_club', label: 'Night Club', category: 'Entertainment' },
  { value: 'zoo', label: 'Zoo', category: 'Entertainment' },

  // Places of Worship
  { value: 'church', label: 'Church', category: 'Places of Worship' },
  { value: 'mosque', label: 'Mosque', category: 'Places of Worship' },
  { value: 'synagogue', label: 'Synagogue', category: 'Places of Worship' },
];

export function searchBusinessTypes(query: string): BusinessTypeOption[] {
  if (!query.trim()) return BUSINESS_TYPES.slice(0, 10);
  const lower = query.toLowerCase();
  return BUSINESS_TYPES.filter(
    t => t.label.toLowerCase().includes(lower) || t.value.includes(lower) || t.category.toLowerCase().includes(lower)
  ).slice(0, 15);
}

export { BUSINESS_TYPES };
