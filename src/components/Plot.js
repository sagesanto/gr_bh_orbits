import React, { useEffect, useRef, useState, Profiler } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setProperTime, addPlotData, setClearGraph, setResetSim } from '../state/slices'
import { useFPS } from '../state/FPSContext'
import * as d3 from "d3"
import { scaleLinear } from 'd3-scale'

const debug = true

function logProfile(id, phase, actualTime, baseTime, startTime, commitTime) {
  console.log(`--- ${id}'s ${phase} phase: ---`)
  console.log(`Actual time: ${actualTime}`)
  console.log(`Base time: ${baseTime}`)
  console.log(`Start time: ${startTime}`)
  console.log(`Commit time: ${commitTime}`)
}

function debugLog(...args) {
  if (debug) {
    console.log(...args)
  }
}

function calc_derived_values(a,gr,r0,wFrac,tdiv) {
  let r = r0
  const A = a*gr // spin is "zero" for newtonian purposes
  const z = 2*r0**(3/2)*A
  const q = r**3-3*r**2*gr
  let wC = null
  if (wFrac > 0) {
      if (q+z<0){
          throw new Error(`Invalid state: q + z is less than 0 (q: ${q}, z: ${z})`)
      }
      wC = (q+z)**(-1/2)
  }
  else{
      if (q-z<0){
          throw new Error(`Invalid state: q - z is less than 0 (q: ${q}, z: ${z})`)
      }
      wC = (q-z)**(-1/2)
  }
  const w = wC*wFrac
  const q2 = r**2-2*gr*r + A**2
  const E2 = q2*w**2+1-2*gr/r
  if (E2<0){
      throw new Error('Orbit impossible for given parameters (E < 0).')
  }
  const E = E2**(1/2)
  const L = (q2*w-2*A*(E/r0))/(1-2*gr/r)
  let dtau = 2*Math.PI/wC/tdiv
  let phi = 0
  let tau = 0
  let rp = r
  let rf = null
  return ([r, phi, E, L, dtau, rp, rf, tau])
}

function compute_next_point(a,gr,r, phi, E, L, dtau, rp, rf, tau){
    debugLog("-------- compute next point --------")
    debugLog("Params: a:",a,"gr:",gr,"r:",r,"phi:",phi,"E:",E,"L:",L, "dtau:",dtau,"rp:",rp,"rf:",rf,"tau:",tau)
    debugLog("------------------------------------")
    const A = a*gr // spin is "zero" for newtonian purposes
    rf = A ? 2*r - rp + dtau**2 * (-1/r**2 + (L**2 + A**2 * (1 - E**2))/r**3 - 3*(L-A*E)*(L-A*E)/r**4) : 2*r - rp + dtau**2 * (-1/r**2 + L**2/r**3 - 3*gr*L**2/r**4)
    // radius half-step
    const rh = (rf+r)/2
    const dphidtau = A ? (2*E*A/rh + L - 2*L/rh)/(rh**2 + A**2 - 2*rh) : L/rh**2
    const dphi = dphidtau*dtau
    phi += dphi
    tau += dtau
    rp = r
    r = rf
    return[r, phi, dtau, rp, rf, tau, { x: r*Math.cos(phi), y: r*Math.sin(phi) }] 
}

