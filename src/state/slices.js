import { createSlice } from '@reduxjs/toolkit'

export const angularVel = createSlice({
  name: 'angularVel',
  initialState: {
    value: 0,
  },
  reducers: {
    setTo: (state, action) => {
      state.value = action.payload
    },
  },
})

export const { setTo: setAngVel } = angularVel.actions

export const initialRadius = createSlice({
    name: 'initialRadius',
    initialState: {
        value: 15,
    },
    reducers: {
        setTo: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { setTo: setInitialRadius } = initialRadius.actions

export const spin = createSlice({
    name: 'spin',
    initialState: {
        value: 0,
    },
    reducers: {
        setTo: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { setTo: setSpin } = spin.actions

export const gr = createSlice({
    name: 'gr',
    initialState: {
        value: true,
    },
    reducers: {
        setTo: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { setTo: setGR } = gr.actions

export const properTime = createSlice({
    name: 'properTime',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state, action) => {
        state.value += action.payload
        },
        set: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { increment: incrementProperTime, set: setProperTime } = properTime.actions

export const tdiv = createSlice({
    name: 'tdiv',
    initialState: {
        value: 100,
    },
    reducers: {
        setTo: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { setTo: setTdiv } = tdiv.actions

export const simSpeed = createSlice({
    name: 'simSpeed',
    initialState: {
        value: 60,
    },
    reducers: {
        setTo: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { setTo: setSimSpeed } = simSpeed.actions

export const plotData = createSlice({
    name: 'plotData',
    initialState: {
        value: {
            x: null,
            y: null,
        },
    },
    reducers: {
        add: (state, action) => {
            // plotData stores one point at a time, but they're pushed to the svg array. this "append" function doesn't actually append, it just sets the value to the new point, which will be appended by the plot
            state.value.x = action.payload.x
            state.value.y = action.payload.y
        },
    },
    })

export const { add: addPlotData } = plotData.actions

export const clearGraph = createSlice({
    name: 'clearGraph',
    initialState: {
        value: true,
    },
    reducers: {
        set: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { set: setClearGraph } = clearGraph.actions

export const resetSim = createSlice({
    name: 'resetSim',
    initialState: {
        value: true,
    },
    reducers: {
        set: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { set: setResetSim } = resetSim.actions

export const simulationRunning = createSlice({
    name: 'simulationRunning',
    initialState: {
        value: true,
    },
    reducers: {
        set: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { set: setSimulationRunning } = simulationRunning.actions


export const collided = createSlice({
    name: 'collided',
    initialState: {
        value: false,
    },
    reducers: {
        set: (state, action) => {
        state.value = action.payload
        },
    },
    })

export const { set: setCollided } = collided.actions

export const angVelReducer = angularVel.reducer
export const initialRadiusReducer = initialRadius.reducer
export const spinReducer = spin.reducer
export const grReducer = gr.reducer
export const properTimeReducer = properTime.reducer
export const tdivReducer = tdiv.reducer
export const plotDataReducer = plotData.reducer
export const simSpeedReducer = simSpeed.reducer
export const clearGraphReducer = clearGraph.reducer
export const resetSimReducer = resetSim.reducer
export const simulationRunningReducer = simulationRunning.reducer
export const collidedReducer = collided.reducer