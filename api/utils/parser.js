/**
 * Parses and extracts key nutrition details and builds a standardized product schema
 * from Open Food Facts API response payload.
 */
function parseProduct(offProduct) {
  const brandStr = offProduct.brands ? `[${offProduct.brands}] ` : '';
  const rawName = offProduct.product_name || offProduct.product_name_fr || 'Unknown Product';
  // Avoid double brand tags
  const name = rawName.startsWith('[') ? rawName : `${brandStr}${rawName}`;
  const image_url = offProduct.image_url || offProduct.image_front_url || '';

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
