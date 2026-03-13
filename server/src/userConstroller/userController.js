import makePair from "./makePair.js"
import adduserToDb from "./addUserToDb.js"
import client from "../redisClient.js"

/*
  MAIN MATCHMAKING FUNCTION
*/
export async function processUserPairing(io, socket) {

  try {

    const userPair = await makePair(socket)

    // No user waiting → put current user in queue
    if (!userPair) {

      await adduserToDb(socket)

      io.to(socket.id).emit(
        "waiting",
        "Waiting for another user to join"
      )

      return
    }

    // Pair found → notify both users
    userPair.forEach(user => {

      io.to(user.socketId).emit(
        "getStrangerData",
        user
      )

    })

  } catch (err) {

    console.log("Pairing error:", err)
    socket.emit("errSelectingPair")

  }

}


/*
  USER LEFT CHAT
  remove them from redis queue
*/
export async function soloUserLeftTheChat(socket) {

  try {

    const check = await client.lRem(
      "users",
      1,
      JSON.stringify({
        socketId: socket.id,
        username: socket.username
      })
    )

    console.log(socket.username, "left the chat", check)

    return check

  } catch (err) {

    console.log(err)

  }

}