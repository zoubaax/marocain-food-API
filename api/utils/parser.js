/**
 * Category-based fallback system that replaces missing or generic placeholder images
 * with beautiful, high-resolution stock photos.
 */
function getBeautifulFallbackImage(name, imageUrl) {
  const isPlaceholder = !imageUrl || 
                        imageUrl.trim() === '' || 
                        imageUrl.includes('packaging.svg') || 
                        imageUrl.includes('placeholder') || 
                        !imageUrl.startsWith('http');
  
  if (!isPlaceholder) {
    return imageUrl; // Keep original if it is a valid product photo
  }

  const nameLower = name.toLowerCase();

  // Match keywords to assign premium stock food photography
  if (nameLower.includes('tea') || nameLower.includes('thé') || nameLower.includes('ataye') || nameLower.includes('infusion')) {
    return 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'; // Tea
  }
  if (nameLower.includes('spice') || nameLower.includes('épice') || nameLower.includes('cumin') || nameLower.includes('harissa') || nameLower.includes('poivre') || nameLower.includes('sel')) {
    return 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80'; // Spices
  }
  if (nameLower.includes('oil') || nameLower.includes('huile') || nameLower.includes('olive')) {
    return 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80'; // Olive oil
  }
  if (nameLower.includes('biscuit') || nameLower.includes('cookie') || nameLower.includes('bimo') || nameLower.includes('galette') || nameLower.includes('gaufrette') || nameLower.includes('chocolat') || nameLower.includes('nutella')) {
    return 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80'; // Cookies/Chocolate
  }
  if (nameLower.includes('juice') || nameLower.includes('jus') || nameLower.includes('soda') || nameLower.includes('boisson') || nameLower.includes('coca') || nameLower.includes('fanta')) {
    return 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=600&q=80'; // Drinks/Soda
  }
  if (nameLower.includes('water') || nameLower.includes('eau') || nameLower.includes('sidi ali') || nameLower.includes('ain atlas')) {
    return 'https://images.unsplash.com/photo-1608885898957-a599fb1b4671?auto=format&fit=crop&w=600&q=80'; // Mineral Water
  }
  if (nameLower.includes('cheese') || nameLower.includes('fromage') || nameLower.includes('lait') || nameLower.includes('milk') || nameLower.includes('yaourt') || nameLower.includes('yogurt')) {
    return 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&w=600&q=80'; // Dairy/Cheese
  }
  if (nameLower.includes('couscous') || nameLower.includes('tagine') || nameLower.includes('tajine') || nameLower.includes('pasta') || nameLower.includes('pâte')) {
    return 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=600&q=80'; // Moroccan Tagine / Pasta
  }
  if (nameLower.includes('honey') || nameLower.includes('miel') || nameLower.includes('confiture') || nameLower.includes('jam')) {
    return 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=600&q=80'; // Jam/Honey
  }
  
  // Generic beautiful food composition fallback
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80';
}

/**
 * Parses and extracts key nutrition details and builds a standardized product schema
 * from Open Food Facts API response payload.
 */
function parseProduct(offProduct) {
  const brandStr = offProduct.brands ? `[${offProduct.brands}] ` : '';
  const rawName = offProduct.product_name || offProduct.product_name_fr || 'Unknown Product';
  // Avoid double brand tags
  const name = rawName.startsWith('[') ? rawName : `${brandStr}${rawName}`;
  
  // Extract and process image with automatic fallback replacement
  const rawImageUrl = offProduct.image_url || offProduct.image_front_url || '';
  const image_url = getBeautifulFallbackImage(name, rawImageUrl);

  const nutriments = offProduct.nutriments || {};
  const nutrition_facts = {
    energy_kcal_100g: nutriments['energy-kcal_100g'] ?? null,
    energy_kj_100g: nutriments['energy-kj_100g'] ?? null,
    fat_100g: nutriments.fat_100g ?? null,
    saturated_fat_100g: nutriments['saturated-fat_100g'] ?? null,
    carbohydrates_100g: nutriments.carbohydrates_100g ?? null,
    sugars_100g: nutriments.sugars_100g ?? null,
    proteins_100g: nutriments.proteins_100g ?? null,
    salt_100g: nutriments.salt_100g ?? null,
    sodium_100g: nutriments.sodium_100g ?? null,
    fiber_100g: nutriments.fiber_100g ?? null
  };

  return {
    name,
    image_url,
    nutrition_facts
  };
}

module.exports = {
  parseProduct
};
