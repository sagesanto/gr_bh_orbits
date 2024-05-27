import React, { useEffect, useRef, useState, Profiler } from 'react'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { setProperTime, setPlotData, addPlotData, clearPlotData, markAsDrawn, setClearGraph, setResetSim, setSimulationRunning, setCollided } from '../state/slices'
import { useFPS } from '../state/FPSContext'
import * as d3 from "d3"
import { path as d3Path } from 'd3-path';
import { scaleLinear } from 'd3-scale'

const MAX_RES = 100 // maximum number of points added in one tick
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
  let phi = -Math.PI/2
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

function D3Plot({ data, w, h, r0, a }) {
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

  const prevPoint = React.useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    // debugLog("data at beginning:",data)
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
      debugLog("clearing plot")
      dispatch(clearPlotData());
      prevPoint.current = null;
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

      // draw the ergosphere
        const ergoData = d3.range(0, 2 * Math.PI, 0.01).map(t => {
          // i'm adding Math.PI/2 to the angle to rotate by 90 degrees because i want to. not sure if this messes things up
          return {
            x: (1+Math.sqrt(1-a**2*Math.cos(t+Math.PI/2)**2)) * Math.cos(t),
            y: (1+Math.sqrt(1-a**2*Math.cos(t+Math.PI/2)**2)) * Math.sin(t)
          }
        })
        const ergo = d3.line()
          .x(d => xScale(d.x) + xShift)
          .y(d => yScale(d.y))
          .curve(d3.curveBasisClosed);
          g.append('path')
          .attr('d', ergo(ergoData))
          // .attr('transform', `translate(${xScale(0) + xShift},${yScale(0)})`)
          .style('fill', 'none')
          .style('stroke', 'red')
          .style('opacity', 1);
      
          
      // event horizon
        let r_plus = 1 + Math.sqrt(1-a**2)
        g.append('circle')
        .attr('cx', xScale(0) + xShift)
        .attr('cy', yScale(0))
        .attr('r', xScale(r_plus) - xScale(0))
        .style('fill', 'black')
        .style("opacity", 0.5)
        .style('stroke', 'black')
        .style('stroke-width', 1.5);
          
      // draw a curved arrow inside the event horizon to indicate the direction of rotation 
        if (a !== 0) {
          let curve = d3Path();
          curve.moveTo(xScale(0.8*r_plus) + xShift, yScale(0))
          curve.arc(xScale(0) + xShift, yScale(0), xScale(0.8*r_plus) - xScale(0), 0, Math.PI, true)
          // make an arrow
          g.append('defs')
          .append('marker')
          .attr('id', 'arrowhead')
          .attr('viewBox', '0 0 12 12')
          .attr('refX', 6)
          .attr('refY', 6)
          .attr('orient', 'auto')
          .attr('markerWidth', 10)
          .attr('markerHeight', 10)
          .attr('xoverflow', 'visible')
          .append('svg:path')
          .attr('d', 'M 0 0 L 10 5 L 0 10 z')
          .attr('fill', 'black')


          //print curve position
          g.append('path')
          .attr('d', curve)
          .style('fill', 'none')
          .style('stroke', 'black')
          .attr('marker-end', 'url(#arrowhead)')
        }

      dispatch(setClearGraph(false))
      dispatch(setCollided(false))
    } else {
      // filter the data to only include points where drawn is not true
      // const newData = data.filter(d => !d.drawn);
      debugLog("Number of new points: ", data.length);
      // debugLog("Number of drawn points: ", num_drawn);
      
      let path = g.select('path');

    if (path.empty()) {
      path = g.append('path')
        .attr('fill', 'none')
        .attr('stroke', '#1976d2')
        .attr('stroke-width', 1.5);
    }
    // Append line and circle for each new point
    data.forEach((datum) => {
      const x = xScale(datum.x) + xShift;
      const y = yScale(datum.y);

      // If there is a previous point, draw a line from the previous point to the new point
      if (prevPoint.current) {
        g.append('path')
          .attr('d', `M ${prevPoint.current.x},${prevPoint.current.y} L ${x},${y}`)
          .attr('fill', 'none')
          .attr('stroke', '#1976d2')
          .attr('stroke-width', 1.5);
      }

      // Draw a circle at the new point
      g.append('circle')
        .attr('cx', x)
        .attr('cy', y)
        .attr('r', 3)
        .style('fill', '#1976d2');

      // Update the previous point
      prevPoint.current = { x, y };
      debugLog("set prevPoint to",datum.x, datum.y)
    });

    }
    const endTime = performance.now();
    console.log('D3Plot duration:', endTime - startTime);
  }, [data, clear])

  return (
    <svg ref={ref} style={{ width: '100%', height: '100%' }} />
  )
}


function DynamicPlot() {
  const plotData = useSelector((state) => state.plotData.value)
  const r0 = useSelector((state) => state.initialRadius.value)
  const a = -useSelector((state) => state.spin.value)
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
      <D3Plot data={plotData} {...dimensions} r0={r0} a = {a} />
    </div>
  )
}

function PlotManager() {
  const dispatch = useDispatch()
  dispatch(setClearGraph(true))
  debugLog('manager init')
  const gr = useSelector((state) => state.gr.value)
  const r0 = useSelector((state) => state.initialRadius.value)
  const a = -useSelector((state) => state.spin.value)
  const wFrac = -useSelector((state) => state.angularVel.value)
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

  const store = useStore()
  const simulationRunningRef = useRef()

  useEffect(() => {
    simulationRunningRef.current = store.getState().simulationRunning.value
    const unsubscribe = store.subscribe(() => {
      simulationRunningRef.current = store.getState().simulationRunning.value
    })

    return () => {
      unsubscribe()
    }
  }, [store])

  useEffect(() => {
    debugLog("plot effect")
    let intervalId

    const updatePlot = () => {
      const startTime = performance.now();
      let num_points = Math.min(MAX_RES, Math.ceil(10/Math.sqrt(rp))) // number of points added in one tick
      let dtau_eff = dtau/num_points // effective time step (to account for number of points added in one tick)
      debugLog("num_points",num_points)
      let pointArr = []
      for (let i = 0; i < num_points; i++) {
        if (!simulationRunningRef.current) {
          return
        }
          debugLog("plot data update")
          let [newR, newPhi, newDtau, newRp, newRf, newTau, newPoint] = compute_next_point(a, gr, r, phi, E, L, dtau_eff, rp, rf, tau)
          if (newRf < 0) {
            clearInterval(intervalId)
            debugLog('hit the singularity')
            dispatch(setCollided(true))
            pointArr.push({x:0, y:0})
            dispatch(setPlotData(pointArr))
            dispatch(setProperTime(newTau))
            dispatch(setSimulationRunning(false))
            return
          } else {
            pointArr.push(newPoint)
            // dispatch(addPlotData({x:newPoint.x, y:newPoint.y}))
          }
          [r, phi, dtau, rp, rf, tau] = [newR, newPhi, newDtau * num_points, newRp, newRf, newTau]
          dispatch(setProperTime(tau))
        }
        dispatch(setPlotData(pointArr))
        const endTime = performance.now();
        console.log('updatePlot duration:', endTime - startTime);
      }
    debugLog("speed",speed)
    intervalId = setInterval(updatePlot, speed)

    return () => clearInterval(intervalId)
  }, [a, gr, r0, wFrac, tdiv, speed, reset])

  return ( 
    <DynamicPlot />
  )
}

export default PlotManager