function D3Plot({ data, w, h, r0 }) {
  var margin = {top: 20, right: 10, bottom: 20, left: 10}
  var width = w - margin.left - margin.right
  var height = h - margin.top - margin.bottom

  let min_dimension = Math.min(width, height)
  const xShift = (Math.max(width, height) - min_dimension)/2

  const clear = useSelector((state) => state.clearGraph.value)
  const dispatch = useDispatch()
  const ref = React.useRef()

  const xScale = scaleLinear()
  .domain([-1.2*r0, 1.2*r0])
  .range([0, min_dimension])
  
  const yScale = scaleLinear()
    .domain([-1.2*r0, 1.2*r0])
    .range([0, min_dimension])

  useEffect(() => {
    if (width <= 0 || height <= 0) return

    const svg = d3.select(ref.current)    
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)

    let g = svg.select("g")

    if (g.empty()) {
      g = svg.append("g")
    }
    g.attr("transform", `translate(${margin.left},${margin.top})`)

    if (clear) {
      g.selectAll("*").remove()

      const xAxis = d3.axisBottom(xScale)
      .ticks(11)
      .tickSize(-min_dimension)
      .tickFormat((number,index) =>{return(String(number)+" GM")})

      const yAxis = d3.axisLeft(yScale)
        .ticks(11)
        .tickSize(-min_dimension)
        .tickFormat((number,index) =>{return(String(number)+" GM")})

      g.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(${xShift},${height})`)
        .call(xAxis)

      g.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${xShift},0)`)
        .call(yAxis)

      dispatch(setClearGraph(false))
    } else {
      g.append('circle')
        .attr('cx', xScale(data.x)+xShift)
        .attr('cy', yScale(data.y))
        .attr('r', 3)
        .style('fill', '#1976d2')
    }
  }, [data, clear])

  return (
    <svg ref={ref} style={{ width: '100%', height: '100%' }} />
  )
}


function DynamicPlot() {
  const plotData = useSelector((state) => state.plotData.value)
  const r0 = useSelector((state) => state.initialRadius.value)
  const ref = useRef()
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })
  const { fps, tick } = useFPS()
  tick()

  useEffect(() => {
    if (ref.current) {
      setDimensions({
        w: ref.current.offsetWidth,
        h: ref.current.offsetHeight
      })
    }
  }, [])

  return (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
      <D3Plot data={plotData} {...dimensions} r0={r0} />
    </div>
  )
}

function PlotManager() {
  const dispatch = useDispatch()
  dispatch(setClearGraph(true))
  debugLog('manager init')
  const gr = useSelector((state) => state.gr.value)
  const r0 = useSelector((state) => state.initialRadius.value)
  const a = useSelector((state) => state.spin.value)
  const wFrac = useSelector((state) => state.angularVel.value)
  const tdiv = useSelector((state) => state.tdiv.value)
  const speed = 1000/(useSelector((state) => state.simSpeed.value))
  const reset = useSelector((state) => state.resetSim.value)

  useEffect(() => {
    if (reset)
    {
      dispatch(setResetSim(false))
    }
  },[reset])

  dispatch(addPlotData({x:r0,y:0}))
  debugLog("--------- init ---------")
  debugLog("a:",a,"gr:",gr,"r0:",r0,"wFrac:",wFrac,"tdiv:",tdiv,"speed:",speed)
  debugLog("------------------------")

  let [r, phi, E, L, dtau, rp, rf, tau] = calc_derived_values(a, gr, r0, wFrac, tdiv)
  useEffect(() => {
    debugLog("plot effect")
    let intervalId

    const updatePlot = () => {
      if (debug) { debugLog("plot update") }
      let [newR, newPhi, newDtau, newRp, newRf, newTau, newPoint] = compute_next_point(a, gr, r, phi, E, L, dtau, rp, rf, tau)
      dispatch(setProperTime(newTau))
      if (newRf < 0) {
        clearInterval(intervalId)
        debugLog('hit the singularity')
        dispatch(addPlotData({x:0, y:0}))
      } else {
          dispatch(addPlotData({x:newPoint.x, y:newPoint.y}))
        }
      [r, phi, dtau, rp, rf, tau] = [newR, newPhi, newDtau, newRp, newRf, newTau]
    }
    debugLog("speed",speed)
    intervalId = setInterval(updatePlot, speed)

    return () => clearInterval(intervalId)
  }, [a, gr, r0, wFrac, tdiv, speed, reset])

  return <DynamicPlot />
}

export default PlotManager