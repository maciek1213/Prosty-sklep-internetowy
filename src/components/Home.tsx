import { useEffect, useState } from "react";
import Header from "./Header";
import ProductsList from "./ProductsList";

interface Props {
  onLogout: () => void;
}

function Home({ onLogout }: Props) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  });

  const [searchTerm, setSearchTerm] = useState("");
  return (
    <>
      <Header setSearchTerm={setSearchTerm} onLogout={onLogout} token={token} />
      <ProductsList token={token} searchTerm={searchTerm} />
    </>
  );
}

export default Home;
