interface Props {
  setSearchTerm: (searchTerm: string) => void;
  onLogout: () => void;
  token: string | null;
}

function Header({ setSearchTerm, onLogout, token }: Props) {
  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary"
        data-bs-theme="light"
      >
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <h1 className="display-5">Prosty Sklep Internetowy</h1>
          </a>
          <div className="vr" data-bs-theme="dark" />
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/">
                  Home
                </a>
              </li>
              <li className="nav-item">
                {token ? (
                  <a className="nav-link" href="/" onClick={onLogout}>
                    Wyloguj się
                  </a>
                ) : (
                  <a className="nav-link" href="/login">
                    Zaloguj się
                  </a>
                )}
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/cart">
                  Koszyk
                </a>
              </li>
            </ul>
            <form
              className="d-flex"
              role="search"
              onSubmit={(event) => {
                event.preventDefault();
                setSearchTerm(document.querySelector("input")!.value);
              }}
            >
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
          </div>
        </div>
      </nav>
      <hr />
    </>
  );
}

export default Header;
