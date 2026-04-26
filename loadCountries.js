import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://vswrdhpleunpzxqyfdsb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzd3JkaHBsZXVucHp4cXlmZHNiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzIzMDAxNywiZXhwIjoyMDkyODA2MDE3fQ.Ol-lBfEKa0fwD7hf7soUzyAv3PWr9msxpw3GrCHTtOs"
);

const loadCountries = async () => {
  try {
    const response = await fetch(
  "https://restcountries.com/v3.1/all?fields=cca3,name,flags,region,subregion,capital,population,languages,currencies,maps"
    );

    if (!response.ok) {
    throw new Error(`Error al consultar REST Countries. Status: ${response.status}`);
    }

    const countries = await response.json();

    if (!Array.isArray(countries)) {
      throw new Error("La API no devolvió un arreglo válido");
    }

    const formattedCountries = countries.map((country) => ({
      cca3: country.cca3,
      name_common: country.name?.common ?? null,
      name_official: country.name?.official ?? null,
      flag_png: country.flags?.png ?? null,
      flag_svg: country.flags?.svg ?? null,
      region: country.region ?? null,
      subregion: country.subregion ?? null,
      capital: country.capital?.[0] ?? null,
      population: country.population ?? null,
      languages: country.languages
        ? Object.values(country.languages).join(", ")
        : null,
      currencies: country.currencies
        ? Object.keys(country.currencies).join(", ")
        : null,
      maps_google: country.maps?.googleMaps ?? null,
    }));

    const { error } = await supabase
      .from("countries")
      .upsert(formattedCountries, { onConflict: "cca3" });

    if (error) {
      console.error("Error insertando países:", error);
    } else {
      console.log("✅ Países cargados correctamente");
    }
  } catch (err) {
    console.error("Error cargando países:", err.message);
  }
};

loadCountries();