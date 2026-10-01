'use client'
import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
// Real Natural Earth landmass data (110m resolution — pre-simplified for
// small-scale rendering), not a hand-drawn approximation, so the continents
// are actually recognizable as they rotate.
import landTopo from 'world-atlas/land-110m.json'

const landGeo: any = feature(landTopo as any, (landTopo as any).objects.land)

export default function Globe({ size = 64 }: { size?: number }) {
  const pathRef = useRef<SVGPathElement>(null)
  const graticuleRef = useRef<SVGPathElement>(null)
  const rotRef = useRef(0)

  useEffect(() => {
    const R = 100 // internal resolution; the <svg> scales this to its CSS size
    const projection = geoOrthographic()
      .scale(R / 2.08)
      .translate([R / 2, R / 2])
      .clipAngle(90)
      .rotate([0, -14, 0])
    const path = geoPath(projection)
    const graticule = geoGraticule10()

    const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let frame = 0
    function tick() {
      frame++
      // throttle to ~30fps — plenty smooth for a small decorative icon,
      // kinder to mobile CPUs than recomputing the path every frame
      if (!reduced && frame % 2 === 0) {
        rotRef.current = (rotRef.current + 0.11) % 360
        projection.rotate([rotRef.current, -14, 0])
        if (pathRef.current) pathRef.current.setAttribute('d', path(landGeo) || '')
        if (graticuleRef.current) graticuleRef.current.setAttribute('d', path(graticule as any) || '')
      }
      raf = requestAnimationFrame(tick)
    }

    // draw the initial frame immediately so it never flashes empty
    if (pathRef.current) pathRef.current.setAttribute('d', path(landGeo) || '')
    if (graticuleRef.current) graticuleRef.current.setAttribute('d', path(graticule as any) || '')

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <span style={{ display: 'inline-block', width: `${size}px`, height: `${size}px`, position: 'relative', verticalAlign: 'bottom' }}>
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
        <defs>
          <clipPath id="aw-globe-clip">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          <radialGradient id="aw-globe-shade" cx="32%" cy="28%" r="75%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0" />
            <stop offset="100%" stopColor="#1a1512" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        {/* decorative route bands, bowing outside the sphere's silhouette —
            screen-space ornament, not real flight data */}
        <g fill="none" stroke="#3a2e2b" strokeOpacity="0.4">
          <path d="M 3 33 Q 50 -16 97 33" strokeWidth="0.9" strokeDasharray="1.6 2.4" />
          <path d="M 7 75 Q 50 116 93 75" strokeWidth="0.9" strokeDasharray="1.6 2.4" />
        </g>
        <g fill="#3a2e2b">
          <circle cx="3" cy="33" r="1.9" className="aw-blink" style={{ animationDelay: '0s' }} />
          <circle cx="97" cy="33" r="1.9" className="aw-blink" style={{ animationDelay: '1.3s' }} />
          <circle cx="7" cy="75" r="1.9" className="aw-blink" style={{ animationDelay: '0.6s' }} />
          <circle cx="93" cy="75" r="1.9" className="aw-blink" style={{ animationDelay: '1.9s' }} />
        </g>

        <g clipPath="url(#aw-globe-clip)">
          <circle cx="50" cy="50" r="50" fill="#efe6da" />
          <path ref={graticuleRef} fill="none" stroke="#3a2e2b" strokeWidth="0.3" opacity="0.16" />
          <path ref={pathRef} fill="#3a2e2b" stroke="none" />
          <circle cx="50" cy="50" r="50" fill="url(#aw-globe-shade)" />
        </g>
        <circle cx="50" cy="50" r="50" fill="none" stroke="rgba(58,46,43,0.2)" strokeWidth="0.6" />
      </svg>
    </span>
  )
}
