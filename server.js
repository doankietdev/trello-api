/* eslint-disable no-console */
import exitHook from 'async-exit-hook'
import app from '~/app'
import { APP } from '~/configs/environment'
import { closeDB, connectDB } from '~/configs/mongodb'

const startServer = async () => {
  const server = app.listen(APP.PORT, () => {
    console.log(`Server is running on port: ${APP.PORT}`)
  })

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
