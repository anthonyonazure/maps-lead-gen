// Complete Google Places API business types
// Source: https://developers.google.com/maps/documentation/places/web-service/place-types

export interface BusinessTypeOption {
  value: string;
  label: string;
  category: string;
}

function t(value: string, category: string, label?: string): BusinessTypeOption {
  return { value, label: label || value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), category };
}

const BUSINESS_TYPES: BusinessTypeOption[] = [
  // Automotive
  t('car_dealer', 'Automotive'), t('car_rental', 'Automotive'), t('car_repair', 'Automotive', 'Car Repair / Mechanic'),
  t('car_wash', 'Automotive'), t('ebike_charging_station', 'Automotive', 'E-Bike Charging'), t('electric_vehicle_charging_station', 'Automotive', 'EV Charging'),
  t('gas_station', 'Automotive'), t('parking', 'Automotive'), t('parking_garage', 'Automotive'), t('parking_lot', 'Automotive'),
  t('rest_stop', 'Automotive'), t('tire_shop', 'Automotive'), t('truck_dealer', 'Automotive'),

  // Business
  t('business_center', 'Business'), t('corporate_office', 'Business'), t('coworking_space', 'Business'),
  t('farm', 'Business'), t('manufacturer', 'Business'), t('ranch', 'Business'), t('supplier', 'Business'),

  // Education
  t('academic_department', 'Education'), t('educational_institution', 'Education'), t('library', 'Education'),
  t('preschool', 'Education'), t('primary_school', 'Education'), t('research_institute', 'Education'),
  t('school', 'Education'), t('secondary_school', 'Education'), t('university', 'Education'),

  // Entertainment & Recreation
  t('adventure_sports_center', 'Entertainment'), t('amphitheatre', 'Entertainment'), t('amusement_center', 'Entertainment'),
  t('amusement_park', 'Entertainment'), t('aquarium', 'Entertainment'), t('banquet_hall', 'Entertainment'),
  t('botanical_garden', 'Entertainment'), t('bowling_alley', 'Entertainment'), t('casino', 'Entertainment'),
  t('comedy_club', 'Entertainment'), t('community_center', 'Entertainment'), t('concert_hall', 'Entertainment'),
  t('convention_center', 'Entertainment'), t('cultural_center', 'Entertainment'), t('dance_hall', 'Entertainment'),
  t('dog_park', 'Entertainment'), t('event_venue', 'Entertainment'), t('garden', 'Entertainment'),
  t('go_karting_venue', 'Entertainment', 'Go-Karting'), t('hiking_area', 'Entertainment'),
  t('indoor_playground', 'Entertainment'), t('internet_cafe', 'Entertainment'), t('karaoke', 'Entertainment'),
  t('live_music_venue', 'Entertainment'), t('marina', 'Entertainment'), t('miniature_golf_course', 'Entertainment', 'Mini Golf'),
  t('movie_theater', 'Entertainment'), t('night_club', 'Entertainment'), t('opera_house', 'Entertainment'),
  t('paintball_center', 'Entertainment'), t('park', 'Entertainment'), t('planetarium', 'Entertainment'),
  t('skateboard_park', 'Entertainment'), t('video_arcade', 'Entertainment'), t('vineyard', 'Entertainment'),
  t('water_park', 'Entertainment'), t('wedding_venue', 'Entertainment'), t('zoo', 'Entertainment'),

  // Finance
  t('accounting', 'Finance'), t('atm', 'Finance', 'ATM'), t('bank', 'Finance'),

  // Food & Drink
  t('acai_shop', 'Food & Drink', 'Acai Shop'), t('american_restaurant', 'Food & Drink'), t('asian_restaurant', 'Food & Drink'),
  t('bagel_shop', 'Food & Drink'), t('bakery', 'Food & Drink'), t('bar', 'Food & Drink'),
  t('bar_and_grill', 'Food & Drink'), t('barbecue_restaurant', 'Food & Drink', 'BBQ Restaurant'),
  t('beer_garden', 'Food & Drink'), t('breakfast_restaurant', 'Food & Drink'), t('brewery', 'Food & Drink'),
  t('brewpub', 'Food & Drink'), t('brunch_restaurant', 'Food & Drink'), t('buffet_restaurant', 'Food & Drink'),
  t('burger_restaurant', 'Food & Drink', 'Burger Restaurant'), t('cafe', 'Food & Drink'), t('cafeteria', 'Food & Drink'),
  t('candy_store', 'Food & Drink'), t('chicken_restaurant', 'Food & Drink'), t('chinese_restaurant', 'Food & Drink'),
  t('chocolate_shop', 'Food & Drink'), t('cocktail_bar', 'Food & Drink'), t('coffee_shop', 'Food & Drink'),
  t('deli', 'Food & Drink'), t('dessert_shop', 'Food & Drink'), t('diner', 'Food & Drink'),
  t('donut_shop', 'Food & Drink'), t('fast_food_restaurant', 'Food & Drink', 'Fast Food'),
  t('fine_dining_restaurant', 'Food & Drink', 'Fine Dining'), t('food_court', 'Food & Drink'),
  t('french_restaurant', 'Food & Drink'), t('greek_restaurant', 'Food & Drink'),
  t('hamburger_restaurant', 'Food & Drink'), t('ice_cream_shop', 'Food & Drink'),
  t('indian_restaurant', 'Food & Drink'), t('italian_restaurant', 'Food & Drink'),
  t('japanese_restaurant', 'Food & Drink'), t('juice_shop', 'Food & Drink'),
  t('kebab_shop', 'Food & Drink'), t('korean_restaurant', 'Food & Drink'),
  t('meal_delivery', 'Food & Drink'), t('meal_takeaway', 'Food & Drink'),
  t('mediterranean_restaurant', 'Food & Drink'), t('mexican_restaurant', 'Food & Drink'),
  t('middle_eastern_restaurant', 'Food & Drink'), t('noodle_shop', 'Food & Drink'),
  t('pizza_restaurant', 'Food & Drink', 'Pizza'), t('pub', 'Food & Drink'),
  t('ramen_restaurant', 'Food & Drink'), t('restaurant', 'Food & Drink'),
  t('sandwich_shop', 'Food & Drink'), t('seafood_restaurant', 'Food & Drink'),
  t('sports_bar', 'Food & Drink'), t('steak_house', 'Food & Drink'),
  t('sushi_restaurant', 'Food & Drink'), t('taco_restaurant', 'Food & Drink'),
  t('tea_house', 'Food & Drink'), t('thai_restaurant', 'Food & Drink'),
  t('vegan_restaurant', 'Food & Drink'), t('vegetarian_restaurant', 'Food & Drink'),
  t('vietnamese_restaurant', 'Food & Drink'), t('wine_bar', 'Food & Drink'), t('winery', 'Food & Drink'),

  // Government
  t('city_hall', 'Government'), t('courthouse', 'Government'), t('fire_station', 'Government'),
  t('government_office', 'Government'), t('local_government_office', 'Government'),
  t('police', 'Government', 'Police Station'), t('post_office', 'Government'),

  // Health & Wellness
  t('chiropractor', 'Health & Wellness'), t('dental_clinic', 'Health & Wellness'), t('dentist', 'Health & Wellness'),
  t('doctor', 'Health & Wellness'), t('drugstore', 'Health & Wellness'), t('general_hospital', 'Health & Wellness', 'Hospital'),
  t('massage', 'Health & Wellness'), t('massage_spa', 'Health & Wellness'), t('medical_center', 'Health & Wellness'),
  t('medical_clinic', 'Health & Wellness'), t('medical_lab', 'Health & Wellness'), t('pharmacy', 'Health & Wellness'),
  t('physiotherapist', 'Health & Wellness'), t('sauna', 'Health & Wellness'), t('skin_care_clinic', 'Health & Wellness'),
  t('spa', 'Health & Wellness'), t('tanning_studio', 'Health & Wellness'), t('wellness_center', 'Health & Wellness'),
  t('yoga_studio', 'Health & Wellness'),

  // Lodging
  t('bed_and_breakfast', 'Lodging', 'Bed & Breakfast'), t('campground', 'Lodging'),
  t('extended_stay_hotel', 'Lodging'), t('guest_house', 'Lodging'), t('hostel', 'Lodging'),
  t('hotel', 'Lodging'), t('inn', 'Lodging'), t('motel', 'Lodging'),
  t('resort_hotel', 'Lodging', 'Resort'), t('rv_park', 'Lodging', 'RV Park'),

  // Places of Worship
  t('buddhist_temple', 'Worship'), t('church', 'Worship'), t('hindu_temple', 'Worship'),
  t('mosque', 'Worship'), t('synagogue', 'Worship'),

  // Services
  t('barber_shop', 'Services'), t('beautician', 'Services'), t('beauty_salon', 'Services'),
  t('body_art_service', 'Services', 'Tattoo / Body Art'), t('catering_service', 'Services'),
  t('child_care_agency', 'Services', 'Child Care'), t('consultant', 'Services'),
  t('courier_service', 'Services'), t('electrician', 'Services'), t('employment_agency', 'Services'),
  t('florist', 'Services'), t('foot_care', 'Services'), t('funeral_home', 'Services'),
  t('hair_care', 'Services'), t('hair_salon', 'Services'), t('insurance_agency', 'Services'),
  t('laundry', 'Services'), t('lawyer', 'Services'), t('locksmith', 'Services'),
  t('makeup_artist', 'Services'), t('marketing_consultant', 'Services'), t('moving_company', 'Services'),
  t('nail_salon', 'Services'), t('non_profit_organization', 'Services', 'Non-Profit'),
  t('painter', 'Services'), t('pet_boarding_service', 'Services', 'Pet Boarding'),
  t('pet_care', 'Services'), t('plumber', 'Services'), t('real_estate_agency', 'Services', 'Real Estate'),
  t('hvac', 'Services', 'HVAC / Heating & Cooling'), t('landscaper', 'Services', 'Landscaping'),
  t('lawn_care_service', 'Services', 'Lawn Care'), t('pest_control', 'Services', 'Pest Control'),
  t('pool_service', 'Services', 'Pool Service'), t('pressure_washing', 'Services', 'Pressure Washing'),
  t('roofing_contractor', 'Services', 'Roofing'), t('shipping_service', 'Services'),
  t('tree_service', 'Services', 'Tree Service'), t('window_cleaning', 'Services', 'Window Cleaning'),
  t('general_contractor', 'Services', 'General Contractor'), t('handyman', 'Services', 'Handyman'),
  t('carpet_cleaning', 'Services', 'Carpet Cleaning'), t('house_cleaning', 'Services', 'House Cleaning / Maid Service'),
  t('garage_door_service', 'Services', 'Garage Door Service'), t('fencing_contractor', 'Services', 'Fencing'),
  t('solar_installer', 'Services', 'Solar Installation'), t('photographer', 'Services', 'Photographer'),
  t('printing_service', 'Services', 'Printing Service'), t('notary', 'Services', 'Notary'),
  t('towing_service', 'Services', 'Towing'), t('dry_cleaning', 'Services', 'Dry Cleaning'),
  t('storage', 'Services'), t('tailor', 'Services'),
  t('telecommunications_service_provider', 'Services', 'Telecom Provider'),
  t('tour_agency', 'Services', 'Tour Agency'), t('travel_agency', 'Services'), t('veterinary_care', 'Services', 'Vet'),

  // Shopping
  t('asian_grocery_store', 'Shopping'), t('auto_parts_store', 'Shopping'), t('bicycle_store', 'Shopping'),
  t('book_store', 'Shopping'), t('building_materials_store', 'Shopping'), t('butcher_shop', 'Shopping'),
  t('cell_phone_store', 'Shopping'), t('clothing_store', 'Shopping'), t('convenience_store', 'Shopping'),
  t('cosmetics_store', 'Shopping'), t('department_store', 'Shopping'), t('discount_store', 'Shopping'),
  t('electronics_store', 'Shopping'), t('farmers_market', 'Shopping'), t('flea_market', 'Shopping'),
  t('furniture_store', 'Shopping'), t('garden_center', 'Shopping'), t('gift_shop', 'Shopping'),
  t('grocery_store', 'Shopping'), t('hardware_store', 'Shopping'), t('health_food_store', 'Shopping'),
  t('home_goods_store', 'Shopping'), t('home_improvement_store', 'Shopping'),
  t('jewelry_store', 'Shopping'), t('liquor_store', 'Shopping'), t('pet_store', 'Shopping'),
  t('shoe_store', 'Shopping'), t('shopping_mall', 'Shopping'), t('sporting_goods_store', 'Shopping'),
  t('supermarket', 'Shopping'), t('thrift_store', 'Shopping'), t('toy_store', 'Shopping'),
  t('wholesaler', 'Shopping'),

  // Sports & Fitness
  t('athletic_field', 'Sports'), t('fitness_center', 'Sports'), t('golf_course', 'Sports'),
  t('gym', 'Sports'), t('ice_skating_rink', 'Sports'), t('playground', 'Sports'),
  t('ski_resort', 'Sports'), t('sports_club', 'Sports'), t('sports_complex', 'Sports'),
  t('stadium', 'Sports'), t('swimming_pool', 'Sports'), t('tennis_court', 'Sports'),

  // Transportation
  t('airport', 'Transportation'), t('bus_station', 'Transportation'), t('ferry_terminal', 'Transportation'),
  t('taxi_service', 'Transportation'), t('train_station', 'Transportation'),
];

// Sort alphabetically by label
BUSINESS_TYPES.sort((a, b) => a.label.localeCompare(b.label));

export function searchBusinessTypes(query: string): BusinessTypeOption[] {
  if (!query.trim()) return BUSINESS_TYPES.slice(0, 15);
  const lower = query.toLowerCase();
  return BUSINESS_TYPES.filter(
    t => t.label.toLowerCase().includes(lower) || t.value.includes(lower) || t.category.toLowerCase().includes(lower)
  ).slice(0, 15);
}

export { BUSINESS_TYPES };
