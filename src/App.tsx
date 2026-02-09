import './App.css'
import Header from './components/header/header'
import Filters from './components/filter/filter'

function App() {

  return (
    <div className="app">
      <Header/>
      <main className="main-content">
        <section>
        <Filters 
          head="Найдите лучшие рейсы"
          text="Выберите параметры поиска"
          content="Укажите даты и направления"
        />
        </section>
        <section>райт зон</section>
      </main>
    </div>
  )
}

export default App
