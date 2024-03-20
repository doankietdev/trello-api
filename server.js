/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import app from '~/app'
import { connectDB, closeDB } from '~/configs/mongodb'
import { APP, BUILD_MODE } from '~/configs/environment'
import { PROD_ENV } from '~/utils/constants'

const startServer = async () => {
  let server = null
  if (BUILD_MODE === PROD_ENV) {
    server = app.listen(process.env.PORT, () => {
      console.log(`Server is running at ${process.env.PORT}`)
    })
  } else {
    server = app.listen(APP.PORT, APP.HOST, () => {
      console.log(`Server is running at ${APP.HOST}:${APP.PORT}`)
    })
  }

  exitHook(() => {
    closeDB()
      .then(() => {
        console.log('Disconnected from database successfully')
        server.close()
        console.log('Closed server')
      })
      .catch(() => {
        console.log('Disconnect from database failed')
      })
  })
}

;(async () => {
  try {
    await connectDB()
    console.log('Connect to database successfully')
    startServer()
  } catch (error) {
    console.log('Connect to database failed')
    process.exit(1)
  }
})()
