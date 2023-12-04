import { configureStore } from '@reduxjs/toolkit'
import { angVelReducer, initialRadiusReducer, spinReducer, grReducer, properTimeReducer, tdivReducer, plotDataReducer, simSpeedReducer, clearGraphReducer, resetSimReducer, simulationRunningReducer, collidedReducer } from './slices'

export default configureStore({
  reducer: {
    angularVel: angVelReducer,
    initialRadius: initialRadiusReducer,
    spin: spinReducer,
    gr: grReducer,
    properTime: properTimeReducer,
    tdiv: tdivReducer,
    plotData: plotDataReducer,
    simSpeed: simSpeedReducer,
    clearGraph: clearGraphReducer,
    resetSim: resetSimReducer,
    simulationRunning: simulationRunningReducer,
    collided: collidedReducer,
  },
})