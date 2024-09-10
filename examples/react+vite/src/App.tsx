import './App.css'
import Image from './components/image'
import ImageStatic from './components/image-static'

function App() {

  return (
    <div style={{ display: 'flex', gap: 20, }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, }}>
        <h2>Image static</h2>
        {new Array(1).fill(0).map((_, index) => (
          <ImageStatic key={index} width={400} height={220} />
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, }}>
        <h2>Image</h2>
        {new Array(1).fill(0).map((_, index) => (
          <Image key={index} width={400} height={220} />
        ))}
      </div>

    </div>
  )
}

export default App
