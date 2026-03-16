export default function ProgressBar({ percent, color }) {
  const clamped = Math.min(percent, 100)

  return (
    <div className="progress-track">
      <div
        className="progress-fill"
        style={{ width: `${clamped}%`, background: color, transition: "width 0.5s ease" }}
      />
    </div>
  )
}
