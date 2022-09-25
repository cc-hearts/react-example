import ReactDOM from 'react-dom/client'
import App from './App'
import './normalize.css'
import './base-css.less'

const rootElement = document.getElementById('root')
const root = ReactDOM.createRoot(rootElement!)
root.render(<App />)
