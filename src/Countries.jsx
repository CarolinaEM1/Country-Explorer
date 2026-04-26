import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

function Countries() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);

  const getCountries = async () => {
    setLoading(true);

    let query = supabase
      .from("countries")
      .select("*")
      .order("name_common", { ascending: true });

    if (search.trim() !== "") {
      query = query.ilike("name_common", `%${search}%`);
    }

    if (region !== "") {
      query = query.eq("region", region);
    }

    const { data, error } = await query;

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
  }, [search, region]);

  const clearFilters = () => {
    setSearch("");
    setRegion("");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Explore Countries 🌎</h2>
          <p style={styles.subtitle}>
            Search and filter countries stored in Supabase.
          </p>
        </div>
      </div>

      <div style={styles.filters}>
        <input
          type="text"
          placeholder="Search by country name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.input}
        />

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          style={styles.select}
        >
          <option value="">All regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
          <option value="Antarctic">Antarctic</option>
        </select>

        <button onClick={clearFilters} style={styles.clearButton}>
          Clear
        </button>
      </div>

      {loading ? (
        <h3 style={styles.loading}>Loading countries...</h3>
      ) : countries.length === 0 ? (
        <h3 style={styles.loading}>No countries found.</h3>
      ) : (
        <>
          <p style={styles.count}>
            Showing {countries.length} countries
          </p>

          <div style={styles.grid}>
            {countries.map((country) => (
              <div key={country.id} style={styles.card}>
                <img
                  src={country.flag_png}
                  alt={country.name_common}
                  style={styles.flag}
                />

                <h3 style={styles.cardTitle}>{country.name_common}</h3>

                <p>
                  <b>Region:</b> {country.region || "Not available"}
                </p>

                <p>
                  <b>Capital:</b> {country.capital || "Not available"}
                </p>

                <p>
                  <b>Population:</b>{" "}
                  {country.population
                    ? country.population.toLocaleString()
                    : "Not available"}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "30px",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "32px",
    margin: "0",
    color: "#0f172a",
  },
  subtitle: {
    color: "#64748b",
    marginTop: "8px",
  },
  filters: {
    display: "flex",
    gap: "12px",
    marginBottom: "25px",
    flexWrap: "wrap",
  },
  input: {
    flex: "1",
    minWidth: "230px",
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  select: {
    padding: "13px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  clearButton: {
    padding: "13px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#0f172a",
    color: "white",
    cursor: "pointer",
  },
  count: {
    color: "#475569",
    marginBottom: "15px",
  },
  loading: {
    color: "#475569",
  },
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
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  flag: {
    width: "100%",
    height: "130px",
    objectFit: "cover",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  cardTitle: {
    color: "#0f172a",
    marginBottom: "10px",
  },
};

export default Countries;