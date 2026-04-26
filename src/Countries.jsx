import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";

const ITEMS_PER_PAGE = 12;

function Countries() {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCountries, setTotalCountries] = useState(0);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const getCountries = async () => {
    setLoading(true);

    const from = (page - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    let query = supabase
      .from("countries")
      .select("*", { count: "exact" })
      .order("name_common", { ascending: true })
      .range(from, to);

    if (search.trim() !== "") {
      query = query.ilike("name_common", `%${search}%`);
    }

    if (region !== "") {
      query = query.eq("region", region);
    }

    const { data, error, count } = await query;

    if (error) {
      alert("Error al cargar países");
      console.error(error);
    } else {
      setCountries(data);
      setTotalCountries(count || 0);
    }

    setLoading(false);
  };

  useEffect(() => {
    getCountries();
  }, [page, search, region]);

  useEffect(() => {
    setPage(1);
  }, [search, region]);

  const totalPages = Math.ceil(totalCountries / ITEMS_PER_PAGE);

  const clearFilters = () => {
    setSearch("");
    setRegion("");
    setPage(1);
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
            Showing {countries.length} of {totalCountries} countries
          </p>

          <div style={styles.grid}>
            {countries.map((country) => (
              <div
                key={country.id}
                style={styles.card}
                onClick={() => setSelectedCountry(country)}
              >
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

                <button style={styles.detailsButton}>View details</button>
              </div>
            ))}
          </div>

          <div style={styles.pagination}>
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              style={{
                ...styles.pageButton,
                ...(page === 1 ? styles.disabledButton : {}),
              }}
            >
              Previous
            </button>

            <span style={styles.pageInfo}>
              Page {page} of {totalPages}
            </span>

            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              style={{
                ...styles.pageButton,
                ...(page === totalPages ? styles.disabledButton : {}),
              }}
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedCountry && (
        <div style={styles.modalOverlay} onClick={() => setSelectedCountry(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedCountry(null)}
            >
              ×
            </button>

            <img
              src={selectedCountry.flag_png}
              alt={selectedCountry.name_common}
              style={styles.modalFlag}
            />

            <h2 style={styles.modalTitle}>{selectedCountry.name_common}</h2>
            <p style={styles.officialName}>{selectedCountry.name_official}</p>

            <div style={styles.detailGrid}>
              <p>
                <b>Region:</b> {selectedCountry.region || "Not available"}
              </p>
              <p>
                <b>Subregion:</b>{" "}
                {selectedCountry.subregion || "Not available"}
              </p>
              <p>
                <b>Capital:</b> {selectedCountry.capital || "Not available"}
              </p>
              <p>
                <b>Population:</b>{" "}
                {selectedCountry.population
                  ? selectedCountry.population.toLocaleString()
                  : "Not available"}
              </p>
              <p>
                <b>Languages:</b>{" "}
                {selectedCountry.languages || "Not available"}
              </p>
              <p>
                <b>Currencies:</b>{" "}
                {selectedCountry.currencies || "Not available"}
              </p>
            </div>

            {selectedCountry.maps_google && (
              <a
                href={selectedCountry.maps_google}
                target="_blank"
                rel="noreferrer"
                style={styles.mapButton}
              >
                Open in Google Maps
              </a>
            )}
          </div>
        </div>
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
    cursor: "pointer",
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
  detailsButton: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  pagination: {
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "15px",
  },
  pageButton: {
    padding: "12px 18px",
    borderRadius: "12px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  disabledButton: {
    background: "#94a3b8",
    cursor: "not-allowed",
  },
  pageInfo: {
    color: "#334155",
    fontWeight: "bold",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.65)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "560px",
    background: "white",
    borderRadius: "22px",
    padding: "25px",
    position: "relative",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  closeButton: {
    position: "absolute",
    top: "15px",
    right: "18px",
    border: "none",
    background: "#e2e8f0",
    color: "#0f172a",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    fontSize: "24px",
    cursor: "pointer",
  },
  modalFlag: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "16px",
    border: "1px solid #e2e8f0",
  },
  modalTitle: {
    marginTop: "18px",
    marginBottom: "5px",
    color: "#0f172a",
  },
  officialName: {
    color: "#64748b",
    marginBottom: "20px",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px 16px",
    color: "#334155",
  },
  mapButton: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "12px",
    background: "#16a34a",
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default Countries;