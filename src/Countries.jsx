import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Countries() {
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  const getCountries = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .order("name_common", { ascending: true });

    if (error) {
      alert("Error al cargar países");
      console.error(error);
    } else {
      setCountries(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    getCountries();
  }, []);

  if (loading) {
    return <h2>Cargando países...</h2>;
  }

  return (
    <div>
      <h2>Países</h2>

      <div style={styles.grid}>
        {countries.map((country) => (
          <div key={country.id} style={styles.card}>
            <img src={country.flag_png} alt={country.name_common} style={styles.flag} />
            <h3>{country.name_common}</h3>
            <p><b>Región:</b> {country.region}</p>
            <p><b>Capital:</b> {country.capital || "No disponible"}</p>
            <p><b>Población:</b> {country.population?.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "20px",
  },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
  },
  flag: {
    width: "100%",
    height: "130px",
    objectFit: "cover",
    borderRadius: "12px",
  },
};

export default Countries;