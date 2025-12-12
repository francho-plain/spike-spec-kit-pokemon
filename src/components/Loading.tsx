import './Loading.css'

function Loading() {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p>Loading...</p>
    </div>
  )
}

export default Loading