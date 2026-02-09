import './App.css';
import Header from './components/header/header';
import SortBar from './components/sort/SortBar';
import StopsFilter from './components/filter/StopsFilter';
import CompaniesFilter from './components/filter/CompaniesFilter';
import TicketList from './components/tickets/TicketList';

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <aside className="sidebar">
          <StopsFilter />
          <CompaniesFilter />
        </aside>
        <section className="content">
          <SortBar />
          <TicketList />
        </section>
      </main>
    </div>
  );
}

export default App;
